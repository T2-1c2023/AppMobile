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

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class PinCodeScreen extends Component {
    constructor(props) {
        super(props)
        this.handleVerifyPin = this.handleVerifyPin.bind(this);
        this.state = {
            pin: '',
        }
    }

    async handleVerifyPin() {
        const url = API_GATEWAY_URL + "register/verify"
        const body = { mail: this.props.route.params.decodedToken.mail, code: this.state.pin }
        await axios.post(url, body)
            .then((response) => {
                tokenManager.updateTokens(response.data.token)
                if (jwt_decode(response.data.token).is_athlete)
                    this.props.navigation.replace('InterestsScreen', { userId: this.props.route.params.decodedToken.id });
                else
                    this.props.navigation.replace('HomeScreen');
            })
            .catch((error) => {              
                if (error.response && error.response.status === 401) {
                    Alert.alert('', "El PIN ingresado no es correcto")
                } else {
                    console.log("handleVerifyPin " + error);
                }
            })
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
