import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import axios from 'axios';

export default class RegisterScreen1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fullName: '',
            email: '',
            password: '',
        }
    }

    handleCreateAccount = () => {
        console.log('nombre: ', this.state.fullName, 'email:', this.state.email, 'password:', this.state.password)
        createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
            console.log('Account created!');
            const user = userCredential.user;
            updateProfile( user, {
                displayName: this.state.fullName
            });
            console.log(user);
            
            user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                // ToDo --> Crear .js donde se hagan los envíos de token
                console.log('Enviando Token: ' + idToken);
                
                // ToDo --> ver como hacer con los diferentes roles
                const data = {
                    role: 'atleta', // O entrenador
                };

                const config = {
                    headers: {
                        Authorization: `Bearer ${idToken}`
                    }
                }

                axios.put('https://ejemplo.com/api/recurso', data, config)
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                });
            }).catch(function(error) {
                console.log(error.message);
            })
        })
        .catch(error => {
            console.log(error)
            Alert.alert(error.message)
        })
    }

    render() {
        return (
            <View>
                <LoginImage />
                <TextHeader>Empecemos</TextHeader>
                <DividerWithMiddleText text='o' />
                <Text>Debes completar todos los campos para continuar</Text>
                <InputData 
                    placeholder="Nombre y apellido" 
                    onChangeText={(input) => { this.setState({ fullName: input }) }} 
                />
                <InputData 
                    placeholder="Correo electrónico" 
                    onChangeText={(input) => { this.setState({ email: input }) }} 
                />
                <InputData 
                    placeholder="Contraseña" 
                    onChangeText={(input) => { this.setState({ password: input }) }} 
                />

                <ButtonStandard
                    onPress={this.handleCreateAccount}
                    title="Siguiente"
                />

                <TextWithLink
                    text="¿Ya tienes cuenta?"
                    linkedText="Inicia sesión"
                    onPress={() => this.props.navigation.replace('LoginScreen')}
                />
            </View>
        )
    }
}