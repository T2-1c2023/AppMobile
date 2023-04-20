import axios from 'axios'
import { tokenManager } from './TokenManager'
import Constants from 'expo-constants'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export async function register(data) {
    console.log('Enviando request para registrar usuario')
    await axios.post(API_GATEWAY_URL + '/register', data)
      .then(async (response) => {
        if (response.status === 201) {
            const token = response.headers.authorization;
            await tokenManager.updateTokens(token);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
            console.error('Correo electrónico ya registrado');
          } else {
            console.error('Error al crear el usuario');
            console.error('Código de estado:', error.response ? error.response.status : 'desconocido');
        }
      });
}

export async function logIn(mail, password) {
    console.log('Enviando request para conectar usuario')
    const data = {
        mail: mail,
        password: password
    }
    await axios.post(API_GATEWAY_URL + '/login', data)
      .then(async (response) => {
        if (response.status === 200) {
            const token = response.headers.authorization;
            await tokenManager.updateTokens(token);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
            console.error('Password is incorrect')
        } else if (error.respose && error.response.status === 404) {
            console.error("Mail isn't registered")
        } else {
            console.error('Error al iniciar sesión');
            console.error('Código de estado:', error.response ? error.response.status : 'desconocido');
        }
      })
}