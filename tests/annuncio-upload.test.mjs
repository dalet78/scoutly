import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePhotos,MAX_BYTES} from '../assets/prima-di-pubblicare/upload-v3.js';
const jpg={type:'image/jpeg',size:120000};
test('testo senza foto e immagini consentite',()=>{assert.equal(validatePhotos([]),'');assert.equal(validatePhotos([jpg,{type:'image/png',size:200000}]),'');});
test('limite aggregato, non solo per file',()=>{assert.equal(validatePhotos([{...jpg,size:MAX_BYTES}]),'');assert.match(validatePhotos([{...jpg,size:MAX_BYTES},jpg]),/8 MB/);});
test('rifiuta formati non supportati e file vuoti',()=>{for(const type of ['image/heic','image/svg+xml','text/html',''])assert.match(validatePhotos([{type,size:100}]),/JPG o PNG/);assert.match(validatePhotos([{...jpg,size:0}]),/vuota/);});
test('massimo otto foto',()=>{assert.equal(validatePhotos(Array(8).fill(jpg)),'');assert.match(validatePhotos(Array(9).fill(jpg)),/8 foto/);});
