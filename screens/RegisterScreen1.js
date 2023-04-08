import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';

export default class RegisterScreen1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fullName: '',
            email: '',
            password: '',
        }
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
                    onPress={() => { console.log("user: ", this.state.username, "contraseña: ", this.state.password) }}
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