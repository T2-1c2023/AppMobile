import React, { Component } from 'react';
import { View, StyleSheet, Keyboard, Alert } from 'react-native';
import { HelperText, TextInput, Button, Text } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { TextHeader, TextDetails, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ActivityIndicator } from 'react-native-paper';
import { updateUserData } from '../src/User';
import { titleManager } from '../src/TitleManager';

export default class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props)
        this.handleChangePasswordPress = this.handleChangePasswordPress.bind(this)
        this.confirmPassIsValid = this.confirmPassIsValid.bind(this)
        this.newPassTextInput = React.createRef()
        this.ConfirmPassTextInput = React.createRef()
        this.state = {
            loading: false,
            currentPass: '',
            currentPassHidden: true,
            newPass: '',
            newPassHidden: true,
            confirmPass: '',
            confirmPassHidden: true,
        }
    }

    componentDidMount() {
        titleManager.setTitle(this.props.navigation, "Cambiar contraseña", 22)
    }

    handleChangePasswordPress() {
        Keyboard.dismiss();
        
        const { data } = this.props.route.params;
        Alert.alert(
            'Cambio de contraseña',
            'Esta seguro que desea cambiar la contraseña?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Continuar', onPress: this.changePassword}
            ],
            { cancelable: false }
        );
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
    }

    changePassword = async () => {
        this.setState({ loading: true });
        try {
            const { newPass } = this.state;
            const userId = this.props.route.params.data.id;
            const newData = {
                password: newPass
            };
            await updateUserData(newData, userId);
            this.setState({ loading: false });
            this.props.navigation.replace('HomeScreen');
        } catch (error) {
            console.log(error);
            this.setState({ loading: false });
        }
    }

    passWarningMode() {
        return (
            this.state.newPass.length < 8 && this.state.newPass.length > 0
        )
    }

    confirmPassIsValid() {
        return this.state.newPass === this.state.confirmPass
    }

    confirmPassWarningMode() {
        return !this.confirmPassIsValid() && this.state.confirmPass !== ''
    }

    fieldsNotEmpty() {
        return this.state.currentPass !== '' && this.state.newPass !== '' && this.state.confirmPass !== ''
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
                    <TextInput
                        ref={this.newPassTextInput}
                        label="Nueva contraseña"
                        theme={this.passWarningMode()? textStyles.themeErrorColors : textStyles.themeColors}
                        onChangeText={text => this.setState({ newPass: text })}
                        onSubmitEditing={() => this.ConfirmPassTextInput.current.focus()}
                        mode='flat'
                        style={
                            textStyles.inputText
                        }
                        secureTextEntry={this.state.newPassHidden}
                        right={
                            <TextInput.Icon 
                                icon={this.state.newPassHidden? "eye-outline" : "eye-off-outline"}
                                iconColor="black" 
                                onPress={() => this.setState({ newPassHidden: !this.state.newPassHidden})}
                            />
                        }
                    />

                    { this.passWarningMode() &&
                        <HelperText 
                            type="error" 
                            visible
                            style={textStyles.helperText}
                        >
                            La contraseña debe ser más larga
                        </HelperText>
                    }

                    <TextInput
                        ref={this.ConfirmPassTextInput}
                        label="Confirmar contraseña"
                        theme={this.confirmPassIsValid() || this.state.confirmPass === ''? 
                            textStyles.themeColors 
                            : 
                            textStyles.themeErrorColors
                        }
                            
                        onChangeText={text => this.setState({ confirmPass: text })}
                        mode='flat'
                        style={
                            textStyles.inputText
                        }
                        secureTextEntry = {this.state.confirmPassHidden}
                        right={
                            <TextInput.Icon 
                                icon={this.state.confirmPassHidden? "eye-outline" : "eye-off-outline"}
                                iconColor="black" 
                                onPress={() => this.setState({ confirmPassHidden: !this.state.confirmPassHidden })}
                            />
                        }
                    />
                    {this.confirmPassWarningMode() && 
                        <HelperText 
                            type="error" 
                            visible
                            style={textStyles.helperText}
                        >
                            La nueva contraseña no coincide
                        </HelperText>
                    }
                    
                    <ButtonStandard 
                        onPress={this.handleChangePasswordPress}
                        title="Cambiar contraseña"
                        disabled={this.confirmPassWarningMode() || !this.fieldsNotEmpty() || this.passWarningMode()}
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



