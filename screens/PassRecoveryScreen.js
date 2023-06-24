import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, InputData, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import axios from 'axios';
import Constants from 'expo-constants'
import { titleManager } from '../src/TitleManager';

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

    componentDidMount() {
        titleManager.setTitle(this.props.navigation, "Recuperar contraseña", 22)
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    emailWarningMode() {
        return !this.state.email.length == 0 && !this.validateEmail(this.state.email)
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
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                keyboardShouldPersistTaps='handled'
                style={styles.scrollView}
            >
                <View style={styles.container}>

                    <LoginImage style={{marginTop:30}}/>

                    <TextHeader
                        body="Restaura tu contraseña"
                        style={{
                            marginTop: 20,
                        }}
                    />

                    <TextDetails
                        numberOfLines={3}
                        body="Por favor ingresa tu correo electrónico. Te enviaremos las instrucciones para restaurar tu contraseña."
                        style={{
                            marginTop: 20,
                        }}
                    />

                    <InputData
                        placeholder="Correo electrónico"
                        onChangeText={(email) => {
                            this.setState({ email })
                        }}
                        warningMode = {this.emailWarningMode()}
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
            </ScrollView>
        );
    }
}
