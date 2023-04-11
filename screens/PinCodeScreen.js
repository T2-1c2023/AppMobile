import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { TextHeader, TextDetails, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

export default class PinCodeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pin: '',
        }
    }

    render() {
        return (
            <View style={ styles.container }>

                <LoginImage />

                <TextHeader 
                    body="Código de verificación" 
                    style={{
                        marginTop: 20,
                    }}
                />

                <TextDetails 
                    numberOfLines={2}    
                    body="Por favor ingresa el código que enviamos a tu cuenta de Whatsapp"
                    style={{
                        marginTop: 20,
                    }} 
                />
                
                <PinInput 
                    onChange={(input) => this.setState({ pin: input })}
                    style={{
                        marginTop: 30,
                    }}
                />

                <ButtonStandard 
                    onPress={() => { 
                        console.log('pin: ', this.state.pin) 
                    }} 
                    title="Verificar"
                    style={{
                        marginTop: 100,
                    }}
                />

            </View>
        );
    }
}
