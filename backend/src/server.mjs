import {loadConfig} from './config.mjs';import {Store} from './store.mjs';import {createApp} from './app.mjs';import {processNext} from './notifications.mjs';
const config=loadConfig();const store=new Store(config.dataPath);const server=createApp({store,config}).server();let busy=false,stopping=false;
server.listen(config.port,config.host,()=>console.log(`Scoutly backend: http://${config.host}:${server.address().port} | intake=${config.acceptRequests} | liveNotifications=${config.liveNotifications}`));
const timer=setInterval(async()=>{if(busy||stopping)return;busy=true;try{for(let i=0;i<20&&!stopping;i++)if(!await processNext(store,config))break;}catch{console.error('NOTIFICATION_WORKER_ERROR');}finally{busy=false;}},1000);
async function stop(){if(stopping)return;stopping=true;clearInterval(timer);const closed=new Promise(resolve=>server.close(resolve));server.closeIdleConnections();await closed;while(busy)await new Promise(r=>setTimeout(r,25));store.close();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
