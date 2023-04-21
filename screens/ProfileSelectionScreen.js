import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ProfileInput from '../src/components/ProfileInput';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage, TextDetails } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';


export default class ProfileSelectionScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            trainer: false,
            athlete: false,
            showError: false,
        }
    }

    handleProceed = () => {
        if (!this.state.trainer && !this.state.athlete) {
            this.setState({ showError: true });
        } else {
            this.props.navigation.navigate('RegisterScreen1', {
                trainer: this.state.trainer,
                athlete: this.state.athlete,
            });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <LoginImage />

                <TextHeader
                    body="Empecemos"
                />

                <TextDetails
                    numberOfLines={1}
                    body="Elige tu tipo de perfil"
                    style={{
                        marginTop: 5,
                    }}
                />

                <TextDetails
                    numberOfLines={1}
                    body="Se puede elegir más de un tipo"
                    style={{
                        marginTop: 0,
                    }}
                />

                <ProfileInput 
                    onChange={({ trainer, athlete }) => {
                        this.setState({ trainer: trainer, athlete: athlete });
                    }}
                    style={{
                        marginTop: 20,
                    }}
                />

                {this.state.showError && (
                    <Text style={styles.error}>Seleccione por lo menos una de las opciones</Text>
                )}

                <ButtonStandard
                    title="Siguiente"
                    onPress={this.handleProceed}
                    style={{
                        marginTop: 50,
                    }}
                />
            </View>
        )
    }
}