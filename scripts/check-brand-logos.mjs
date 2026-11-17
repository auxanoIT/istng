import assert from "node:assert/strict";
const base=process.env.QA_BASE_URL||"http://localhost:3100";
for(const asset of ["/brand/integrated_solution_technology.png","/brand/integrated_solution_tech_full_logo.png","/brand/integrated-favicon.png","/apple-touch-icon.png","/icon.png","/opengraph-image"]){
 const response=await fetch(base+asset);assert.equal(response.status,200,asset);
 assert.ok(response.headers.get("content-type")?.startsWith("image/"));
 const bytes=new Uint8Array(await response.arrayBuffer());assert.ok(bytes.length>100,asset);
}
console.log("Current logos, browser icons and social image are available.");
