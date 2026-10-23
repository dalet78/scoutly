export const MAX_PHOTOS=10;
export const MAX_BYTES=8_000_000;
export function validatePhotos(files){
 if(files.length>MAX_PHOTOS)return 'Puoi caricare al massimo 10 immagini.';
 if(files.some(file=>!['image/jpeg','image/png'].includes(file.type)))return 'Scegli soltanto foto JPG o PNG. Converti prima eventuali foto HEIC.';
 if(files.some(file=>file.size===0))return 'Una delle foto è vuota: rimuovila e seleziona un altro file.';
 if(files.reduce((total,file)=>total+file.size,0)>MAX_BYTES)return 'Le foto superano 8 MB complessivi. Riduci le dimensioni oppure inviane meno.';
 return '';
}
