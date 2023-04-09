import React, { Component, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager, constante } from '../src/TokenManager';

import { ActivityIndicator, MD2Colors, Text, Divider, Button, TextInput } from 'react-native-paper';

import { useTheme } from 'react-native-paper';
import styles from '../src/styles/styles';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


class LoginScreen extends Component {
    constructor(props) {
        super(props)
        //this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            loading: true,
            email: '',
            password: ''
        }
    }

    handleLogin = () => {
        console.log('email:', this.state.email, 'password:', this.state.password)
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
            console.log('Sign In Succesful!')
            const user = userCredential.user;
            updateToken
            console.log(user)
        })
        .catch(error => {
            console.log(error)
            Alert.alert(error.message)
        })
        /*try {
            this.setState({ loading: true })

            const credentials = await this.getCredentials(this.state.username, this.state.password)
            await tokenManager.updateTokens(credentials.accessToken)

            this.props.navigation.replace('HomeScreen')

            this.setState({ loading: false })
        } catch (e) {
            console.log(e);
        }*/
    }

    async getCredentials(username, password) {

        //simulacion de demora en la respuesta
        // -------------------------------------
        console.log('username:', username, 'password', password)
        await new Promise(resolve => setTimeout(resolve, 1000));
        // -------------------------------------


        return { accessToken: '12345' }
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
                // <Image 
                //     source={require('../assets/images/logo.png')} 
                //     style={{ width: 400, resizeMode: 'center' }}
                // />
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
                        style={styles.textHeader} />

                    <DividerWithMiddleText text="o" />

                    <FingerPrintoOption />

                    <DividerWithMiddleText text="o" />

                    <InputData
                        placeholder='Correo electrónico'
                        onChangeText={(input) => {
                            this.setState({ email: input })
                        }}
                        marginTop={25}
                        marginBottom={10}
                    />
                    <InputData
                        placeholder='Contraseña'
                        secureTextEntry={true}
                        onChangeText={(input) => {
                            this.setState({ password: input })
                        }}
                    />

                    <TextWithLink
                        text="¿Olvidaste tu contraseña?"
                        linkedText="Restaurala"
                        onPress={() => console.log("to be implemented")}
                        marginTop={10}
                        marginBottom={10}
                    />

                    <TextWithLink
                        text="¿No tienes cuenta?"
                        linkedText="Registrate"
                        onPress={() => this.props.navigation.replace('RegisterScreen1')}
                        
                        marginTop={5}
                    />

                    <ButtonStandard
                        onPress={this.handleLogin}
                        title="Entrar"
                        marginTop={20}
                        marginBottom={10}
                    />

                </View>
            );
        }
    }
}

export default LoginScreen;

const FingerPrintoOption = () => {
    return (
        <View style={{ flexDirection: 'row', width: 250, height: 60 }}>
            <View style={{ flex: .8, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Image
                    style={{
                        height: 50,
                        width: 50,
                        alignSelf: 'center',
                        marginRight: 10,
                    }}
                    source={require('../assets/images/fingerprint.png')}
                />

            </View>
            <View style={{ flexDirection: 'row', flex: 1.1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <ButtonStandard
                    onPress={() => { console.log("To be implemented") }}
                    title="Usar Huella"
                    style={{ margin: 20 }}
                />
            </View>
            <View style={{ flex: 0.1 }}></View>
        </View>
    )
}