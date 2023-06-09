import React, { Component } from 'react';
import { View, StyleSheet, Keyboard, Alert } from 'react-native';
import { HelperText, TextInput, Button, Text } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { TextHeader, TextDetails, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ActivityIndicator } from 'react-native-paper';
import { updateUserData } from '../src/User';

export default class ValidatePasswordScreen extends Component {
    constructor(props) {
        super(props)
        this.handleValidatePasswordPress = this.handleValidatePasswordPress.bind(this)
        this.state = {
            loading: false,
            currentPass: '',
            currentPassHidden: true,
        }
    }

    handleValidatePasswordPress() {
        Keyboard.dismiss();
        
        //const { data } = this.props.route.params;
        /*if (this.state.currentPass !== data.password) {
            Alert.alert(
                'Contraseña Incorrecta',
                'La contraseña actual proporcionada no coincide con la contraseña requerida.\nPor favor, verifique e intente nuevamente.'
            );
        } else {
            Alert.alert(
                'Cambio de contraseña',
                'Esta seguro que desea cambiar la contraseña?'
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Continuar', onPress: this.changePassword}
                ],
                { cancelable: false }
            );
        }*/

        this.props.navigation.replace('EnrollmentScreen');
    }

    fieldsNotEmpty() {
        return this.state.currentPass.length >= 8
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#21005D" />
                    <Text style={{marginTop: 30}}>Realizando cambio...</Text>
                </View>
            )
        } else {
            return (
                <View style={ styles.container }>
                    <TextInput
                        label="Constraseña actual"
                        theme={textStyles.themeColors}
                        onChangeText={text => this.setState({ currentPass: text })}
                        onSubmitEditing={() => this.newPassTextInput.current.focus()}
                        mode='flat'
                        style={
                            textStyles.inputText
                        }
                        secureTextEntry = {this.state.currentPassHidden}
                        right={
                            <TextInput.Icon 
                                icon={this.state.currentPassHidden? "eye-outline" : "eye-off-outline"}
                                iconColor="black" 
                                onPress={() => this.setState({ currentPassHidden: !this.state.currentPassHidden })}
                            />
                        }
                    />
                    
                    <ButtonStandard 
                        onPress={this.handleValidatePasswordPress}
                        title="Validar contraseña"
                        disabled={!this.fieldsNotEmpty()}
                        style={{
                            marginTop: 100,
                        }}
                    />

                </View>
            );
        }
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
    },

    themeColors: {
        colors: { 
            //placeholder unfocus (big and small)
            onSurfaceVariant: 'black',
            
            //underline unfocus
            onSurface: 'black',

            //underline and title focus
            primary: '#21005D',        
        }
    },

    themeErrorColors: {
        colors: { 
            onSurfaceVariant: 'black',
            onSurface: 'red', 
            primary: 'red', 
        }
    },
})



