import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../assets/modern.css',import.meta.url),'utf8');
const tokens=Object.fromEntries([...css.matchAll(/(--modern-[\w-]+):\s*(#[0-9a-f]{6})/gi)].map(m=>[m[1],m[2]]));
function luminance(hex){
 const channels=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
for(const [foreground,background] of [
 ['--modern-text','--modern-bg'],['--modern-secondary','--modern-bg'],
 ['--modern-text','--modern-panel'],['--modern-secondary','--modern-panel'],
 ['--modern-lime','--modern-bg'],['--modern-ink','--modern-lime'],
 ['--modern-ink','--modern-paper'],['--modern-muted','--modern-paper'],
]) test(`normal text contrast: ${foreground} on ${background}`,()=>{
 const ratio=contrast(tokens[foreground],tokens[background]);
 assert.ok(ratio>=4.5,`${ratio.toFixed(2)}:1 is below 4.5:1`);
});
for(const [label,fg,bg] of [['placeholder','#596b74','#ffffff'],['error','#a3212c','#f6f7f0'],['disabled button','#47575e','#dbe1e1'],['selection label','#19303a','#e7eddf']])test(label+' remains readable',()=>assert.ok(contrast(fg,bg)>=4.5));
test('every active route including receipts loads the shared theme after existing styles',()=>{
 for(const path of ['prima-di-pubblicare','ristrutturare-o-vendere','richiesta-inviata','richiesta-ristrutturare-inviata']){
  const html=readFileSync(new URL(`../tools/${path}.html`,import.meta.url),'utf8');
  assert.match(html,/<body class="modern-service"/);
  assert.ok(html.lastIndexOf('modern.css')>html.lastIndexOf('</style>'));
  assert.match(html,/href="\.\.\/assets\/modern\.css\?v=20261022"/);
 }
});
test('home links directly to both existing service routes without demo handlers',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(html,/href="tools\/prima-di-pubblicare.html"/);
 assert.match(html,/href="tools\/ristrutturare-o-vendere.html"/);
 assert.doesNotMatch(html,/data-tool=|data-jump=|<script/);
});
