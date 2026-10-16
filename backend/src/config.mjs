import {randomBytes} from 'node:crypto';
import {resolve} from 'node:path';
const bool=(v,fallback=false)=>v==null?fallback:v==='true';
function integer(value,fallback,min,max,name){const n=value==null?fallback:Number(value);if(!Number.isInteger(n)||n<min||n>max)throw Error(`Configurazione non valida: ${name}`);return n;}
function httpsUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.hash;}catch{return false;}}
const mail=v=>typeof v==='string'&&/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v)&&v.length<=254;
export function loadConfig(env=process.env){
 const production=env.NODE_ENV==='production';
 const origins=(env.ALLOWED_ORIGINS||'http://127.0.0.1:4187,http://localhost:4187').split(',').map(s=>s.trim()).filter(Boolean);
 if(!origins.length||origins.some(o=>{try{const u=new URL(o);return u.origin!==o||!['https:','http:'].includes(u.protocol)||(production&&u.protocol!=='https:');}catch{return true;}}))throw Error('Configurare origini esatte consentite');
 const config={production,host:env.HOST||'127.0.0.1',port:integer(env.PORT,4190,0,65535,'PORT'),dataPath:resolve(env.DATA_PATH||'.data/scoutly.sqlite'),adminToken:env.ADMIN_TOKEN||'',rateSecret:env.RATE_LIMIT_SECRET||randomBytes(32).toString('hex'),origins,
 acceptRequests:bool(env.ACCEPT_REQUESTS),liveNotifications:bool(env.LIVE_NOTIFICATIONS),emailEnabled:bool(env.ENABLE_EMAIL),telegramEnabled:bool(env.ENABLE_TELEGRAM),
 controllerName:env.CONTROLLER_NAME||'Scoutly - anteprima',privacyUrl:env.PRIVACY_URL||'https://example.invalid/privacy',consentVersion:env.CONSENT_VERSION||'callback-v1',consentText:env.CONSENT_TEXT||'Chiedo il ricontatto del soggetto indicato per questa richiesta e confermo di aver letto l’informativa.',
 retentionDays:integer(env.RETENTION_DAYS,0,0,3650,'RETENTION_DAYS'),emailFrom:env.EMAIL_FROM||'',emailTo:env.EMAIL_TO||'',resendKey:env.RESEND_API_KEY||'',telegramToken:env.TELEGRAM_BOT_TOKEN||'',telegramChat:env.TELEGRAM_CHAT_ID||'',trustedProxyIps:(env.TRUSTED_PROXY_IPS||'').split(',').map(s=>s.trim()).filter(Boolean),
 maxBodyBytes:16384,rateLimit:10,rateWindowMs:60000,notificationTimeoutMs:10000,leaseMs:60000,maxAttempts:5};
 if(config.adminToken&&config.adminToken.length<32)throw Error('ADMIN_TOKEN richiede almeno 32 caratteri');
 if(!httpsUrl(config.privacyUrl)||!config.controllerName.trim()||!config.consentText.trim()||!config.consentVersion.trim())throw Error('Configurazione informativa e richiesta incompleta');
 if(production){
  if(config.adminToken.length<32||!env.RATE_LIMIT_SECRET||env.RATE_LIMIT_SECRET.length<32)throw Error('Segreti amministrativi e rate limit necessari in produzione');
  if(config.acceptRequests&&(config.retentionDays===0||new URL(config.privacyUrl).hostname.endsWith('.invalid')||!env.CONTROLLER_NAME||!env.CONSENT_TEXT||!env.CONSENT_VERSION))throw Error('Definire durata, soggetto e informativa reali prima di accettare richieste');
 }
 if(config.liveNotifications){
  if(config.emailEnabled&&(!mail(config.emailFrom)||!mail(config.emailTo)||!config.resendKey))throw Error('Configurazione email incompleta');
  if(config.telegramEnabled&&(!/^\d+:[A-Za-z0-9_-]+$/.test(config.telegramToken)||!/^(-?\d+|@[A-Za-z0-9_]+)$/.test(config.telegramChat)))throw Error('Configurazione Telegram incompleta');
 }
 if(config.emailEnabled&&(!config.emailFrom||!config.emailTo)&&!config.liveNotifications){config.emailFrom='demo@example.invalid';config.emailTo='agent@example.invalid';}
 if(config.telegramEnabled&&!config.telegramChat&&!config.liveNotifications)config.telegramChat='simulation';
 return Object.freeze(config);
}
