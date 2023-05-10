import React, { Component, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager, constante } from '../src/TokenManager';
import { logIn } from '../src/User';

import { ActivityIndicator, MD2Colors, Text, Divider, Button, TextInput } from 'react-native-paper';

import { useTheme } from 'react-native-paper';
import styles from '../src/styles/styles';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';

import { FingerprintInput } from '../src/components/FingerprintInput';

// import { googleLogIn } from '../src/GoogleAccount';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            loading: true,
            email: '',
            password: '',
        }
    }

    async handleLogin() {
        const { email, password } = this.state;
        
        if (!email || !password ) {
            alert("Complete todos los campos para continuar");
        } else {
            await logIn(this.state.email, this.state.password);
            
            if (this.alreadyLogged()) {
                this.props.navigation.replace('HomeScreen');
            }
        }
    }

    /* 
    async handleGoogleLogIn () {
        this.setState({ loading: true })
        await googleLogIn();
        if (this.alreadyLogged()) {
            this.props.navigation.replace('HomeScreen');
        } else {
            this.setState({ loading: false })
        }
    }
    */

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

                    {/*                     
                    <ButtonStandard
                        onPress={() => this.handleGoogleLogIn()}
                        title="Log In con Google"
                        marginTop={30}
                        marginBottom={10}
                    />
                    */}

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
                        maxLength={30}
                        onChangeText={(input) => {
                            this.setState({ email: input })
                        }}
                        style={{
                            marginTop: 15,
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
                            marginTop: 15,
                        }}
                    />

                    <TextWithLink
                        text="¿No tienes cuenta?"
                        linkedText="Registrate"
                        onPress={() => this.props.navigation.replace('ProfileSelectionScreen')}
                        style={{
                            marginTop: 10,
                        }}
                    />
                </View>
            );
        }
    }
}
