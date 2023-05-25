import React, { Component } from 'react';
import { View } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, FingerprintImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import * as LocalAuthentication from 'expo-local-authentication';

export default class EnrollmentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fingerprint: '',
        }
    }

    async handleEnrollment() {
        const { success } = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Usa tu huella para continuar',
            cancelLabel: 'Cancelar',
            disableDeviceFallback: true,
        })
        
        this.props.route.navigation.navigate('LoginScreen')


        success ? console.log('Autenticación exitosa') : console.log('Autenticación fallida')

    }

    render() {
        return (
            <View style={styles.container}>

                <FingerprintImage
                    style={{ marginTop: 20 }}
                />

                <TextHeader
                    body="Deberás utilizar el sensor de tu dispositivo"
                    style={{
                        marginTop: 20,
                    }}
                />

                <TextDetails
                    numberOfLines={2}
                    body="¡Atención!"
                    style={{
                        marginTop: 20,
                    }}
                    warning
                />

                <TextDetails
                    numberOfLines={3}
                    body="Ya cuentas con una huella registrada. Si continuas, se reemplazará la huella anterior por la nueva."
                    style={{
                        marginTop: 20,
                    }}
                    warning
                />

                <ButtonStandard
                    onPress={this.handleEnrollment}
                    title="Continuar"
                    style={{
                        marginTop: 50,
                    }}
                />

            </View>
        );
    }
}