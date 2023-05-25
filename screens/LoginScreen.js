import React, { Component } from 'react';
import { View, Image, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
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
        this.onPressRegister = this.onPressRegister.bind(this);

        this.state = {
            loading: true,
            email: '',
            password: '',
        }

        this.passwordInput = React.createRef()
    }

    async handleLogin() {
        this.setState({ loading: true })

        const { email, password } = this.state   
        const allFieldsAreLoaded = this.allFieldsAreLoaded()
        const emailIsValid = this.emailIsValid()
        if (!allFieldsAreLoaded)
            return

        await logIn(email, password)
            
        if (this.alreadyLogged()) {
            this.props.navigation.replace('HomeScreen');
        }

        this.setState({ loading: false });
    }
 
    emailIsValid() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.state.email);
    }

    allFieldsAreLoaded() {
        return this.state.email.length > 0 && this.state.password.length > 0
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
        this.props.navigation.replace('EnrollmentScreen');
    }

    alreadyLogged() {
        return tokenManager.getAccessToken() != null
    }

    onPressRegister() {
        this.props.navigation.replace('ProfileSelectionScreen')
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
                <ScrollView 
                    automaticallyAdjustKeyboardInsets={true}
                    keyboardShouldPersistTaps='handled'
                    style={styles.scrollView}
                >
                    <View style={styles.container}>
                        <LoginImage
                            style={{
                                marginTop: 30,
                            }}
                        />

                        <TextHeader
                            body="Bienvenido"
                            style={styles.textHeader} 
                        />
                    
                    {/* google-icon.png */}
                        <ButtonStandard
                            onPress={() => this.handleGoogleLogIn()}
                            title="Inicia sesión con Google"
                            style={{
                                marginTop: 15,
                            }}
                            whiteMode
                            icon={({ color, size }) => (
                                <Image
                                    source={require('../assets/images/google-icon.png')}
                                    style={{ width: 30, height: 30 }}
                                />
                            )}
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

                        <InputData
                            placeholder='Correo electrónico'
                            maxLength={30}
                            onChangeText={(input) => {
                                this.setState({ email: input })
                            }}
                            onSubmitEditing={() => { this.passwordInput.current.focus() }}
                            style={{
                                marginTop: 15,
                            }}
                        />
                        <InputData
                            ref={this.passwordInput}
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
                            onPress={this.handleLogin}
                            title="Entrar"
                            disabled={!(this.allFieldsAreLoaded() && this.emailIsValid())}
                            style={{
                                marginTop: 15,
                            }}
                        />

                        <TextWithLink
                            text="¿No tienes cuenta?"
                            linkedText="Registrate"
                            onPress={this.onPressRegister}
                            style={{
                                marginTop: 30,
                            }}
                        />
                    </View>
                </ScrollView>
            );
        }
    }
}
