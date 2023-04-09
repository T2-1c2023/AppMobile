import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
        console.log('email:', this.state.email, 'password:', this.state.password)
        createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
            console.log('Account created!')
            const user = userCredential.user;
            console.log(user)
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