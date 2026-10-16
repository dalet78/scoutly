import {existsSync} from 'node:fs';
import {loadConfig} from '../src/config.mjs';import {Store} from '../src/store.mjs';
const destination=process.argv[2];if(!destination)throw Error('Uso: npm run backup -- /percorso/privato/nuovo-backup.sqlite');
const config=loadConfig();const store=(()=>{if(!existsSync(config.dataPath))throw Error('Database inesistente: controllare DATA_PATH');return new Store(config.dataPath);})();try{await store.backupTo(destination);console.log('Backup completato. Mantenerlo privato e applicare la durata di conservazione concordata.');}finally{store.close();}
