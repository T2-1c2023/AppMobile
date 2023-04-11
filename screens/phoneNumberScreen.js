import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { PhoneNumberInput } from '../src/components/PhoneInput'
import { TextHeader, TextDetails, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

export default class PhoneNumberScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: '',
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <LoginImage />

                <TextHeader
                    body="Estamos por terminar"
                    style={{
                        marginTop: 20,
                    }}
                />

                <TextDetails
                    numberOfLines={2}
                    body="Te enviaremos una notificación a tu cuenta de Whatsapp."
                    style={{
                        marginTop: 20,
                    }}
                />

                <PhoneNumberInput 
                    style={{ 
                        marginTop: 30,
                    }}
                    onChange={(number) => {
                        console.log('number: ', number)
                    }}
                />

                <ButtonStandard
                    title="Verificar"
                    style={{
                        marginTop: 70,
                    }}
                    onPress={() => {
                        console.log('pressed')
                    }}
                />

            </View>
        );
    }
}
