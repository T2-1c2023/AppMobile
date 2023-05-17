import React, { Component } from 'react';
import { View } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

export default class PassRecoveryConfirmationScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>

                <LoginImage />

                <TextHeader
                    body="¡Buenas noticias!"
                    style={{
                        marginTop: 20,
                    }}
                />

                <TextDetails
                    numberOfLines={3}
                    body="To be implemented..."
                    style={{
                        marginTop: 20,
                    }}
                />

                <TextDetails
                    numberOfLines={3}
                    body="Hemos enviado las instrucciones para restaurar tu contraseña a tu dirección de correo electrónico registrada."
                    style={{
                        marginTop: 20,
                    }}
                />

                <TextDetails
                    numberOfLines={3}
                    body="Si no encuentras el mensaje en tu bandeja de entrada, por favor revisa tu carpeta de spam o correo no deseado."
                    style={{
                        marginTop: 20,
                    }}
                />

                <ButtonStandard
                    title="Volver"
                    style={{
                        marginTop: 70,
                    }}
                    onPress={() => {
                        this.props.navigation.replace('LoginScreen')
                    }}
                />

            </View>
        );
    }
}
