import React, { Component } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ProfileInput from '../src/components/ProfileInput';
import { TextHeader, DividerWithMiddleText, ButtonStandard, InputData, TextWithLink, LoginImage, TextDetails } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { titleManager } from '../src/TitleManager';
import { UserContext } from '../src/contexts/UserContext';

export default class RoleSelectionScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.handleProceed = this.handleProceed.bind(this)

        this.state = {
            trainer: false,
            athlete: false,
        }
    }

    componentDidMount() {
        titleManager.setTitle(this.props.navigation, "Elegir rol", 22)
    }

    async handleProceed() {
        this.state.athlete? await this.context.setAsAthlete()
        :
        this.state.trainer? await this.context.setAsTrainer()
        :
        alert('No se seleccionó ningún rol')

        this.props.navigation.replace('HomeScreen')
    }

    render() {
        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                keyboardShouldPersistTaps='handled'
                style={styles.scrollView}
            >
            <View style={styles.container}>
                <LoginImage 
                    style={{
                        marginTop: 30,
                    }}
                />

                <TextHeader
                    body="Tienes más de un rol"
                />

                <TextDetails
                    numberOfLines={1}
                    body="Elige con cúal deseas iniciar sesión"
                    style={{
                        marginTop: 5,
                    }}
                />

                <ProfileInput 
                    onChange={({ trainer, athlete }) => {
                        this.setState({ trainer: trainer, athlete: athlete });
                    }}
                    style={{
                        marginTop: 20,
                    }}
                    multiSelect
                />


                <ButtonStandard
                    title="Continuar"
                    onPress={this.handleProceed}
                    disabled={!(this.state.trainer || this.state.athlete)}
                    style={{
                        marginTop: 50,
                    }}
                />

            </View>
            </ScrollView>
        )
    }
}