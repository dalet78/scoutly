import {createServer} from 'node:http';
import {createHmac,timingSafeEqual} from 'node:crypto';
import {isIP} from 'node:net';
import {normalizeRequest,HttpError} from './validation.mjs';
const response=(status,body,headers={})=>({status,body,headers});
function authorized(headers,config){const provided=headers.authorization;if(!config.adminToken||typeof provided!=='string')return false;const a=Buffer.from(provided),b=Buffer.from(`Bearer ${config.adminToken}`);return a.length===b.length&&timingSafeEqual(a,b);}
export function createApp({store,config,clock=Date.now}){
 async function dispatch({method,path,headers={},body='',ip='127.0.0.1'}){
  headers=Object.fromEntries(Object.entries(headers).map(([k,v])=>[k.toLowerCase(),v]));const h={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
  try{
   const url=new URL(path,'http://local');const route=url.pathname;if(url.search&&!(route==='/v1/admin/leads'&&method==='GET'))throw new HttpError(400,'QUERY_NOT_ALLOWED');
   if(route==='/healthz'&&method==='GET')return response(200,{ok:true},h);
   const admin=route.startsWith('/v1/admin/');
   if(admin){
    if(!authorized(headers,config))throw new HttpError(401,'UNAUTHORIZED');
    // Le credenziali amministrative non sono utilizzabili da pagine cross-origin.
    if(headers.origin)throw new HttpError(403,'ADMIN_ORIGIN_NOT_ALLOWED');
    if(route==='/v1/admin/leads'&&method==='GET'){if([...url.searchParams.keys()].some(k=>!['limit','offset'].includes(k)))throw new HttpError(400,'INVALID_PAGINATION');const limit=Number(url.searchParams.get('limit')||100),offset=Number(url.searchParams.get('offset')||0);if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(offset)||offset<0||offset>1000000)throw new HttpError(400,'INVALID_PAGINATION');return response(200,{leads:store.list(limit,offset),limit,offset},h);}
    if(route==='/v1/admin/export'&&method==='GET'){const leads=[];for(let offset=0;;offset+=100){const batch=store.list(100,offset);leads.push(...batch);if(batch.length<100)break;}return response(200,{schemaVersion:1,exportedAt:new Date(clock()).toISOString(),leads},{...h,'Content-Disposition':'attachment; filename="scoutly-private-export.json"'});}
    const match=route.match(/^\/v1\/admin\/leads\/([a-f\d-]{36})$/i);
    if(match){const id=match[1].toLowerCase();if(method==='GET'){const lead=store.get(id);if(!lead)throw new HttpError(404,'NOT_FOUND');return response(200,lead,h);}if(method==='DELETE'){if(!store.remove(id))throw new HttpError(404,'NOT_FOUND');return response(200,{deleted:true},h);}if(method==='PATCH'){const data=parse(body,headers,config);if(!data||Object.keys(data).length!==1||!['new','contacted','appointment','closed'].includes(data.status))throw new HttpError(422,'INVALID_STATUS');if(!store.updateStatus(id,data.status))throw new HttpError(404,'NOT_FOUND');return response(200,{updated:true},h);}}
    throw new HttpError(404,'NOT_FOUND');
   }
   if(!['/v1/requests','/v1/form-config'].includes(route))throw new HttpError(404,'NOT_FOUND');
   const origin=headers.origin;if(origin&&!config.origins.includes(origin))throw new HttpError(403,'ORIGIN_NOT_ALLOWED');
   if(origin){h['Access-Control-Allow-Origin']=origin;h.Vary='Origin';}
   if(method==='OPTIONS'){if(!origin)throw new HttpError(403,'ORIGIN_REQUIRED');return response(204,null,{...h,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'});}
   if(method==='GET'&&route==='/v1/form-config')return response(200,config.acceptRequests?{enabled:true,schemaVersion:1,controllerName:config.controllerName,privacyUrl:config.privacyUrl,consentVersion:config.consentVersion,consentText:config.consentText,liveNotifications:config.liveNotifications}:{enabled:false},h);
   if(method!=='POST'||route!=='/v1/requests')throw new HttpError(405,'METHOD_NOT_ALLOWED');
   if(!config.acceptRequests)throw new HttpError(503,'INTAKE_DISABLED');
   // CORS non è autenticazione né antispam: richieste senza Origin restano soggette agli stessi limiti.
   const key=createHmac('sha256',config.rateSecret).update(ip).digest('hex');if(!store.allowRate(key,config.rateLimit,config.rateWindowMs,clock()))return response(429,{error:'RATE_LIMITED'},{...h,'Retry-After':String(Math.ceil(config.rateWindowMs/1000))});
   const payload=normalizeRequest(parse(body,headers,config),config);const result=store.accept(payload,config,clock());
   return response(result.duplicate?200:201,{accepted:true,requestId:payload.requestId,duplicate:result.duplicate,receipt:'stored',notificationStatus:config.emailEnabled||config.telegramEnabled?'queued':'disabled'},h);
  }catch(e){return response(e instanceof HttpError?e.status:500,{error:e instanceof HttpError?e.code:'INTERNAL_ERROR'},h);}
 }
 const handler=async(req,res)=>{
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  const chunks=[];let size=0;
  try{
   const length=Number(req.headers['content-length']);if(Number.isFinite(length)&&length>config.maxBodyBytes)throw new HttpError(413,'PAYLOAD_TOO_LARGE');
   for await(const chunk of req){size+=chunk.length;if(size>config.maxBodyBytes)throw new HttpError(413,'PAYLOAD_TOO_LARGE');chunks.push(chunk);}
   let ip=req.socket.remoteAddress||'unknown';if(config.trustedProxyIps.includes(ip)&&typeof req.headers['x-real-ip']==='string'&&isIP(req.headers['x-real-ip']))ip=req.headers['x-real-ip'];
   const out=await dispatch({method:req.method,path:req.url,headers:req.headers,body:Buffer.concat(chunks).toString('utf8'),ip});res.writeHead(out.status,{...headers,...out.headers});res.end(out.body===null?'':JSON.stringify(out.body));
  }catch(e){res.writeHead(e instanceof HttpError?e.status:500,headers);res.end(JSON.stringify({error:e instanceof HttpError?e.code:'INTERNAL_ERROR'}));}
 };
 return {dispatch,handler,server:()=>{const server=createServer(handler);server.requestTimeout=15000;server.headersTimeout=10000;server.maxRequestsPerSocket=100;return server;}};
}
function parse(body,headers,config){if(Buffer.byteLength(body)>config.maxBodyBytes)throw new HttpError(413,'PAYLOAD_TOO_LARGE');if(!/^application\/json(?:\s*;.*)?$/i.test(headers['content-type']||''))throw new HttpError(415,'JSON_REQUIRED');try{return JSON.parse(body);}catch{throw new HttpError(400,'INVALID_JSON');}}
