import {DatabaseSync,backup} from 'node:sqlite';
import {readFileSync,mkdirSync,chmodSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {HttpError,segmentRequest} from './validation.mjs';
export class Store{
 constructor(path){this.path=path;if(path!==':memory:'){mkdirSync(dirname(resolve(path)),{recursive:true,mode:0o700});}this.db=new DatabaseSync(path,{timeout:5000});this.db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA secure_delete=ON;');if(path!==':memory:')chmodSync(path,0o600);const version=this.db.prepare('PRAGMA user_version').get().user_version;if(version===0){this.transaction(()=>this.db.exec(readFileSync(new URL('../migrations/001-init.sql',import.meta.url),'utf8')));}else if(version!==1){this.db.close();throw Error('Versione database non supportata');}}
 transaction(fn){this.db.exec('BEGIN IMMEDIATE');try{const result=fn();this.db.exec('COMMIT');return result;}catch(e){this.db.exec('ROLLBACK');throw e;}}
 accept(payload,config,now=Date.now()){
  const hash=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return this.transaction(()=>{const previous=this.db.prepare('SELECT payload_hash FROM leads WHERE request_id=?').get(payload.requestId);if(previous){if(previous.payload_hash!==hash)throw new HttpError(409,'IDEMPOTENCY_CONFLICT');return {duplicate:true};}
   const stored={...payload,consent:{...payload.consent,text:config.consentText,controllerName:config.controllerName,privacyUrl:config.privacyUrl},segment:segmentRequest(payload.property)};
   this.db.prepare('INSERT INTO leads(request_id,payload_hash,payload_json,received_at) VALUES(?,?,?,?)').run(payload.requestId,hash,JSON.stringify(stored),now);
   const add=(channel,target)=>this.db.prepare('INSERT INTO notifications(id,request_id,channel,target_json,next_attempt_at,created_at) VALUES(?,?,?,?,?,?)').run(randomUUID(),payload.requestId,channel,JSON.stringify(target),now,now);
   if(config.emailEnabled)add('email',{from:config.emailFrom,to:config.emailTo});if(config.telegramEnabled)add('telegram',{chatId:config.telegramChat});return {duplicate:false};
  });
 }
 get(id){const r=this.db.prepare('SELECT * FROM leads WHERE request_id=?').get(id);return r?{requestId:r.request_id,receivedAt:new Date(r.received_at).toISOString(),status:r.workflow_status,...JSON.parse(r.payload_json),notifications:this.db.prepare('SELECT id,channel,status,attempts,next_attempt_at,last_error,provider_id FROM notifications WHERE request_id=?').all(id)}:null;}
 list(limit=100,offset=0){return this.db.prepare('SELECT request_id FROM leads ORDER BY received_at DESC,request_id LIMIT ? OFFSET ?').all(limit,offset).map(r=>this.get(r.request_id));}
 remove(id){return this.db.prepare('DELETE FROM leads WHERE request_id=?').run(id).changes>0;}
 updateStatus(id,status){return this.db.prepare('UPDATE leads SET workflow_status=? WHERE request_id=?').run(status,id).changes>0;}
 allowRate(key,limit,windowMs,now=Date.now()){
  return this.transaction(()=>{this.db.prepare('DELETE FROM rate_limits WHERE window_start<?').run(now-windowMs*2);const r=this.db.prepare('SELECT * FROM rate_limits WHERE key=?').get(key);if(!r||now-r.window_start>=windowMs){this.db.prepare('INSERT INTO rate_limits(key,window_start,hits) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET window_start=excluded.window_start,hits=1').run(key,now);return true;}if(r.hits>=limit)return false;this.db.prepare('UPDATE rate_limits SET hits=hits+1 WHERE key=?').run(key);return true;});
 }
 claim(config,now=Date.now()){
  return this.transaction(()=>{this.db.prepare("UPDATE notifications SET status='failed',lease_token=NULL,lease_until=NULL,last_error='LEASE_EXPIRED_MAX_ATTEMPTS' WHERE status='processing' AND lease_until<=? AND attempts>=?").run(now,config.maxAttempts);
   const r=this.db.prepare("SELECT * FROM notifications WHERE attempts<? AND ((status='pending' AND next_attempt_at<=?) OR (status='processing' AND lease_until<=?)) ORDER BY next_attempt_at,id LIMIT 1").get(config.maxAttempts,now,now);if(!r)return null;
   const token=randomUUID();this.db.prepare("UPDATE notifications SET status='processing',attempts=attempts+1,lease_until=?,lease_token=? WHERE id=?").run(now+config.leaseMs,token,r.id);return {...r,attempts:r.attempts+1,lease_token:token,target:JSON.parse(r.target_json)};});
 }
 finish(job,status,providerId=null){return this.db.prepare("UPDATE notifications SET status=?,provider_id=?,lease_token=NULL,lease_until=NULL,last_error=NULL WHERE id=? AND status='processing' AND lease_token=?").run(status,providerId,job.id,job.lease_token).changes;}
 fail(job,code,config,now=Date.now(),retryAfterMs=0){const delay=Math.max(60000*2**(job.attempts-1),retryAfterMs);this.db.prepare("UPDATE notifications SET status=?,last_error=?,next_attempt_at=?,lease_token=NULL,lease_until=NULL WHERE id=? AND status='processing' AND lease_token=?").run(job.attempts>=config.maxAttempts?'failed':'pending',code,now+Math.min(delay,86400000),job.id,job.lease_token);}
 purge(days,now=Date.now()){if(!Number.isInteger(days)||days<1)throw Error('Durata di conservazione non definita');return this.db.prepare('DELETE FROM leads WHERE received_at<?').run(now-days*86400000).changes;}
 async backupTo(destination){if(existsSync(destination)||resolve(destination)===resolve(this.path))throw Error('Il backup deve essere un nuovo file');mkdirSync(dirname(resolve(destination)),{recursive:true,mode:0o700});await backup(this.db,destination);chmodSync(destination,0o600);}
 close(){this.db.close();}
}
