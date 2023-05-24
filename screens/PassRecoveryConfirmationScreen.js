import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, LoginImage, InputData } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { HelperText } from 'react-native-paper';
import axios from 'axios';
import Constants from 'expo-constants'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class PassRecoveryConfirmationScreen extends Component {
    constructor(props) {
        super(props)
        this.validateToken = this.validateToken.bind(this);
        this.confirmPassIsValid = this.confirmPassIsValid.bind(this)
        this.state = {
            token: '',
            newPass: '',
            confirmPass: '',
        }

        this.token = React.createRef()
        this.passwordInput = React.createRef()
        this.confirmPasswordInput = React.createRef()
    }

    validateToken() {
        const body = {token: this.state.token, password: this.state.newPass}
        axios.patch(API_GATEWAY_URL + 'login/recovery', body)
        .then((response) => {
            alert("Contraseña modificada exitosamente");
            this.props.navigation.replace('LoginScreen');
        }) 
        .catch(function (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
               alert("El token ingresado es inválido");
            }
        });
    }

    confirmPassIsValid() {
        return this.state.newPass === this.state.confirmPass
    }

    passwordWarningMode() {
        return this.state.newPass.length > 0 && this.state.newPass.length < 8
    }

    incorrectConfirmPassword() {
        return this.state.newPass != this.state.confirmPass && this.state.confirmPass.length > 0
    }

    allFieldsAreValid() {
        const { token, newPass, confirmPass } = this.state;
        const tokenIsValid = token.length > 0   //sólo para ver que haya algo, su validez va a ser chequeada por el back
        const passwordIsValid = newPass.length >= 8
        const confirmPasswordIsValid = newPass == confirmPass

        return tokenIsValid && passwordIsValid && confirmPasswordIsValid;
    }

    render() {
        return (
            <ScrollView 
                    automaticallyAdjustKeyboardInsets={true}
                    keyboardShouldPersistTaps='handled'
                    style={styles.scrollView}
            >
                <View style={styles.container}>

                    <LoginImage />

                    <TextHeader
                        body="¡Buenas noticias!"
                        style={{
                            marginTop: 10,
                        }}
                    />

                    <TextDetails
                        numberOfLines={3}
                        body="Hemos enviado las instrucciones para restaurar tu contraseña a tu dirección de correo electrónico registrada."
                        style={{
                            marginTop: 10,
                        }}
                    />

                    <TextDetails
                        numberOfLines={3}
                        body="Si no encuentras el mensaje en tu bandeja de entrada, por favor revisa tu carpeta de spam o correo no deseado."
                        style={{
                            marginTop: 10,
                        }}
                    />

                    <InputData
                        placeholder="Token"
                        onChangeText={(token) => {
                            this.setState({ token })
                        }}
                        ref={this.token}
                        onSubmitEditing={() => this.passwordInput.current.focus()}
                        style={{
                            marginTop: 10,
                        }}
                    />

                    <InputData
                        placeholder="Nueva contraseña"
                        onChangeText={(newPass) => {
                            this.setState({ newPass })
                        }}
                        ref={this.passwordInput}
                        onSubmitEditing={() => this.confirmPasswordInput.current.focus()}
                        warningMode = {this.passwordWarningMode()}
                        style={{
                            marginTop: 10,
                        }}
                    />

                    { this.passwordWarningMode() &&

                    <HelperText 
                        type="error" 
                        style={{
                            color: 'red',
                            width: 250,
                        }}
                    >
                        La contraseña debe ser más larga
                    </HelperText>
                    }

                    <InputData
                        placeholder="Confirmar contraseña"
                        ref={this.confirmPasswordInput}
                        onChangeText={(confirmPass) => {
                            this.setState({ confirmPass })
                        }}
                        warningMode = {this.incorrectConfirmPassword()}
                        style={{
                            marginTop: 10,
                        }}
                    />

                    { this.incorrectConfirmPassword() &&

                    <HelperText 
                        type="error" 
                        style={{
                            color: 'red',
                            width: 250,
                        }}
                    >
                        Las contraseñas no coinciden
                    </HelperText>
                    }

                    <ButtonStandard
                        title="Continuar"
                        style={{
                            marginTop: 30,
                        }}
                        onPress={() => {
                            this.validateToken();
                        }}
                        disabled={!this.allFieldsAreValid()}
                    />

                    <ButtonStandard
                        title="Volver"
                        style={{
                            marginTop: 10,
                        }}
                        onPress={() => {
                            this.props.navigation.replace('LoginScreen')
                        }}
                    />

                </View>
            </ScrollView>
        );
    }
}