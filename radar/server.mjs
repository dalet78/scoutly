import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('./dist/',import.meta.url);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8'};
http.createServer(async(req,res)=>{try{const name=new URL(req.url,'http://localhost').pathname;if(!['/','/index.html','/app.js','/agents.js','/state.js','/styles.css','/data.json','/research.json'].includes(name)){res.writeHead(404);res.end();return;}const path=name==='/'?'index.html':name.slice(1);const body=await readFile(fileURLToPath(new URL(path,root)));res.writeHead(200,{'Content-Type':types[path.slice(path.lastIndexOf('.'))]});res.end(body);}catch{res.writeHead(500);res.end('Errore di lettura');}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
