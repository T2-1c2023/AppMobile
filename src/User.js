import axios from 'axios'
import { tokenManager } from './TokenManager'
import Constants from 'expo-constants'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

// TODO: usar constantes para los errores

export async function register(data) {
    console.log('Enviando request para registrar usuario')
    await axios.post(API_GATEWAY_URL + '/register', data)
      .then(async (response) => {
        // TODO: en google docs aparece como 201 pero funciona con 200
        if (response.status === 200) {
            console.log('Usuario registrado con éxito');
            const token = response.data.token;
            await tokenManager.updateTokens(token);
        }
      })
      .catch((error) => {
        handleRegisterError(error);
      });
}

// TODO: revisar que pasa cuando se ingresa con un mail/contraseña inválido. Revisar api en el doc
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
        handleLogInError(error);
      })
}

// TODO: ver manejo de nº de teléfono
export async function registerGoogleAcc(firebaseToken, phone_number, is_athlete, is_trainer) {
  const data = {
    token: firebaseToken,
    phone_number: phone_number,
    is_athlete: is_athlete,
    is_trainer: is_trainer
  }

  console.log('Enviando request de registro de usuario con google');

  await axios.post(API_GATEWAY_URL + '/register/oauth', data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log("Respuesta exitosa")
        const token = response.data.token;
        await tokenManager.updateTokens(token);
      }
    })
    .catch((error) => {
      handleRegisterGoogleError(error);
    });
}

export async function logInGoogleAcc(firebaseToken) {
  const data = {
    token: firebaseToken,
  }
  await axios.post(API_GATEWAY_URL + '/login/oauth', data)
    .then(async (response) => {
      if (response.status === 200) {
        const token = response.data.token;
        await tokenManager.updateTokens(token);
        console.log('Usuario logeado con éxito');
      }
    })
    .catch((error) => {
      handleLogInGoogleError(error);
    });
}

// Errors when user tries to register with mail/password
function handleRegisterError(error) {
  if (error.response && error.response.status === 409) {
    console.error('Correo electrónico ya registrado');
  } else if (error.response && error.response.status === 400) {
    console.error('Bad Request');
  }
  else {
    console.error('Error creating user');
    console.error('Status code:', error.response ? error.response.status : 'desconocido');
  }
}

// Errors when user logs in with mail/password
function handleLogInError(error) {
  if (error.response && error.response.status === 401) {
    console.error('Password is incorrect')
  } else if (error.respose && error.response.status === 404) {
    console.error("Mail isn't registered")
  } else if (error.response && error.response.status === 400) {
    console.error('Bad Request');
  } else {
    console.error('Failed to login');
    console.error('Status code:', error.response ? error.response.status : 'desconocido');
  }
}

function handleRegisterGoogleError(error) {
  if (error.response && error.response.status === 409) {
    console.error('Mail already registered');
  } else if (error.response && error.response.status === 400) {
    console.error('Bad Request');
  } else if (error.response && error.response.status === 401) {
    console.error('Unauthorized Request');
  }
  else {
    console.error('Error creating user');
    console.error('Status code:', error.response ? error.response.status : 'desconocido');
  }
}

function handleLogInGoogleError(error) {
  if (error.response && error.response.status === 404) {
    console.error("Mail isn't registered");
  } else if (error.response && error.response.status === 400) {
    console.error('Bad Request');
  } else if (error.response && error.response.status === 401) {
    console.error('Unauthorized Request');
  }
  else {
    console.error('Error creating user');
    console.error('Status code:', error.response ? error.response.status : 'desconocido');
  }
}