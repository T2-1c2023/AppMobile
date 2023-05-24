import React, { Component } from 'react';
import { View } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, InputData, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import axios from 'axios';
import Constants from 'expo-constants'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class PassRecoveryScreen extends Component {
    constructor(props) {
        super(props)
        this.validateEmail = this.validateEmail.bind(this);
        this.handleSendToken = this.handleSendToken.bind(this);
        this.state = {
            email: '',
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleSendToken() {
        const body = {mail: this.state.email}
        axios.post(API_GATEWAY_URL + 'login/recovery', body)
        .then((response) => {
            this.props.navigation.replace('PassRecoveryConfirmationScreen');
        }) 
        .catch(function (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
               alert("El mail ingresado no se corresponde con ninguna cuenta de FiuFit");//TO_DO ver helper text
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>

                <LoginImage />

                <TextHeader
                    body="Restaura tu contraseña"
                    style={{
                        marginTop: 20,
                    }}
                />

                <TextDetails
                    numberOfLines={3}
                    body="Por favor ingresa tu correo electronico. Te enviaremos las instrucciones para restaurar tu contraseña."
                    style={{
                        marginTop: 20,
                    }}
                />

                <InputData
                    placeholder="Correo electrónico"
                    onChangeText={(email) => {
                        this.setState({ email })
                    }}
                />

                <ButtonStandard
                    title="Enviar"
                    style={{
                        marginTop: 70,
                    }}
                    disabled={(this.state.email === '' || !this.validateEmail(this.state.email))}
                    onPress={this.handleSendToken}
                />

            </View>
        );
    }
}
