import React, { Component } from 'react';
// Visuals
import { View, Text } from 'react-native';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage, TextDetails } from '../src/styles/BaseComponents';
import { ActivityIndicator } from 'react-native-paper';
import styles from '../src/styles/styles';
// Register logic
import { register } from '../src/User';
import { tokenManager } from '../src/TokenManager';
import { googleSignIn } from '../src/GoogleAccount';



export default class RegisterScreen1 extends Component {
    constructor(props) {
        super(props)
        this.handleProceed = this.handleProceed.bind(this)
        this.state = {
            loading: false,
            fullName: '',
            email: '',
            password: '',
            errorMessage: undefined,
        }
    }

    handleProceed = async () => {
        // TODO: ver manejo de nº de telefono
        if (this.validateFields()) {
            this.setState({ loading: true });
            
            this.setState({ errorMessage: undefined}) 
            const data = {
                fullname: this.state.fullName,
                mail: this.state.email,
                phone_number: '0123456789',
                blocked: false,
                is_trainer: this.props.route.params.trainer,
                is_athlete: this.props.route.params.athlete,
                password: this.state.password
            }
            await register(data);

            if (this.userIsLogged()) {
                this.props.navigation.replace('HomeScreen');
            }

            this.setState({ loading: false });
        }
    }

    async handleGoogleSignIn() {
        this.setState({ loading: true });

        const phone_number = '0123456789';
        const is_athlete = this.props.route.params.athlete;
        const is_trainer = this.props.route.params.trainer;

        await googleSignIn(phone_number, is_athlete, is_trainer);

        if (this.userIsLogged()) {
            this.props.navigation.replace('HomeScreen');
        }

        this.setState({ loading: false });
    }

    userIsLogged() {
        return tokenManager.getAccessToken() != null
    }

    validateFields = () => {
        const { fullName, email, password } = this.state;
        let errorMessage;
        if (!fullName || !email || !password) {
            errorMessage = 'Complete todos los campos antes de continuar'
        } else if (password.length < 8) {
            errorMessage = 'La contraseña debe tener al menos 8 caracteres'
        } 
        this.setState({ errorMessage: errorMessage})
        return !errorMessage;
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
                <View style={styles.container}>
                    <LoginImage />

                    <TextHeader 
                        body="Ingresa tus datos"
                    />
                    <Text>{this.generateRoleText()}</Text>

                    <DividerWithMiddleText 
                        text="o"
                        style={{
                            marginTop: 5,
                        }} 
                    />

                    <ButtonStandard
                        onPress={() => this.handleGoogleSignIn()}
                        title="Sign In con Google"
                        marginTop={30}
                        marginBottom={10}
                    />

                    {this.state.errorMessage && (
                        <Text style={styles.error}>{this.state.errorMessage}</Text>
                    )}

                    <InputData 
                        placeholder="Nombre y apellido"
                        maxLength={30} 
                        onChangeText={(input) => { 
                            this.setState({ fullName: input }) 
                        }}
                        style={{
                            marginTop: 5,
                        }} 
                    />

                    <InputData 
                        placeholder="Correo electrónico" 
                        maxLength={30}
                        onChangeText={(input) => { 
                            this.setState({ email: input }) 
                        }}
                        style={{
                            marginTop: 5,
                        }} 
                    />

                    <InputData 
                        placeholder="Contraseña" 
                        onChangeText={(input) => { 
                            this.setState({ password: input }) 
                        }}
                        style={{
                            marginTop: 5,
                        }} 
                    />

                    <ButtonStandard
                        title="Siguiente"
                        onPress={this.handleProceed}
                        style={{
                            marginTop: 25,
                        }}
                    />

                    <TextWithLink
                        text="¿Ya tienes cuenta?"
                        linkedText="Inicia sesión"
                        onPress={() => 
                            this.props.navigation.replace('LoginScreen')
                        }
                        style={{
                            marginTop: 10,
                        }}
                    />

                </View>
            )
        }
    }
}