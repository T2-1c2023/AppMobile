import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { TextHeader, TextDetails, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import PhoneInput from "react-native-phone-number-input";

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

                <View style={{marginTop: 30,}}>
                    <PhoneInput
                        defaultCode="AR"
                        autoFocus
                        withShadow
                        placeholder='Número de teléfono'
                        onChangeFormattedText={(text) => {
                            console.log(text)
                        }}
                        layout="second"
                        textInputStyle={{
                            backgroundColor: 'transparent',

                        }}
                        codeTextStyle={{
                            backgroundColor: 'transparent',

                        }}
                        flagButtonStyle={{
                            backgroundColor: 'transparent',

                        }}
                        textContainerStyle={{
                            backgroundColor: 'transparent',

                        }}
                        containerStyle={{
                            backgroundColor: '#CCC2DC',
                            // borderColor: 'black',
                            borderWidth: 1,
                            borderRadius: 40,
                        }}
                    />
                </View>

                <ButtonStandard
                    onPress={() => {
                        console.log('pin: ', this.state.pin)
                    }}
                    title="Verificar"
                    style={{
                        marginTop: 70,
                    }}
                />

            </View>
        );
    }
}
