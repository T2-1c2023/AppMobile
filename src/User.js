import { Alert } from 'react-native';
import axios from 'axios'
import { tokenManager } from './TokenManager'
import Constants from 'expo-constants'
import { showMessage } from 'react-native-flash-message';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

// TODO: usar constantes para los errores

// Register/Login handling ----------------------------------------------------------------------------------------

export async function register(data) {

	try {
		const response = await axios.post(API_GATEWAY_URL + 'register', data)

		// TODO: en google docs aparece como 201 pero funciona con 200
		if (response.status === 200) {
			return true
		}
	} catch (error) {
		handleRegisterError(error);
		return false
	}
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

// On success returns true, on failure returns undefined.
export async function registerGoogleAcc(data) {
	console.log('Enviando:', data);

	try {
		const response = await axios.post(API_GATEWAY_URL + 'register/oauth', data);
		if (response.status === 200) {
		console.log('Users retorna true');
		return true;
		}
	} catch (error) {
		handleRegisterGoogleError(error);
		throw error; // Re-throw the error to propagate it
	}
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
		Alert.alert('Email ya registrado', 'Intente ingresar o regístrese con otro email.');
	} else if (error.response && error.response.status === 400) {
		Alert.alert('Bad Request');
	}
	else {
		Alert.alert('Falló al crear cuenta', 'Error desconocido. Verifique su conexión o intente más tarde\n\
                Código:', error.response.status);
	}
}

// Errors when user logs in with mail/password
function handleLogInError(error) {
	if (error.response && error.response.status === 401) {
		Alert.alert('Contraseña incorrecta', 'Intente nuevamente');
	} else if (error.response && error.response.status === 404) {
		Alert.alert("Email no encontrado", 'Verifique su dirección de email e intente nuevamente ' +
			"o cree una nueva, si no tiene");
	} else if (error.response && error.response.status === 400) {
		Alert.alert('Formato inválido de email', 'Su email debería ser así: ' +
			'\nexample@example.com');
	} else {
		Alert.alert('Falló el login', 'Error desconocido. Verifique su conexión o intente más tarde\n\
                Código:', error.response.status);
	}
}

function handleRegisterGoogleError(error) {
	if (error.response && error.response.status === 409) {
		Alert.alert('Email ya registrado', 'Intente ingresar o regístrese con otro email.');
	} else if (error.response && error.response.status === 400) {
		Alert.alert('Bad Request');
	} else if (error.response && error.response.status === 401) {
		Alert.alert('No autorizado');
	}
	else {
		Alert.alert('Falló al crear cuenta', 'Error desconocido. Verifique su conexión o intente más tarde\n\
                Status code:', error.response.status);
	}
}

function handleLogInGoogleError(error) {
	if (error.response && error.response.status === 404) {
		Alert.alert("La cuenta de google no está registrada", "Cree una nueva cuenta si no tiene una");
	} else if (error.response && error.response.status === 400) {
		Alert.alert("Bad Request");
	} else if (error.response && error.response.status === 401) {
		Alert.alert("No autorizado");
	}
	else {
		Alert.alert('Falló el login', 'Error desconocido. Verifique su conexión o intente más tarde\n\
			Código:', error.response.status);
	}
}

// Profile Edition ----------------------------------------------------------------------------------------
// TODO: mover todo el código con requests relacionadas a usuario acá
export async function updateUserData(newData, userId) {
	const url = API_GATEWAY_URL + 'users/' + userId;
    const body = newData;
    await axios.patch(url, body, {
        headers: {
            Authorization: tokenManager.getAccessToken()
        }
    })
        .then((response) => {
            console.log(response.data);
            showMessage({
                message: 'Datos de usuario cambiados con éxito',
                type: 'success',
                duration: 3000,
                backgroundColor: '#00B386',
                color: '#FFFFFF'
            });
        })
        .catch((error) => {
            console.log(error)
            Alert.alert('Error al actualizar datos de usuario', error.message);
			throw new Error('Failed to update user data');
        });
}