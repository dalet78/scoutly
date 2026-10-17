import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEmail,emailLink,recipient,subject} from '../assets/prima-di-pubblicare/email.js';
const data={city:'Milano Comune',intent:'Vendere',role:'Proprietario',publication:'Bozza in preparazione',description:'65 m², cucina & balcone.\nPrezzo da verificare.'};
test('email a Scoutly con testo multilinea e caratteri speciali conservati',()=>{const body=buildEmail(data);const url=new URL(emailLink(body));assert.equal(url.pathname,recipient);assert.equal(recipient,'scoutlyhome@gmail.com');assert.equal(url.searchParams.get('subject'),subject);assert.equal(url.searchParams.get('body'),body);assert.ok(body.includes(data.description));});
test('bozza richiesta senza adesione implicita alla consulenza',()=>{assert.match(buildEmail(data),/non sto chiedendo il ricontatto/);assert.doesNotMatch(buildEmail(data),/Richiedo anche un confronto/);});
test('consulenza esplicita mantenuta nel messaggio',()=>{const body=buildEmail({...data,consultation:true});assert.match(body,/Richiedo anche un confronto/);assert.doesNotMatch(body,/non sto chiedendo il ricontatto/);});
