import * as feAdmin from 'firebase-admin';
import { readFileSync } from 'fs';
import { GOOGLE_APPLICATION_CREDENTIALS } from './config';

const serviceAccount = readFileSync(GOOGLE_APPLICATION_CREDENTIALS).toString();

feAdmin.initializeApp({
    credential: feAdmin.credential.cert(JSON.parse(serviceAccount)),
});

export default feAdmin;
