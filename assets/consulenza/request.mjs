export const TOPICS=['Vendita','Affitto','Presentazione dell’annuncio','Altro'];
export function consultationPayload(data,id){
 const get=key=>String(data.get(key)||'').trim();
 const name=get('name'),email=get('email'),municipality=get('municipality_name'),topic=get('consultation_topic'),phone=get('phone'),description=get('description');
 if(!name||name.length>80||!email||email.length>254||municipality.length<2||municipality.length>120||!TOPICS.includes(topic)||phone.length>30||description.length>1000||!data.get('service_request'))throw new Error('Completa i campi richiesti e conferma la richiesta di ricontatto.');
 return {idempotency_key:id,form_id:'consulenza',form_version:1,workflow_id:'richiesta-consulenza-diretta',name,email,municipality_name:municipality,consultation_topic:topic,phone:phone||null,description,service_requested:true,consultation_requested:true};
}
