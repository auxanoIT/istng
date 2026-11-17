import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const base = process.env.QA_BASE_URL || "http://localhost:3100";
const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://istng.com").origin;
const decode = value => value.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");
const retiredBrand = /ideal[\s_-]*solutions?|auxano[\s_-]*solutions?/i;
const errors = [], warnings = [], pages = [];
const request = url => fetch(url,{redirect:"manual",signal:AbortSignal.timeout(45000),headers:{"Cache-Control":"no-cache"}});
const xmlResponse = await request(base + "/sitemap.xml");
assert.equal(xmlResponse.status,200,"Sitemap HTTP status");
const xml = await xmlResponse.text();
assert.ok(!retiredBrand.test(xml),"Retired brand in sitemap");
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([,part])=>({
  url:decode(part.match(/<loc>(.*?)<\/loc>/)?.[1] || ""),
  images:[...part.matchAll(/<image:loc>(.*?)<\/image:loc>/g)].map(([,value])=>decode(value)),
}));
assert.ok(entries.length>0,"Empty sitemap");
assert.equal(new Set(entries.map(entry=>entry.url)).size,entries.length,"Duplicate canonical sitemap URLs");
const allImages = new Set();
for(const entry of entries){
  const url = new URL(entry.url);
  assert.equal(url.origin,origin,"Wrong sitemap origin");
  assert.ok(!url.search&&!url.hash,"Query or fragment in sitemap");
  assert.ok(!/^\/(api|sanity|studio|contact|terms|privacy)(\/|$)/.test(url.pathname),"Private or excluded page in sitemap");
  assert.equal(entry.images.length,new Set(entry.images).size,"Duplicate images on page");
  for(const image of entry.images){
    assert.equal(new URL(image).protocol,"https:","Non-HTTPS image");
    allImages.add(image);
    if(new URL(image).origin===origin&&!fs.existsSync(path.join("public",decodeURIComponent(new URL(image).pathname))))errors.push({url:entry.url,message:"Missing image",image});
  }
}
const titles = new Map(), descriptions = new Map(), internalLinks = new Set();
async function inspect(entry){
 try {
  const route = new URL(entry.url).pathname;
  const response = await request(base+route);
  if(response.status!==200){errors.push({url:entry.url,message:"Non-200 sitemap target",status:response.status});return;}
  const html = await response.text();
  const title=decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||"").trim();
  const description=decode(html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)?.[1]||"").trim();
  const canonical=decode(html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1]||"");
  const robots=html.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/i)?.[1]||"";
  if(!title)errors.push({url:entry.url,message:"Missing title"});
  if(!description)errors.push({url:entry.url,message:"Missing description"});
  if(!canonical || new URL(canonical).href!==new URL(entry.url).href)errors.push({url:entry.url,message:"Canonical mismatch",canonical});
  if(/noindex/i.test(robots))errors.push({url:entry.url,message:"Noindex page in sitemap"});
  if((html.match(/<h1(?:\s|>)/gi)||[]).length!==1)errors.push({url:entry.url,message:"Expected one H1"});
  if(retiredBrand.test(html))errors.push({url:entry.url,message:"Retired branding in rendered HTML"});
  if(titles.has(title))errors.push({url:entry.url,message:"Duplicate title",other:titles.get(title),title});else titles.set(title,entry.url);
  if(descriptions.has(description))warnings.push({url:entry.url,message:"Shared description",other:descriptions.get(description)});else descriptions.set(description,entry.url);
  if(title.length>100)warnings.push({url:entry.url,message:"Long title",length:title.length});
  for(const [,json]of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){
    try{JSON.parse(json);}catch{errors.push({url:entry.url,message:"Invalid JSON-LD"});}
  }
  if(!html.includes("ask@istng.com")||!html.includes("26A Adeshina Street"))errors.push({url:entry.url,message:"Confirmed contact details missing"});
  for(const [,href]of html.matchAll(/<a\b[^>]*href="([^"]*)"/gi)){
   const target=decode(href);if(target.startsWith("/")&&!target.startsWith("//")&&!/^\/(?:_next|api|image|brand|integrated-assets)\//.test(target))internalLinks.add(new URL(target,origin).pathname);
  }
  pages.push({url:entry.url,title,description,imageCount:entry.images.length});
  console.log("SEO OK "+route);
 }catch(error){errors.push({url:entry.url,message:error.message});}
}
let cursor=0;
await Promise.all(Array.from({length:4},async()=>{while(cursor<entries.length){const index=cursor++;await inspect(entries[index]);}}));
const brokenLinks=[];
let linkCursor=0;const paths=[...internalLinks];
await Promise.all(Array.from({length:4},async()=>{while(linkCursor<paths.length){const route=paths[linkCursor++];try{const r=await request(base+route);if(r.status>=400)brokenLinks.push({route,status:r.status});}catch(error){brokenLinks.push({route,message:error.message});}}}));
errors.push(...brokenLinks.map(link=>({message:"Broken internal link",...link})));
const robotsResponse=await request(base+"/robots.txt");const robots=await robotsResponse.text();
if(robotsResponse.status!==200||!robots.includes(origin+"/sitemap.xml"))errors.push({message:"Robots sitemap declaration incorrect"});
if(!robots.includes("Disallow: /api/")||!robots.includes("Disallow: /sanity"))errors.push({message:"Administrative crawl exclusions missing"});
const llms=await(await request(base+"/llms.txt")).text();if(retiredBrand.test(llms)||!llms.includes("ask@istng.com"))errors.push({message:"Reference file contains stale identity"});
const report={checkedAt:new Date().toISOString(),canonicalOrigin:origin,base,sitemapPages:entries.length,checkedPages:pages.length,pageImageEntries:entries.reduce((sum,entry)=>sum+entry.images.length,0),uniqueImages:allImages.size,internalPathsChecked:paths.length,errors,warnings,pages};
fs.mkdirSync("docs",{recursive:true});fs.writeFileSync("docs/seo-audit-report.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({pages:pages.length,images:allImages.size,internalPaths:paths.length,errors,warnings:warnings.length},null,2));
assert.equal(errors.length,0,"SEO audit failed; see docs/seo-audit-report.json");
