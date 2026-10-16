export class HttpError extends Error{constructor(status,code){super(code);this.status=status;this.code=code;}}
const fail=()=>{throw new HttpError(422,'INVALID_REQUEST');};
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function keys(o,allowed){if(!object(o)||Object.keys(o).some(k=>!allowed.includes(k)))fail();}
function text(v,min,max){if(typeof v!=='string')fail();const t=v.trim();if(t.length<min||t.length>max||/[\u0000-\u001f\u007f]/u.test(t))fail();return t;}
function choice(v,options){if(!options.includes(v))fail();return v;}
export function normalizeRequest(raw,config){
 keys(raw,['schemaVersion','requestId','contact','property','preparation','consent','source','website']);
 if(raw.schemaVersion!==1||typeof raw.requestId!=='string'||!/^\w{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(raw.requestId)||!/^[a-f\d-]+$/i.test(raw.requestId))fail();
 if(raw.website!==undefined&&raw.website!=='')fail();
 keys(raw.contact,['name','email','phone','preferredChannel','timeSlot','requestedContact']);
 const c=raw.contact;if(c.requestedContact!==true)throw new HttpError(422,'CONTACT_REQUEST_REQUIRED');
 const email=c.email==null||c.email===''?'':text(c.email,3,254).toLowerCase();
 const phone=c.phone==null||c.phone===''?'':text(c.phone,7,40).replace(/[\s().-]/g,'');
 if(email&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))fail();
 if(phone&&!/^\+?\d{7,15}$/.test(phone))fail();
 const channel=choice(c.preferredChannel,['email','phone']);if(channel==='email'&&!email||channel==='phone'&&!phone)fail();
 const contact={name:text(c.name,2,100),email,phone,preferredChannel:channel,timeSlot:choice(c.timeSlot,['morning','afternoon','evening','any']),requestedContact:true};
 keys(raw.property,['city','type','role','intent','timing','publication']);const p=raw.property;
 const property={city:choice(p.city,['milano','other','unknown']),type:choice(p.type,['apartment','house','room','other']),role:choice(p.role,['owner','authorized','other']),intent:choice(p.intent,['sale','rent','unsure']),timing:choice(p.timing,['30','90','later','unknown']),publication:choice(p.publication,['not-started','draft','online'])};
 keys(raw.preparation,['info','documents','price','photos','description']);const preparation={};for(const k of ['info','documents','price','photos','description'])preparation[k]=choice(raw.preparation[k],['yes','partial','no','unknown']);
 keys(raw.consent,['accepted','version']);if(raw.consent.accepted!==true)throw new HttpError(422,'CONSENT_REQUIRED');if(raw.consent.version!==config.consentVersion)throw new HttpError(409,'CONSENT_VERSION_CHANGED');
 keys(raw.source,['tool','variant','campaign']);if(raw.source.tool!=='prima-di-pubblicare'||raw.source.variant!=='B')fail();
 const campaign=raw.source.campaign==null?'':text(raw.source.campaign,0,80);if(!/^[a-zA-Z0-9_-]*$/.test(campaign))fail();
 return {schemaVersion:1,requestId:raw.requestId.toLowerCase(),contact,property,preparation,consent:{accepted:true,version:config.consentVersion},source:{tool:'prima-di-pubblicare',variant:'B',campaign}};
}
export function segmentRequest(property){if(property.city!=='milano'||!['owner','authorized'].includes(property.role)||!['apartment','house'].includes(property.type))return 'review_scope';if(property.publication==='online')return 'already_published';if(!['sale','rent'].includes(property.intent)||!['30','90'].includes(property.timing))return 'exploratory';return 'pre_publication_declared';}
