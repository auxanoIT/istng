import assert from "node:assert/strict";
const base=process.env.QA_BASE_URL||"http://localhost:3100";
const retired=/ideal[\s_-]*solutions?|auxano[\s_-]*solutions?/i;
for(const route of ["/","/about","/solutions","/book-consultation","/sitemap.xml","/llms.txt"]){
 const response=await fetch(base+route);assert.equal(response.status,200,route);
 const body=await response.text();assert.ok(!retired.test(body),"Retired brand at "+route);
 if(!route.endsWith(".xml"))assert.ok(body.includes("Integrated Solutions"),"Business name missing at "+route);
}
console.log("Current business identity verified in website, sitemap and reference summary.");
