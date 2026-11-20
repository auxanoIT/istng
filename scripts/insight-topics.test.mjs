import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { parse, evaluate } from 'groq-js';
import { typescriptLoader } from './helpers/load-typescript.mjs';
const load=typescriptLoader();
const {solutionPillars}=load('data/enterprise-solutions.ts');
const {resourceServiceOptions}=load('data/resource-relationships.ts');
const {serviceResourceClusters,resourceClusterForValue}=load('data/service-resource-clusters.ts');
const {insightTopics,getInsightTopic,getArticleTopic,articlesForTopic,insightTopicPath}=load('data/insight-topics.ts');

test('Studio sub-service choices use the current six pillars and 41 canonical services, including solar',()=>{
 assert.equal(solutionPillars.length,6);assert.equal(serviceResourceClusters.length,41);
 assert.equal(new Set(serviceResourceClusters.map(x=>x.value)).size,41);
 assert.equal(new Set(serviceResourceClusters.map(x=>x.pillarTitle)).size,6);
 for(const option of resourceServiceOptions){const cluster=serviceResourceClusters.find(x=>x.href===option.value);assert.ok(cluster);assert.equal(cluster.title,option.title);assert.equal(cluster.pillarTitle,option.pillar);assert.equal(resourceClusterForValue(cluster.value),cluster);assert.equal(resourceClusterForValue(cluster.href),cluster);}
 assert.equal(serviceResourceClusters.filter(x=>x.pillarTitle==='Solar Energy & Power Solutions').length,6);
 assert.equal(resourceClusterForValue('/solutions/solar-energy/residential-solar').href,'/services/solar-energy/residential-solar');
 assert.equal(resourceClusterForValue('not-a-current-service'),undefined);
});

test('six topic hubs match the service overviews and topic assignment is unambiguous',()=>{
 assert.equal(insightTopics.length,6);for(const p of solutionPillars){const topic=getInsightTopic(p.slug);assert.equal(topic.serviceHref,p.href);assert.equal(insightTopicPath(topic.slug),'/resources/insights/'+p.slug);}
 assert.equal(getArticleTopic({topic:'solar-energy'}).slug,'solar-energy');
 assert.equal(getArticleTopic({relatedService:'solar-energy/battery-storage'}).slug,'solar-energy');
 assert.equal(getArticleTopic({relatedServices:['/solutions/solar-energy/commercial-solar']}).slug,'solar-energy');
 assert.equal(getArticleTopic({relatedServices:['/services/solar-energy/residential-solar',solutionPillars[1].items[0].href]}),undefined);
 assert.equal(getArticleTopic({topic:'unknown',relatedService:'solar-energy/battery-storage'}),undefined);
 assert.equal(getArticleTopic({}),undefined);
 assert.equal(articlesForTopic([{topic:'solar-energy'},{topic:'security-surveillance'},{relatedService:'solar-energy/battery-storage'}],'solar-energy').length,2);
});

const source=readFileSync(new URL('../sanity/lib/queries.ts',import.meta.url),'utf8');
function query(name){const tick=String.fromCharCode(96),marker='const '+name+' = groq'+tick,start=source.indexOf(marker);assert.ok(start>=0);return source.slice(start+marker.length,source.indexOf(tick,start+marker.length)).replace('${editorialFields}',()=>query('editorialFields'));}

test('topic and pillar fields reach article lists, detail pages and published sitemap records',async()=>{
 const dataset=[{_id:'solar',_type:'post',title:'Solar guide',slug:{current:'solar-guide'},topic:'solar-energy',isPillarGuide:true,relatedService:'solar-energy/battery-storage',relatedServices:['/services/solar-energy/battery-storage'],body:[]},{_id:'security',_type:'post',title:'CCTV',slug:{current:'cctv'},topic:'security-surveillance'},{_id:'drafts.unpublished',_type:'post',title:'Draft guide',slug:{current:'draft-guide'},topic:'solar-energy'}];
 const run=async(name,params={})=>(await evaluate(parse(query(name)),{dataset,params})).get();
 const index=await run('editorialIndexQuery',{type:'post'}),detail=await run('editorialArticleQuery',{type:'post',slug:'solar-guide'}),sitemap=await run('resourceSitemapQuery');
 assert.equal(index.find(x=>x.slug==='solar-guide').isPillarGuide,true);assert.equal(detail.topic,'solar-energy');assert.equal(detail.isPillarGuide,true);
 assert.equal(sitemap.some(x=>x.slug==='draft-guide'),false);assert.equal(sitemap.find(x=>x.slug==='solar-guide').topic,'solar-energy');
 const activeHubs=insightTopics.filter(t=>sitemap.some(r=>r.section==='insights'&&getArticleTopic(r)?.slug===t.slug));assert.equal(activeHubs.length,2);assert.ok(activeHubs.some(t=>t.slug==='solar-energy'));assert.ok(!activeHubs.some(t=>t.slug==='it-services-support'));
});

test('editable CMS clusters remain inside their own service and support future non-solar topics',async()=>{
 const {articlesForCluster,getArticleCluster,insightClusterPath}=load('data/insight-topics.ts');
 const battery={_id:'battery',_type:'insightCluster',title:'Battery Storage',slug:{current:'battery-storage'},topic:'solar-energy',description:'Compare battery storage requirements.'};
 const fibre={_id:'fibre',_type:'insightCluster',title:'Fibre Optic Cabling',slug:{current:'fibre-optic-cabling'},topic:'network-structured-cabling',description:'Understand fibre network planning.'};
 const dataset=[battery,fibre,{_id:'post',_type:'post',title:'Battery sizing',slug:{current:'battery-sizing'},topic:'solar-energy',cluster:{_ref:'battery'},body:[]}];
 const run=async(name,params)=>(await evaluate(parse(query(name)),{dataset,params})).get();
 const clusters=await run('insightClusterIndexQuery',{topic:'solar-energy'});assert.equal(clusters.length,1);assert.equal(clusters[0].slug,'battery-storage');
 assert.equal((await run('insightClusterQuery',{topic:'network-structured-cabling',slug:'fibre-optic-cabling'})).title,'Fibre Optic Cabling');
 assert.equal(await run('insightClusterQuery',{topic:'solar-energy',slug:'fibre-optic-cabling'}),null);
 const post=await run('editorialArticleQuery',{type:'post',slug:'battery-sizing'});assert.equal(getArticleCluster(post).title,'Battery Storage');assert.equal(articlesForCluster([post],'solar-energy','battery-storage').length,1);assert.equal(articlesForCluster([post],'network-structured-cabling','battery-storage').length,0);
 assert.equal(getArticleCluster({...post,topic:'network-structured-cabling'}),undefined);
 assert.equal(insightClusterPath('solar-energy','battery-storage'),'/resources/insights/solar-energy/battery-storage');
 const deleted=dataset.filter(x=>x._id!=='battery');const orphan=(await evaluate(parse(query('editorialArticleQuery')),{dataset:deleted,params:{type:'post',slug:'battery-sizing'}})).get();assert.equal(getArticleCluster(await orphan),undefined);
});

test('a signed topic-cluster webhook invalidates resource caches and sitemap without an article URL',async()=>{
 const tags=[],paths=[];
 const route=typescriptLoader({env:{SANITY_REVALIDATE_SECRET:'local-test-only'},overrides:{'next/cache':{revalidateTag:(...args)=>tags.push(args),revalidatePath:path=>paths.push(path)},'next/server':{NextResponse:{json:(data,init)=>new Response(JSON.stringify(data),{status:init?.status??200})}},'next-sanity/webhook':{parseBody:async()=>({body:{_type:'insightCluster',slug:{current:'battery-storage'}},isValidSignature:true})}}})('app/api/revalidate/route.ts');
 const result=await route.POST(new Request('https://example.test/api/revalidate',{method:'POST'}));assert.equal(result.status,200);assert.ok(tags.some(([tag])=>tag==='resources'));assert.ok(paths.includes('/sitemap.xml'));assert.ok(paths.includes('/resources/insights'));assert.ok(!paths.includes('/resources/insights/battery-storage'));
});
