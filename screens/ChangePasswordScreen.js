import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { TextHeader, TextDetails, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

export default class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pin: '',
        }
    }

    render() {
        return (
            <View style={ styles.container }>
                <TextInput
                    label="Constraseña actual"
                    theme={{ colors: { primary: '#21005D'}}}
                    // onChangeText={text => setText(text)}
                    mode='flat'
                    style={
                        textStyles.inputText
                    }
                    secureTextEntry
                    
                />
                <TextInput
                    label="Nueva contraseña"
                    theme={{ colors: { primary: '#21005D'}}}
                    // onChangeText={text => setText(text)}
                    mode='flat'
                    style={
                        textStyles.inputText
                    }
                    secureTextEntry
                    
                />
                <TextInput
                label="Confirmar contraseña"
                theme={{ colors: { primary: '#21005D'}}}
                // onChangeText={texto => setText(text)}
                mode='flat'
                style={
                    textStyles.inputText
                }
                secureTextEntry
                
            />
                {/* <InputTextWithUnderline
                    header="Contraseña actual"


                /> */}
                
                <ButtonStandard 
                    onPress={() => { 
                        console.log('pin: ', this.state.pin) 
                    }} 
                    title="Cambiar contraseña"
                    style={{
                        marginTop: 100,
                    }}
                />

            </View>
        );
    }
}
const textStyles = StyleSheet.create({
    inputText: {
        backgroundColor: "transparent",
        width: '95%',
        marginTop: 20,
       color: "black",
    }

})
    
// class InputTextWithUnderline extends Component {
//     render() {
//         return (
//             <TextInput
//             label="Email"
//             value={text}
//             onChangeText={text => setText(text)}
//           />
//         );
//     }
// }