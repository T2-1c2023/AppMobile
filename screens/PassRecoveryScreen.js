import React, { Component } from 'react';
import { View } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, InputData, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

export default class PassRecoveryScreen extends Component {
    constructor(props) {
        super(props)
        this.validateEmail = this.validateEmail.bind(this);
        this.state = {
            email: '',
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    render() {
        return (
            <View style={styles.container}>

                <LoginImage />

                <TextHeader
                    body="Restaura tu contraseña"
                    style={{
                        marginTop: 20,
                    }}
                />

                <TextDetails
                    numberOfLines={3}
                    body="Por favor ingresa tu correo electronico. Te enviaremos las instrucciones para restaurar tu contraseña."
                    style={{
                        marginTop: 20,
                    }}
                />

                <InputData
                    placeholder="Correo electrónico"
                    onChangeText={(email) => {
                        this.setState({ email })
                    }}
                />

                <ButtonStandard
                    title="Enviar"
                    style={{
                        marginTop: 70,
                    }}
                    disabled={(this.state.email === '' || !this.validateEmail(this.state.email))}
                    onPress={() => {
                        console.log('To be Implemented');
                        console.log('Enviando a' + this.state.email);
                        this.props.navigation.replace('PassRecoveryConfirmationScreen');
                    }}
                />

            </View>
        );
    }
}
