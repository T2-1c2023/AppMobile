import React, { Component } from 'react';
import { View, StyleSheet, Keyboard, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { TextHeader, TextDetails, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { tokenManager } from '../src/TokenManager';
import axios from 'axios';
import Constants from 'expo-constants'
import { titleManager } from '../src/TitleManager';
import jwt_decode from "jwt-decode";
import { UserContext } from '../src/contexts/UserContext';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class PinCodeScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.handleVerifyPin = this.handleVerifyPin.bind(this);
        this.state = {
            pin: '',
        }
    }

    async handleVerifyPin() {
        const url = API_GATEWAY_URL + "register/verify"
        const body = { mail: this.props.route.params.mail, code: this.state.pin }
        await axios.post(url, body)
            .then((response) => {
                tokenManager.updateTokens(response.data.token).then(() => {
                    const decodedToken = jwt_decode(response.data.token)
                    if (decodedToken.is_athlete)
                        this.props.navigation.replace('InterestsScreen', { userId: decodedToken.id });
                    else
                        this.updateContextAndRedirect();
                })
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    Alert.alert('', "El PIN ingresado no es correcto")
                } else {
                    console.log("handleVerifyPin " + error);
                }
            })
    }

    //TODO ver de no repetir código con LoginScreen
    // Funcion a llamar luego de verificar que el usuario ya tiene el token cargado
    // Guarda el id de usuario en el contexto y verifica si puede ingresar directamente o si se le debe preguntar
    // con que rol quiere ingresar (solo si es un usuario mixto)
    async updateContextAndRedirect() {
        console.log("[LoginScreen] Token: " + tokenManager.getAccessToken())
        console.log("[LoginScreen] Payload: " + JSON.stringify(tokenManager.getPayload()))
        await this.context.setUserId(tokenManager.getUserId())
        await this.context.setName(tokenManager.getName())

        console.log("[LoginScreen] isMixedUser: " + tokenManager.isMixedUser())
        if (tokenManager.isMixedUser())
            this.props.navigation.replace('RoleSelectionScreen')
        else {
            tokenManager.isAthlete() ? await this.context.setAsAthlete()
                :
                tokenManager.isTrainer() ? await this.context.setAsTrainer()
                    :
                    alert('El usuario no cuenta con un rol asignado')

            this.props.navigation.replace('HomeScreen')

        }
    }

    componentDidMount() {
        titleManager.setTitle(this.props.navigation, "Validar PIN", 22)
    }

    render() {
        return (
            <View style={styles.container}>

                <LoginImage />

                <TextHeader
                    body="Código de verificación"
                    style={{
                        marginTop: 20,
                    }}
                />

                <TextDetails
                    numberOfLines={2}
                    body="Por favor ingresa el código que enviamos a tu cuenta de Whatsapp"
                    style={{
                        marginTop: 20,
                    }}
                />

                <PinInput
                    onChange={(input) => this.setState({ pin: input })}
                    style={{
                        marginTop: 30,
                    }}
                />

                <ButtonStandard
                    onPress={() => {
                        this.handleVerifyPin();
                    }}
                    title="Verificar"
                    style={{
                        marginTop: 100,
                    }}
                />

            </View>
        );
    }
}
