import test from 'node:test';import assert from 'node:assert/strict';import http from 'node:http';import {Store} from '../src/store.mjs';import {createApp} from '../src/app.mjs';import {fixture,testConfig} from './helpers.mjs';
test('HTTP reale: richiesta, retry, rate limit, admin, JSON UTF-8 diviso e body eccessivo',async t=>{
 const config=testConfig({rateLimit:3});const store=new Store(':memory:');const server=createApp({store,config}).server();
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 t.after(async()=>{await new Promise(r=>{server.close(r);server.closeAllConnections();});store.close();});const url=`http://127.0.0.1:${server.address().port}`;
 const f=fixture();f.contact.name='È una prova';const bytes=Buffer.from(JSON.stringify(f));const split=bytes.indexOf(Buffer.from('È'))+1;
 const first=await new Promise((resolve,reject)=>{const req=http.request(url+'/v1/requests',{method:'POST',headers:{'Content-Type':'application/json',Origin:config.origins[0]}},res=>{let data='';res.on('data',chunk=>data+=chunk);res.on('end',()=>resolve({status:res.statusCode,data:JSON.parse(data)}));});req.on('error',reject);req.write(bytes.subarray(0,split));setTimeout(()=>req.end(bytes.subarray(split)),5);});assert.equal(first.status,201);assert.equal(store.get(f.requestId).contact.name,'È una prova');
 let r=await fetch(url+'/v1/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});assert.equal(r.status,200);assert.equal((await r.json()).duplicate,true);
 r=await fetch(url+'/v1/admin/leads');assert.equal(r.status,401);r=await fetch(url+'/v1/admin/leads?limit=1&offset=0',{headers:{Authorization:`Bearer ${config.adminToken}`}});assert.equal(r.status,200);assert.equal((await r.json()).leads.length,1);
 r=await fetch(url+'/v1/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fixture())});assert.equal(r.status,201);r=await fetch(url+'/v1/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fixture())});assert.equal(r.status,429);
 r=await fetch(url+'/v1/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:'x'.repeat(20000)});assert.equal(r.status,413);
 r=await fetch(url+'/v1/form-config',{headers:{Origin:'https://evil.invalid'}});assert.equal(r.status,403);assert.equal(r.headers.get('access-control-allow-origin'),null);
});
