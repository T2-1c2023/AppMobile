import React, { Component } from 'react';
// Visuals
import { View, Text, ScrollView, Image } from 'react-native';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage, TextDetails } from '../src/styles/BaseComponents';
import { ActivityIndicator, HelperText } from 'react-native-paper';
import styles from '../src/styles/styles';
// Register logic
import { register } from '../src/User';
import { tokenManager } from '../src/TokenManager';
import { googleSignIn } from '../src/GoogleAccount';
import jwt_decode from 'jwt-decode';
// Navigation
import { CommonActions } from '@react-navigation/native';
// Notifications
import { registerForPushNotificationsAsync } from '../src/Notifications';

import { titleManager } from '../src/TitleManager';

export default class RegisterScreen1 extends Component {
    constructor(props) {
        super(props)
        this.handleProceed = this.handleProceed.bind(this)
        this.state = {
            loading: false,
            fullName: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: undefined,
        }

        this.phoneInput = React.createRef()
        this.emailInput = React.createRef()
        this.passwordInput = React.createRef()
        this.confirmPasswordInput = React.createRef()
    }

    componentDidMount() {
        titleManager.setTitle(this.props.navigation, "Registrarse", 22)
    }

    async handleProceed() {
        if (!this.allFieldsAreValid())
            return

        this.setState({ loading: true })
        // TODO: fix
        // let expo_push_token = await registerForPushNotificationsAsync();
        // let expo_push_token = undefined;

        
        /*let expo_push_token = await registerForPushNotificationsAsync();
        if (expo_push_token === undefined) {
            expo_push_token = '';
        }*/
        const expo_push_token = '4356' //sólo hasta que ande lo del token

        const data = {
            fullname: this.state.fullName,
            mail: this.state.email,
            phone_number: this.state.phone,
            blocked: false,
            is_trainer: this.props.route.params.trainer,
            is_athlete: this.props.route.params.athlete,
            password: this.state.password,
            expo_push_token: expo_push_token
        }
        await register(data);

        if (this.userIsLogged()) {
            const token = tokenManager.getAccessToken();
            this.props.navigation.replace('PinCodeScreen', {decodedToken: jwt_decode(token), token: token});
        }
        
        this.setState({ loading: false });
    }

    async handleGoogleSignIn() {
        this.setState({ loading: true });

        const phone_number = '0123456789';
        const is_athlete = this.props.route.params.athlete;
        const is_trainer = this.props.route.params.trainer;

        // TODO: fix
        // let expo_push_token = await registerForPushNotificationsAsync();
        let expo_push_token = undefined;
        if (expo_push_token === undefined) {
            expo_push_token = '';
        }
        await googleSignIn(phone_number, is_athlete, is_trainer, expo_push_token);

        if (this.userIsLogged()) {
            this.props.navigation.replace('HomeScreen');
        }

        this.setState({ loading: false });
    }

    userIsLogged() {
        return tokenManager.getAccessToken() != null
    }

    allFieldsAreValid() {
        const { fullName, email, password, confirmPassword } = this.state;
        
        const passwordIsValid = password.length >= 8
        const confirmPasswordIsValid = password == confirmPassword
        const emailIsValid = this.emailIsValid(email)
        const fullNameIsValid = fullName.length > 0

        return passwordIsValid && confirmPasswordIsValid && emailIsValid && fullNameIsValid
    }

    generateRoleText = () => {
        const { trainer, athlete } = this.props.route.params;
        if (trainer && athlete) {
            return 'Seleccionado: Entrenador y Atleta';
          } else if (trainer) {
            return 'Seleccionado: Entrenador';
          } else if (athlete) {
            return 'Seleccionado: Atleta';
          } else {
            return 'Error: No se ha seleccionado un rol';
          }
    };

    emailIsValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    emailWarningMode() {
        return !this.state.email.length == 0 && !this.emailIsValid(this.state.email)
    }

    passwordWarningMode() {
        return this.state.password.length > 0 && this.state.password.length < 8
    }

    incorrectConfirmPassword() {
        return this.state.password != this.state.confirmPassword && this.state.confirmPassword.length > 0
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#21005D" />
                    <Text style={{marginTop: 30}}>Creating account, please wait</Text>
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
                        body="Ingresa tus datos"
                    />
 
                    <ButtonStandard
                        onPress={() => this.handleGoogleSignIn()}
                        title="Registrate con Google"
                        style={{
                            marginTop: 30,
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
                            marginTop: 15,
                        }} 
                    />

                    <TextDetails
                        body={'Debes completar todos los campos para continuar'}
                        style={{
                            marginTop: 15,
                        }}
                    />

                    <InputData 
                        placeholder="Nombre y apellido"
                        maxLength={30} 
                        onChangeText={(input) => { 
                            this.setState({ fullName: input }) 
                        }}
                        onSubmitEditing={() => this.phoneInput.current.focus()}
                        style={{
                            marginTop: 20,
                        }} 
                    />

                    <InputData 
                        placeholder="Número de teléfono"
                        ref={this.phoneInput}
                        maxLength={30} 
                        onChangeText={(input) => { 
                            this.setState({ phone: input }) 
                        }}
                        onSubmitEditing={() => this.emailInput.current.focus()}
                        style={{
                            marginTop: 5,
                        }} 
                    />

                    <InputData 
                        placeholder="Correo electrónico"
                        ref={this.emailInput}
                        maxLength={30}
                        onChangeText={(input) => { 
                            this.setState({ email: input }) 
                        }}
                        onSubmitEditing={() => this.passwordInput.current.focus()}
                        warningMode = {this.emailWarningMode()}
                        style={{
                            marginTop: 5,
                        }} 
                    />

                    { this.emailWarningMode() &&

                        <HelperText 
                            type="error" 
                            style={{
                                color: 'red',
                                width: 250,
                            }}
                        >
                            El correo es incorrecto
                        </HelperText>
                    }

                    <InputData 
                        placeholder="Establecer contraseña"
                        ref={this.passwordInput}
                        secureTextEntry={true}
                        onChangeText={(input) => { 
                            this.setState({ password: input }) 
                        }}
                        onSubmitEditing={() => this.confirmPasswordInput.current.focus()}
                        warningMode = {this.passwordWarningMode()}
                        style={{
                            marginTop: 5,
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
                        secureTextEntry={true} 
                        onChangeText={(input) => { 
                            this.setState({ confirmPassword: input }) 
                        }}
                        warningMode = {this.incorrectConfirmPassword()}
                        style={{
                            marginTop: 5,
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
                        title="Siguiente"
                        onPress={this.handleProceed}
                        disabled={!this.allFieldsAreValid()}
                        style={{
                            marginTop: 25,
                        }}
                    />

                    <TextWithLink
                        text="¿Ya tienes cuenta?"
                        linkedText="Inicia sesión"
                        onPress={() => 
                            this.props.navigation.dispatch(
                                // Reset del navigation stack para que no se muestre 
                                // el botón de 'go back' a profile selection screen.
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'LoginScreen' }]
                                })
                            )
                        }
                        style={{
                            marginTop: 30,
                        }}
                    />

                </View>
                </ScrollView>
            )
        }
    }
}