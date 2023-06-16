import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, FingerprintImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import * as LocalAuthentication from 'expo-local-authentication';
import ReactNativeBiometrics from 'react-native-biometrics';
import { titleManager } from '../src/TitleManager';
import { Alert } from 'react-native';
import { tokenManager } from '../src/TokenManager';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import Constants from 'expo-constants'
const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;
import { UserContext } from '../src/contexts/UserContext';
import { InputData } from '../src/styles/BaseComponents';

export default class EnrollmentScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.handleEnrollment = this.handleEnrollment.bind(this)
        this.handleSignIn = this.handleSignIn.bind(this)
        this.deleteKeys = this.deleteKeys.bind(this)
        this.rnBiometrics = new ReactNativeBiometrics()
        this.state = {
            fingerprint: '',
            props: props,
            mail: '',
        }
        this.emptyBodyWithToken = {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        }
    }

    deleteKeys() {
        this.rnBiometrics.deleteKeys()
            .then((resultObject) => {
                const { keysDeleted } = resultObject

                if (keysDeleted) {
                    console.log('Successful deletion')
                } else {
                    console.log('Unsuccessful deletion because there were no keys to delete')
                }
            })
    }

    async handleSignIn() {
        let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
        let payload = epochTimeSeconds
        let result
        try {
            result = await this.rnBiometrics.createSignature({
                promptMessage: 'Sign in',
                payload: payload
            })
        } catch (error) {
            console.log(error)
            return
        }
        const { success, signature } = result
        if (success) {
            const url = API_GATEWAY_URL + 'login/biometric'
            const body = { mail: this.state.mail, payload: payload, signature: signature }
            console.log('body: ' + JSON.stringify(body))
            await axios.post(url, body)
                .then((response) => {
                    this.updateContextAndRedirect(response)
                })
                .catch((error) => {
                    if (error.response) {
                        switch (error.response.status) {
                            case 401:
                                Alert.alert('', "No se pudo verificar la huella")
                                break;
                            case 403:
                                Alert.alert('Usuario bloquado');
                                break;
                            case 404:
                                Alert.alert('El mail ingresado no se encuentra registrado');
                                break;
                            case 423:
                                Alert.alert('Primero tenés que verificar tu cuenta');
                                break;
                            default:
                                Alert.alert('Error desconocido');
                        }
                    }

                })
        }

    }

    async updateContextAndRedirect(response) {
        const token = response.data.token;
        await tokenManager.updateTokens(token);

        console.log("[EnrollmentScreen] Token: " + tokenManager.getAccessToken())
        console.log("[EnrollmentScreen] Payload: " + JSON.stringify(tokenManager.getPayload()))
        await this.context.setUserId(tokenManager.getUserId())

        if (tokenManager.isMixedUser())
            // TODO: handle mixed user
            alert('Usuario mixto en desarrollo')
        else
            tokenManager.isAthlete() ? await this.context.setAsAthlete()
                :
                tokenManager.isTrainer() ? await this.context.setAsTrainer()
                    :
                    alert('No se encontró un rol asignado. Usuario invalido')

        this.props.navigation.replace('HomeScreen')
    }

    componentDidMount() {
        //titleManager.setTitle(this.props.mavigation, "Agregar huella", 22)
        LocalAuthentication.hasHardwareAsync().then((hasHardware) => {
            if (!hasHardware) Alert.alert('', 'Tu celular no permite almacenar la huella');
        })
    }

    async handleEnrollment() {
        // Prompt user to scan biometrics
        const { success } = await this.rnBiometrics.simplePrompt({ promptMessage: 'Escanee su huella digital' });

        if (success) {

            // If scan is successful, generate a keypair, then save the public key to the server
            const { publicKey } = await this.rnBiometrics.createKeys();
            console.log('publicKey ' + publicKey)

            const token = tokenManager.getAccessToken()
            const decodedToken = jwt_decode(token)
            console.log('token ' + token)
            console.log('decodedToken ' + JSON.stringify(decodedToken))


            const url = API_GATEWAY_URL + 'users/' + decodedToken.id + '/biometric'
            const body = { public_key: publicKey }
            console.log(body)
            await axios.post(url, body, this.emptyBodyWithToken)
                .then((response) => {
                    Alert.alert('', 'Huella registrada exitosamente')
                    this.props.navigation.replace('ProfileScreen', { data: decodedToken, owner: true })
                })
                .catch((error) => {
                    if (error.response && error.response.status === 409) {
                        Alert.alert('', "Ya existe una huella registrada para este usuario")
                    } else {
                        console.log("handleEnrollment " + error);
                    }
                })


        }
    }

    render() {
        return (
            <ScrollView
                automaticallyAdjustKeyboardInsets={true}
                keyboardShouldPersistTaps='handled'
                style={styles.scrollView}
            >
                <View style={styles.container}>

                    <FingerprintImage
                        style={{ marginTop: 20 }}
                    />

                    <TextHeader
                        body="Deberás utilizar el sensor de tu dispositivo"
                        style={{
                            marginTop: 20,
                        }}
                    />


                    {false && //TODO ver de dar esta advertencia
                        <View>

                            <TextDetails
                                numberOfLines={2}
                                body="¡Atención!"
                                style={{
                                    marginTop: 20,
                                }}
                                warning
                            />

                            <TextDetails
                                numberOfLines={3}
                                body="Ya cuentas con una huella registrada. Si continuas, se reemplazará la huella anterior por la nueva."
                                style={{
                                    marginTop: 20,
                                }}
                                warning
                            />

                        </View>}


                    {this.props.route.params.from === 'ValidatePasswordScreen' &&
                        <ButtonStandard
                            onPress={this.handleEnrollment}
                            title="Registrar huella"
                            style={{
                                marginTop: 50,
                            }}
                        />
                    }

                    {this.props.route.params.from === 'LoginScreen' &&
                        <InputData
                            placeholder='Correo electrónico'
                            maxLength={30}
                            onChangeText={(input) => {
                                this.setState({ mail: input })
                            }}
                            style={{
                                marginTop: 15,
                            }}
                        />}

                    {this.props.route.params.from === 'LoginScreen' &&
                        <ButtonStandard
                            onPress={this.handleSignIn}
                            title="Ingresar con huella"
                            style={{
                                marginTop: 50,
                            }}
                        />
                    }

                    {false && <ButtonStandard
                        onPress={this.deleteKeys}
                        title="Debug, borrar keys"
                        style={{
                            marginTop: 50,
                        }}
                    /> }

                </View>
            </ScrollView>
        );
    }
}