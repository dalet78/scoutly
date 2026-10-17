export async function submitRequest(body,{fetchImpl=fetch,signal}={}){
 const response=await fetchImpl('https://formsubmit.co/ajax/david.perugia78@gmail.com',{method:'POST',headers:{Accept:'application/json'},body,signal});
 if(!response.ok)throw new Error('Risposta del servizio non riuscita');
 const result=await response.json();
 if(result?.success!==true&&result?.success!=='true')throw new Error('Il servizio non ha confermato la richiesta');
 return result;
}
