import test from 'node:test';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {mkdtempSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {fileURLToPath} from 'node:url';import {fixture} from './helpers.mjs';import {Store} from '../src/store.mjs';
test('Processo reale: avvio sicuro, worker simulato, arresto pulito e persistenza',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'scoutly-runtime-')),db=join(dir,'private.sqlite'),token='x'.repeat(48);let exited=false,child;
 try{
 child=spawn(process.execPath,[fileURLToPath(new URL('../src/server.mjs',import.meta.url))],{env:{NODE_ENV:'development',PORT:'0',HOST:'127.0.0.1',DATA_PATH:db,ADMIN_TOKEN:token,RATE_LIMIT_SECRET:'r'.repeat(48),ACCEPT_REQUESTS:'true',ENABLE_EMAIL:'true',ENABLE_TELEGRAM:'true',LIVE_NOTIFICATIONS:'false'},stdio:['ignore','pipe','pipe']});
 const exit=new Promise(resolve=>child.once('exit',(code,signal)=>{exited=true;resolve({code,signal});}));
 let output='',stderr='';child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>stderr+=d);
 const start=Date.now();while(!output.includes('Scoutly backend:')){if(exited||Date.now()-start>5000)throw Error('Avvio processo fallito');await new Promise(r=>setTimeout(r,20));}
 const url=output.match(/http:\/\/127\.0\.0\.1:\d+/)[0],f=fixture();const r=await fetch(url+'/v1/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});assert.equal(r.status,201);
 let lead;while(Date.now()-start<5000){const r=await fetch(url+'/v1/admin/leads/'+f.requestId,{headers:{Authorization:`Bearer ${token}`}});lead=await r.json();if(lead.notifications.every(n=>n.status==='simulated'))break;await new Promise(r=>setTimeout(r,50));}
 assert.ok(lead.notifications.every(n=>n.status==='simulated'));assert.ok(!output.includes(f.contact.email));child.kill('SIGTERM');const outcome=await exit;assert.equal(outcome.code,0);assert.equal(stderr,'');const store=new Store(db);try{assert.equal(store.get(f.requestId).notifications.length,2);}finally{store.close();}
 }finally{if(child&&!exited){child.kill('SIGKILL');await new Promise(r=>child.once('exit',r));}rmSync(dir,{recursive:true,force:true});}
});
