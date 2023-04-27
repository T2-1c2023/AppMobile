// Ya no usamos firebase auth pero vamos a necesitar este archivo cuando usemos firebase storage,
// Real time database y Cloud Messaging
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants'

const firebaseConfig = {
    apiKey: Constants.manifest?.extra?.firebaseApiKey,
    authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
    projectId: Constants.manifest?.extra?.firebaseProjectId,
    storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
    appId: Constants.manifest?.extra?.firebaseAppId,
    measurementId: Constants.manifest?.extra?.firebaseMeasurementId
}

//const app = initializeApp(firebaseConfig);

// Acá se inicializan los != servicios (export const servicio = getServicio(app))
//export const auth = getAuth(app);
