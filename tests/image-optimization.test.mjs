import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dimensions,optimizeImage} from '../assets/prima-di-pubblicare/optimize-images.mjs';
test('resize respects aspect ratio, portrait orientation and never enlarges',()=>{
 assert.deepEqual(dimensions(6000,4000,1920),{width:1920,height:1280});
 assert.deepEqual(dimensions(4000,6000,2800),{width:1867,height:2800});
 assert.deepEqual(dimensions(800,600,1920),{width:800,height:600});
 assert.throws(()=>dimensions(0,600,1920));
});
test('unsupported and oversized files fail before decoding',async()=>{
 await assert.rejects(()=>optimizeImage({type:'application/pdf',size:1}),/JPG/);
 await assert.rejects(()=>optimizeImage({type:'image/jpeg',size:40000001}),/40 MB/);
});
