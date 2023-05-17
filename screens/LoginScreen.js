import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import styles from '../src/styles/styles';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import { FingerprintInput } from '../src/components/FingerprintInput';
// Login logic
import { tokenManager } from '../src/TokenManager';
import { logIn } from '../src/User';
import { googleLogIn } from '../src/GoogleAccount';

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
        this.setState({ loading: true });

        const { email, password } = this.state;
        
        if (!email || !password ) {
            alert("Complete todos los campos para continuar");
        } else {
            await logIn(this.state.email, this.state.password);
            
            if (this.alreadyLogged()) {
                this.props.navigation.replace('HomeScreen');
            }
        }

        this.setState({ loading: false });
    }
 
    async handleGoogleLogIn () {
        this.setState({ loading: true })
        await googleLogIn();
        if (this.alreadyLogged()) {
            this.props.navigation.replace('HomeScreen');
        } else {
            this.setState({ loading: false })
        }
    }

    componentDidMount() {
        tokenManager._loadTokens().then(() => {
            if (this.alreadyLogged()) {
                this.props.navigation.replace('HomeScreen');
            } else {
                this.setState({ loading: false })
            }
        })
    }

    navigateToEnrollmentScreen = () => {
        this.props.navigation.navigate('EnrollmentScreen');
    }

    alreadyLogged() {
        return tokenManager.getAccessToken() != null
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#21005D" />
                    <Text style={{marginTop: 30}}>Login in please wait</Text>
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
                   
                    <ButtonStandard
                        onPress={() => this.handleGoogleLogIn()}
                        title="Log In con Google"
                        marginTop={30}
                        marginBottom={10}
                    />
                    
                    <DividerWithMiddleText 
                        text="o"
                        style={{
                            marginTop: 5,
                        }} 
                    />

                    <FingerprintInput 
                        onValidFingerprint={this.navigateToEnrollmentScreen}
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

                    {/* TODO: hacer que se vea donde escribís */}

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
                        onPress={() => this.props.navigation.navigate('PassRecoveryScreen')}
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
