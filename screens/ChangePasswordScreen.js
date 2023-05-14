import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { HelperText, TextInput, Button, Text } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { TextHeader, TextDetails, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

export default class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props)
        this.handleChangePasswordPress = this.handleChangePasswordPress.bind(this)
        this.confirmPassIsValid = this.confirmPassIsValid.bind(this)
        this.newPassTextInput = React.createRef()
        this.ConfirmPassTextInput = React.createRef()
        this.state = {
            currentPass: '',
            newPass: '',
            confirmPass: '',
        }
    }

    handleChangePasswordPress() {
        Keyboard.dismiss();
        
        // Reemplazar por la o las requests de cambio de contraseña
        alert("contraseñas: " + this.state.confirmPass + ' ' + this.state.newPass + ' ' + this.state.currentPass)
    }

    confirmPassIsValid() {
        return this.state.newPass === this.state.confirmPass
    }

    fieldsNotEmpty() {
        return this.state.currentPass !== '' && this.state.newPass !== '' && this.state.confirmPass !== ''
    }

    render() {

        return (
            <View style={ styles.container }>
                <TextInput
                    label="Constraseña actual"
                    theme={{ colors: { primary: '#21005D'}}}
                    onChangeText={text => this.setState({ currentPass: text })}
                    onSubmitEditing={() => this.newPassTextInput.current.focus()}
                    mode='flat'
                    style={
                        textStyles.inputText
                    }
                    secureTextEntry
                />
                <TextInput
                    ref={this.newPassTextInput}
                    label="Nueva contraseña"
                    theme={{ colors: { primary: '#21005D'}}}
                    onChangeText={text => this.setState({ newPass: text })}
                    onSubmitEditing={() => this.ConfirmPassTextInput.current.focus()}
                    mode='flat'
                    style={
                        textStyles.inputText
                    }
                    secureTextEntry
                    
                />
                <TextInput
                    ref={this.ConfirmPassTextInput}
                    label="Confirmar contraseña"
                    theme={this.confirmPassIsValid() || this.state.confirmPass === ''?
                        { colors: { primary: '#21005D'}} 
                        : 
                        { colors: { primary: 'red'}}}
                    onChangeText={text => this.setState({ confirmPass: text })}
                    mode='flat'
                    style={
                        textStyles.inputText
                    }
                    secureTextEntry
                />
                <HelperText 
                    type="error" 
                    visible={!this.confirmPassIsValid() && this.state.confirmPass !== ''}
                    style={textStyles.helperText}
                >
                    La nueva contraseña no coincide
                </HelperText>
                
                <ButtonStandard 
                    onPress={this.handleChangePasswordPress}
                    title="Cambiar contraseña"
                    disabled={!this.confirmPassIsValid() || !this.fieldsNotEmpty()}
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
    },

    helperText: {
        alignSelf: 'flex-start',
        marginLeft: 15,
        color: 'red',
    }

})



