import React, { Component, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager, constante } from '../src/TokenManager';

import { ActivityIndicator, MD2Colors, Text, Divider, Button, TextInput } from 'react-native-paper';

import { useTheme } from 'react-native-paper';
import styles from '../src/styles/styles';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink} from '../src/styles/BaseComponents';

class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            loading: true,
            username: '',
            password: ''
        }
    }

    async handleLogin() {
        try {
            this.setState({ loading: true })

            const credentials = await this.getCredentials(this.state.username, this.state.password)
            await tokenManager.updateTokens(credentials.accessToken)
    
            this.props.navigation.replace('HomeScreen')

            this.setState({ loading: false })
        } catch (e) {
            console.log(e);
        }
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
                <View>
                    <Image 
                        style={styles.loginImage}
                        source={require('../assets/images/login-header.png')}
                    />
                    
                    <TextHeader body="Bienvenido"/>

                    <DividerWithMiddleText text="o"/>

                    <Image 
                        style={styles.LoginFingerPrintImage}
                        source={require('../assets/images/login-header.png')}
                    />

                    <ButtonStandard
                        onPress={() => { console.log("To be implemented") }}
                        title="Usar Huella"
                    />

                    <DividerWithMiddleText text="o"/>

                    <InputData
                        placeholder='Correo electrónico'
                        onChangeText={(input) => {
                            this.setState({ username: input })
                        }}
                    />
                    <InputData
                        placeholder='Contraseña'
                        secureTextEntry={true}
                        onChangeText={(input) => {
                            this.setState({ password: input })
                        }}
                    />

                    <ButtonStandard
                        onPress={() => { console.log("user: ", this.state.username, "contraseña: ", this.state.password) }}
                        title="Entrar"
                    />

                    <TextWithLink 
                        text="¿Olvidate tu contraseña?" 
                        linkedText="Registrate" 
                        onPress={() => console.log("to be implemented")}  />
                </View>
            );
        }
    }
}

export default LoginScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingTop: 22,
//     },
    
//     sectionHeader: {
//         paddingTop: 2,
//         paddingLeft: 10,
//         paddingRight: 10,
//         paddingBottom: 2,
//         fontSize: 14,
//         fontWeight: 'bold',
//         backgroundColor: 'rgba(247,247,247,1.0)',
//     },
//     item: {
//         padding: 10,
//         fontSize: 18,
//         height: 44,
//     },
// });