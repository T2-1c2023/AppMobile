import React, { Component } from 'react';
// Visuals
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage, TextDetails } from '../src/styles/BaseComponents';
import { ActivityIndicator, HelperText } from 'react-native-paper';
import styles from '../src/styles/styles';
import Modal from 'react-native-modal';
// Register logic
import { register } from '../src/User';
import { tokenManager } from '../src/TokenManager';
import { googleSignIn } from '../src/GoogleAccount';
// Navigation
import { CommonActions } from '@react-navigation/native';
// Notifications
import { registerForPushNotificationsAsync } from '../src/Notifications';
// Location
import * as Location from 'expo-location';
import { getLocation } from '../services/Geocoding';

import { titleManager } from '../src/TitleManager';

export default class RegisterScreen1 extends Component {
    constructor(props) {
        super(props)
        this.handleProceed = this.handleProceed.bind(this)
        this.state = {
            loading: false,
            googleSignInPopUp: false,
            fullName: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: undefined,
            weight: 0,
            location: {
              latitude: 0,
              longitude: 0
            },
            locationDisplayName: ''
        }

        this.phoneInput = React.createRef()
        this.emailInput = React.createRef()
        this.passwordInput = React.createRef()
        this.confirmPasswordInput = React.createRef()
        this.weightInput = React.createRef()
    }

    componentDidMount() {
        titleManager.setTitle(this.props.navigation, "Registrarse", 22)
    }

    async handleProceed() {
        if (!this.allFieldsAreValid())
            return

        this.setState({ loading: true })

        let expo_push_token = await registerForPushNotificationsAsync();
        if (expo_push_token === undefined) {
            expo_push_token = '';
        }

        const data = {
            fullname: this.state.fullName,
            mail: this.state.email,
            phone_number: this.state.phone,
            blocked: false,
            is_trainer: this.props.route.params.trainer,
            is_athlete: this.props.route.params.athlete,
            password: this.state.password,
            expo_push_token: expo_push_token,
            location: {
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude
            },
            weight: parseInt(this.state.weight, 10)
        }

        console.log(data);
        const success = await register(data);
        console.log(success)

        if (success) {
            this.props.navigation.navigate('PinCodeScreen', { mail: this.state.email });
        }

        this.setState({ loading: false });
    }

    handleGoogleSignIn = async () => {
        this.setState({ loading: true });

        let expo_push_token = await registerForPushNotificationsAsync();
        if (expo_push_token === undefined) {
            expo_push_token = '';
        }

        const data = {
            is_trainer: this.props.route.params.trainer,
            is_athlete: this.props.route.params.athlete,
            expo_push_token: expo_push_token,
            phone_number: this.state.phone,
            location: {
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude
            },
            weight: parseInt(this.state.weight, 10)
        }

        const userMail = await googleSignIn(data);
        
        console.log('RegisterScreen1 recibió', userMail);
        if (userMail !== undefined) {
            this.props.navigation.navigate('PinCodeScreen', { mail: userMail });
        }

        this.setState({ loading: false });
    }

    userIsLogged() {
        return tokenManager.getAccessToken() != null
    }

    allFieldsAreValid() {
        const { fullName, email, password, confirmPassword, weight, locationDisplayName } = this.state;

        const passwordIsValid = password.length >= 8
        const confirmPasswordIsValid = password == confirmPassword
        const emailIsValid = this.emailIsValid(email)
        const fullNameIsValid = fullName.length > 0
        const weightIsValid = weight > 0
        const locationIsValid = (locationDisplayName !== '')

        return passwordIsValid && confirmPasswordIsValid && emailIsValid && fullNameIsValid && weightIsValid && locationIsValid
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

    incorrectWeight() {
        const weightInt = parseInt(this.state.weight); 
        return (weightInt <= 0 || isNaN(weightInt)) && this.state.weight.length > 0
    }

    getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permiso para acceder a la ubicación denegado');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        this.setState({ location: { latitude, longitude } });

        const formattedLocation = await getLocation(latitude, longitude);
        console.log(formattedLocation);
        this.setState( { locationDisplayName: formattedLocation });
    }

    allGoogleFieldsAreValid = () => {
        const { phone, weight, locationDisplayName } = this.state;

        // TODO: el checkeo de teléfono es más complejo, por ahora queda así
        const phoneIsValid = phone !== '';
        const weightIsValid = weight > 0;
        const locationIsValid = (locationDisplayName !== '');

        return phoneIsValid && weightIsValid && locationIsValid;
    }

    renderGoogleSignInPopUp = () => {
        const { googleSignInPopUp, locationDisplayName } = this.state;
        
        return (
          <Modal
            isVisible={googleSignInPopUp}
            animationIn='slideInDown'
            animationOut='slideOutUp'
            animationInTiming={100}
          >
            <View style={popupStyles.popupContainer}>
              <Text style={popupStyles.title}>Complete los siguientes campos antes de continuar:</Text>
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
                placeholder="Peso (kg)"
                ref={this.weightInput}
                onChangeText={(input) => {
                    this.setState({ weight: input })
                }}
                keyboardType = 'numeric'
                warningMode={this.incorrectWeight()}
                style={{
                    marginTop: 5,
                }}
              />

              {this.incorrectWeight() &&
                <HelperText
                    type="error"
                    style={{
                        color: 'red',
                        width: 250,
                    }}
                >
                    El peso debe ser mayor a 0
                </HelperText>
                }

              <ButtonStandard
                  title="Agregar Ubicación"
                  onPress={this.getLocation}
                  style={{ marginTop: 10 }}
              />

              { locationDisplayName !== '' && (
                  <View style={{ width: 250, marginTop: 10 }}>
                      <Text style={{ textAlign: 'center', fontWeight: '500' }}>
                          {locationDisplayName}
                      </Text>
                  </View>
              )}

              <ButtonStandard 
                title='Continuar' 
                onPress={this.handleGoogleSignIn}
                disabled={!this.allGoogleFieldsAreValid()}
                style={{ marginTop: 10 }} 
              />             

              <ButtonStandard 
                title='Cerrar' onPress={() => this.setState({ googleSignInPopUp: false })}
                style={{ marginTop: 10 }} 
              />
            </View>
          </Modal>
        )
    }

    render() {
        const { locationDisplayName } = this.state;
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#21005D" />
                    <Text style={{ marginTop: 30 }}>Creating account, please wait</Text>
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
                            onPress={() => this.setState({ googleSignInPopUp: true })}
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
                            warningMode={this.emailWarningMode()}
                            style={{
                                marginTop: 5,
                            }}
                            autoComplete="username"
                        />

                        {this.emailWarningMode() &&

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
                            warningMode={this.passwordWarningMode()}
                            style={{
                                marginTop: 5,
                            }}
                        />

                        {this.passwordWarningMode() &&

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
                            onSubmitEditing={() => this.weightInput.current.focus()}
                            warningMode={this.incorrectConfirmPassword()}
                            style={{
                                marginTop: 5,
                            }}
                            autoComplete="password"
                        />

                        {this.incorrectConfirmPassword() &&

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

                        <InputData
                            placeholder="Peso (kg)"
                            ref={this.weightInput}
                            onChangeText={(input) => {
                                this.setState({ weight: input })
                            }}
                            keyboardType = 'numeric'
                            warningMode={this.incorrectWeight()}
                            style={{
                                marginTop: 5,
                            }}
                        />

                        <ButtonStandard
                          title="Agregar Ubicación"
                          onPress={this.getLocation}
                          style={{ marginTop: 10 }}
                        />

                        { locationDisplayName !== '' && (
                            <View style={{ width: 250, marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', fontWeight: '500' }}>
                                    {locationDisplayName}
                                </Text>
                            </View>
                        )}

                        <ButtonStandard
                            title="Siguiente"
                            onPress={this.handleProceed}
                            disabled={!this.allFieldsAreValid()}
                            style={{
                                marginTop: 10,
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

                        {this.renderGoogleSignInPopUp()}

                    </View>
                </ScrollView>
            )
        }
    }
}

const popupStyles = StyleSheet.create({
    popupContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 400,
        marginBottom: 10,
        textAlign: 'center'
    }
})