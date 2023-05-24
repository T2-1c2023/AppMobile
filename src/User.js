import { Alert } from 'react-native';
import axios from 'axios'
import { tokenManager } from './TokenManager'
import Constants from 'expo-constants'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

// TODO: usar constantes para los errores

export async function register(data) {
    await axios.post(API_GATEWAY_URL + 'register', data)
      .then(async (response) => {
        // TODO: en google docs aparece como 201 pero funciona con 200
        if (response.status === 200) {
            const token = response.data.token;
            await tokenManager.updateTokens(token);
        }
      })
      .catch((error) => {
        handleRegisterError(error);
      });
}

export async function logIn(mail, password) {
    const data = {
        mail: mail,
        password: password
    }
    await axios.post(API_GATEWAY_URL + 'login', data)
      .then(async (response) => {
        if (response.status === 200) {
            const token = response.data.token;
            await tokenManager.updateTokens(token);
        }
      })
      .catch((error) => {
        handleLogInError(error);
      });
}

// TODO: ver manejo de nº de teléfono
export async function registerGoogleAcc(firebaseToken, phone_number, is_athlete, is_trainer) {
  const data = {
    token: firebaseToken,
    phone_number: phone_number,
    is_athlete: is_athlete,
    is_trainer: is_trainer
  }

  await axios.post(API_GATEWAY_URL + 'register/oauth', data)
    .then(async (response) => {
      if (response.status === 200) {
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
  await axios.post(API_GATEWAY_URL + 'login/oauth', data)
    .then(async (response) => {
      if (response.status === 200) {
        const token = response.data.token;
        await tokenManager.updateTokens(token);
      }
    })
    .catch((error) => {
      handleLogInGoogleError(error);
    });
}

// Error handling --------------------------------------------------------------------------------------------------

// Errors when user tries to register with mail/password
function handleRegisterError(error) {
  if (error.response && error.response.status === 409) {
    Alert.alert('Email already registered', 'Please try signing in or use a different email address.');
  } else if (error.response && error.response.status === 400) {
    Alert.alert('Bad Request');
  }
  else {
    Alert.alert('Failed to create account', 'Unkown error. Please check your connection or try again later\n\
                Status code:', error.response.status);
  }
}

// Errors when user logs in with mail/password
function handleLogInError(error) {
  if (error.response && error.response.status === 401) {
    Alert.alert('Incorrect Password', 'Please try again');
  } else if (error.response && error.response.status === 404) {
    Alert.alert("Email not found", 'Verify the email address and try again ' + 
                "or create a new account if you don't have one");
  } else if (error.response && error.response.status === 400) {
    Alert.alert('Invalid email format', 'Your email should look something ' +
                'like this:\nexample@example.com');
  } else {
    Alert.alert('Failed to login', 'Unkown error. Please check your connection or try again later\n\
                Status code:', error.response.status);
  }
}

function handleRegisterGoogleError(error) {
  if (error.response && error.response.status === 409) {
    Alert.alert('Email already registered', 'Please try signing in or use a different email address.');
  } else if (error.response && error.response.status === 400) {
    Alert.alert('Bad Request');
  } else if (error.response && error.response.status === 401) {
    Alert.alert('Unauthorized Request');
  }
  else {
    Alert.alert('Failed to create account', 'Unkown error. Please check your connection or try again later\n\
                Status code:', error.response.status);
  }
}

function handleLogInGoogleError(error) {
  if (error.response && error.response.status === 404) {
    Alert.alert("Google Account isn't registered", "Create a new account if you don't have one");
  } else if (error.response && error.response.status === 400) {
    Alert.alert("Bad Request");
  } else if (error.response && error.response.status === 401) {
    Alert.alert("Unauthorized request");
  }
  else {
    Alert.alert('Failed to login', 'Unkown error. Please check your connection or try again later\n\
                Status code:', error.response.status);
  }
}