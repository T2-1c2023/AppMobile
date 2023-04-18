import React, { Component, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager, constante } from '../src/TokenManager';

import { ActivityIndicator, MD2Colors, Text, Divider, Button, TextInput } from 'react-native-paper';

import { useTheme } from 'react-native-paper';
import styles from '../src/styles/styles';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';

import { FingerprintInput } from '../src/components/FingerprintInput';

// import GoogleSingInButton from '../src/components/GoogleSignInButton';

import axios from 'axios';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            loading: true,
            email: '',
            password: ''
        }
    }

    async handleLogin() {
        try {
            this.setState({ loading: true })

            const data = {
                username: this.state.username,
                password: this.state.password
            }

            const credentials = await this.getCredentials(data)
            await tokenManager.updateTokens(credentials.accessToken)

            this.props.navigation.replace('HomeScreen')

            this.setState({ loading: false })
        } catch (e) {
            console.log(e);
        }
    }

    async getCredentials(data) {
        const domain = "test";

        try {
            const response = await axios.post(domain + '/login', data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }

        return response.data;
    }

    componentDidMount() {
        tokenManager._loadTokens().then(() => {
            if (this.alreadyLogged()) {
                this.props.navigation.replace('HomeScreen')
            } else {
                this.setState({ loading: false })
            }
        })
    }

    alreadyLogged() {
        return tokenManager.getAccessToken() != null
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <LoginImage />

                    <TextHeader
                        body="Bienvenido"
                        style={styles.textHeader} 
                    />

                    {/* <GoogleSingInButton /> */}

                    <DividerWithMiddleText 
                        text="o"
                        style={{
                            marginTop: 5,
                        }} 
                    />

                    <FingerprintInput 
                        onValidFingerprint={() => {
                            console.log("Action on valid fingerprint - to be implemented")
                        }}
                        style={{ 
                            marginTop: 10
                        }}
                    />

                    <DividerWithMiddleText 
                        text="o"
                        style={{
                            marginTop: 5,
                        }} 
                    />

                    <InputData
                        placeholder='Correo electrónico'
                        onChangeText={(input) => {
                            this.setState({ email: input })
                        }}
                        style={{
                            marginTop: 25,
                        }}
                    />
                    <InputData
                        placeholder='Contraseña'
                        secureTextEntry={true}
                        onChangeText={(input) => {
                            this.setState({ password: input })
                        }}
                        style={{
                            marginTop: 5,
                        }}
                    />

                    <TextWithLink
                        text="¿Olvidaste tu contraseña?"
                        linkedText="Restaurala"
                        onPress={() => console.log("to be implemented")}
                        style={{
                            marginTop: 10,
                        }}
                    />

                    <ButtonStandard
                        onPress={() => { this.handleLogin() }}
                        title="Entrar"
                        style={{
                            marginTop: 50,
                        }}
                    />

                    <TextWithLink
                        text="¿No tienes cuenta?"
                        linkedText="Registrate"
                        onPress={() => this.props.navigation.replace('RegisterScreen1')}
                        style={{
                            marginTop: 10,
                        }}
                    />
                </View>
            );
        }
    }
}
