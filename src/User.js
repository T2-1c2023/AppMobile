import axios from 'axios'
import { tokenManager } from './TokenManager'
import Constants from 'expo-constants'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export async function register(data) {
    // TODO: usar token manager
    axios.post(API_GATEWAY_URL + '/register', data)
      .then((response) => {
        if (response.status === 201) {
            console.log('Usuario creado con éxito');
            console.log('ID del usuario:', response.data.id);
            console.log('Nombre completo:', response.data.fullname);
            console.log('Correo electrónico:', response.data.mail);
            console.log('Número de teléfono:', response.data.phone_number);
            console.log('Bloqueado:', response.data.blocked);
            console.log('Es entrenador:', response.data.is_trainer);
            console.log('Es atleta:', response.data.is_athlete);
            console.log('Es administrador:', response.data.is_admin);
            console.log('Token de autorización:', response.headers.authorization);
          } else {
            console.error('Error al crear el usuario');
            console.error('Código de estado:', response.status);
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