import React, { Component } from 'react';
import { View } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, FingerprintImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import * as LocalAuthentication from 'expo-local-authentication';
import ReactNativeBiometrics from 'react-native-biometrics';
import {
    RSA
} from 'react-native-rsa-native';

export default class EnrollmentScreen extends Component {
    constructor(props) {
        super(props)
        this.handleEnrollment = this.handleEnrollment.bind(this)
        this.state = {
            fingerprint: '',
            props: props
        }
    }

    async handleEnrollment() {
        //console.log(JSON.stringify(this.props))
        console.log('hasHardwareAsync ' + JSON.stringify(await LocalAuthentication.hasHardwareAsync()))

        const { success } = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Usa tu huella para continuar',
            //cancelLabel: 'Cancelar',
            fallbackLabel: 'Enter password',
            //disableDeviceFallback: true,
        })

        success ? console.log('Autenticación exitosa') : console.log('Autenticación fallida')

        const rnBiometrics = new ReactNativeBiometrics()
        console.log(JSON.stringify(rnBiometrics))
        //console.log('isSensorAvailable ' + await ReactNativeBiometrics.isSensorAvailable());

        rnBiometrics.createKeys()
            .then((resultObject) => {
                const { publicKey } = resultObject
                console.log(publicKey)
                //sendPublicKeyToServer(publicKey)
            })

        //console.log(this.state)
        //this.props.navigation.navigate('LoginScreen')

        await this.enableBiometrics();


    }

    askForBiometrics = async () =>
        await LocalAuthentication.authenticateAsync({
            disableDeviceFallback: true,
            promptMessage: "Enable biometrics login",
            cancelLabel: "Not now",
        });

    enableBiometrics = async () => {
        
        const biometricsResult = await this.askForBiometrics();
        console.log(biometricsResult)
        if (biometricsResult?.success) {
            try {
                const keys = await RSA.generateKeys(1024);
            } catch (error) {
                console.error('enablebiometris ' + error);
            }
            /*await SecureStore.setItemAsync(
                "USER_BIOMETRIC_KEY",
                keys.private
            );
            await postBiometricKey({
                biometricKey: {
                    publicKey: keys.public
                }
            });*/
        }
    };

    render() {
        //TO_DO Atención y ya cuentas sólo si de verdad ya hay huella
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