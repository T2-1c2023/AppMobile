import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage, TextDetails } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { register } from '../src/User';


export default class RegisterScreen1 extends Component {
    constructor(props) {
        super(props)
        this.handleProceed = this.handleProceed.bind(this)
        this.state = {
            fullName: '',
            email: '',
            password: '',
        }
    }

    handleProceed = async () => {
        // TODO: ver manejo de nº de telefono
        const data = {
            fullname: this.state.fullName,
            mail: this.state.email,
            phone_number: '0123456789',
            blocked: false,
            is_trainer: this.props.route.params.trainer,
            is_athlete: this.props.route.params.athlete,
            is_admin: false,
            password: this.state.password
        }
        await register(data);
       
        if (this.userIsLogged) {
            this.props.navigation.replace('HomeScreen');
        }
    }

    userIsLogged() {
        return tokenManager.getAccessToken() != null
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

                <TextDetails 
                    numberOfLines={2}
                    body="Debes completar todos los campos para continuar"
                    style={{
                        marginTop: 5,
                    }}
                />

                <InputData 
                    placeholder="Nombre y apellido" 
                    onChangeText={(input) => { 
                        this.setState({ fullName: input }) 
                    }}
                    style={{
                        marginTop: 25,
                    }} 
                />

                <InputData 
                    placeholder="Correo electrónico" 
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