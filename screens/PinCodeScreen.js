import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { TextHeader, TextDetails, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';


export default class PinCodeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pin: '',
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'yellow' }}>
                
                <LoginImage />

                <TextHeader body="Código de Verificacion" />

                <TextDetails body="Por favor ingresa el código que enviamos a tu cuenta de Whatsapp" />
                
                <PinInput 
                    callback={(code) => this.setState({ pin: code })}
                    style={pinStyles.pinInput}
                />

                <ButtonStandard 
                    onPress={() => { 
                        console.log('pin: ', this.state.pin) 
                    }} 
                    title="Verificar" 
                />

            </View>
        );
    }
}

const pinStyles = StyleSheet.create({
    pinInput: { 
        backgroundColor: 'black'
     }
})
