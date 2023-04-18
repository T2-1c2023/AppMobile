import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage, TextDetails } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';


export default class RegisterScreen1 extends Component {
    constructor(props) {
        super(props)
        this.handleProceed = this.handleProceed.bind(this)
        this.state = {
            fullName: '',
            email: '',
            password: '',
        }
    }

    handleProceed = () => {
        console.log("user: ", this.state.username, "contraseña: ", this.state.password)
    }

    render() {
        return (
            <View style={styles.container}>
                <LoginImage />

                <TextHeader 
                    body="Ingresa tus datos"
                />
                
                <DividerWithMiddleText 
                    text="o"
                    style={{
                        marginTop: 5,
                    }} 
                />

                <TextDetails 
                    numberOfLines={2}
                    body="Debes completar todos los campos para continuar"
                    style={{
                        marginTop: 5,
                    }}
                />

                <InputData 
                    placeholder="Nombre y apellido" 
                    onChangeText={(input) => { 
                        this.setState({ fullName: input }) 
                    }}
                    style={{
                        marginTop: 25,
                    }} 
                />

                <InputData 
                    placeholder="Correo electrónico" 
                    onChangeText={(input) => { 
                        this.setState({ email: input }) 
                    }}
                    style={{
                        marginTop: 5,
                    }} 
                />

                <InputData 
                    placeholder="Contraseña" 
                    onChangeText={(input) => { 
                        this.setState({ password: input }) 
                    }}
                    style={{
                        marginTop: 5,
                    }} 
                />

                <ButtonStandard
                    title="Siguiente"
                    onPress={this.handleProceed}
                    style={{
                        marginTop: 25,
                    }}
                />

                <TextWithLink
                    text="¿Ya tienes cuenta?"
                    linkedText="Inicia sesión"
                    onPress={() => 
                        this.props.navigation.replace('LoginScreen')
                    }
                    style={{
                        marginTop: 10,
                    }}
                />

            </View>
        )
    }
}