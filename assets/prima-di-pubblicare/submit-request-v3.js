export async function submitRequest(body,{fetchImpl=fetch,signal}={}){
 const response=await fetchImpl('https://formsubmit.co/ajax/david.perugia78@gmail.com',{method:'POST',referrer:'https://dalet78.github.io/scoutly/tools/prima-di-pubblicare.html',referrerPolicy:'unsafe-url',headers:{Accept:'application/json'},body,signal});
 if(!response.ok)throw new Error('Risposta del servizio non riuscita');
 const result=await response.json();
 if(result?.success!==true&&result?.success!=='true'){const error=new Error('Il servizio non ha confermato la richiesta');error.code=/needs activation/i.test(String(result?.message||''))?'activation_required':'unconfirmed';throw error;}
 return result;
}
