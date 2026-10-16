import {existsSync} from 'node:fs';
import {loadConfig} from '../src/config.mjs';import {Store} from '../src/store.mjs';
const config=loadConfig();if(!process.argv.includes('--confirm'))throw Error('Definire RETENTION_DAYS ed eseguire con --confirm per cancellare i record scaduti');const store=(()=>{if(!existsSync(config.dataPath))throw Error('Database inesistente: controllare DATA_PATH');return new Store(config.dataPath);})();try{console.log(`Record scaduti eliminati: ${store.purge(config.retentionDays)}`);}finally{store.close();}
