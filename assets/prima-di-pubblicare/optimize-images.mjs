// Originals stay on the device. Only the optimized copies are submitted.
export function dimensions(width,height,maxEdge){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw new Error('Immagine non leggibile.');
 const scale=Math.min(1,maxEdge/Math.max(width,height));
 return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
}
export async function optimizeImage(file,{plan=false}={}){
 if(!['image/jpeg','image/png'].includes(file.type)||!file.size)throw new Error('Seleziona immagini JPG o PNG non vuote. Converti prima eventuali file HEIC o PDF.');
 if(file.size>40_000_000)throw new Error('Questa immagine supera 40 MB: esporta prima una copia più piccola.');
 const url=URL.createObjectURL(file);let image;
 try{
  image=new Image();image.src=url;await image.decode();
  const size=dimensions(image.naturalWidth,image.naturalHeight,plan?2800:1920);
  const canvas=document.createElement('canvas');canvas.width=size.width;canvas.height=size.height;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Ottimizzazione non disponibile nel browser.');
  ctx.fillStyle='#ffffff';ctx.fillRect(0,0,size.width,size.height);ctx.drawImage(image,0,0,size.width,size.height);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',plan?0.92:0.8));
  canvas.width=canvas.height=1;
  if(!blob)throw new Error('Impossibile ottimizzare l’immagine. Prova un altro file.');
  // Re-encoding also avoids forwarding the original embedded location metadata.
  return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg',lastModified:file.lastModified});
 }finally{URL.revokeObjectURL(url);if(image)image.src='';}
}
