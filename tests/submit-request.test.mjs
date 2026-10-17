import test from 'node:test';
import assert from 'node:assert/strict';
import {submitRequest} from '../assets/prima-di-pubblicare/submit-request.js';
test('conferma solo su risposta positiva esplicita, preservando body multipart',async()=>{
 const body={fake:'multipart-fixture'};
 for(const success of [true,'true'])await submitRequest(body,{fetchImpl:async(url,options)=>{assert.equal(url,'https://formsubmit.co/ajax/david.perugia78@gmail.com');assert.equal(options.body,body);assert.equal(options.headers.Accept,'application/json');assert.equal(options.headers['Content-Type'],undefined);return {ok:true,json:async()=>({success})};}});
});
test('rifiuta errore HTTP, risultato negativo o inatteso',async()=>{
 for(const response of [{ok:false},{ok:true,json:async()=>({success:false})},{ok:true,json:async()=>({})},{ok:true,json:async()=>{throw Error('HTML ricevuto');}}])await assert.rejects(submitRequest({}, {fetchImpl:async()=>response}));
});
test('non ritenta automaticamente quando la rete fallisce',async()=>{
 let calls=0;await assert.rejects(submitRequest({}, {fetchImpl:async()=>{calls++;throw Error('timeout');}}));assert.equal(calls,1);
});
