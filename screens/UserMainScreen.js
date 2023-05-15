import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Styles from '../src/styles/styles';
import { ButtonStandard } from '../src/styles/BaseComponents';

export default class UserMainScreen extends Component {
    constructor(props) {
        super(props);
    }

    getRole() {
        const { is_trainer, is_athlete } = this.props.data;
        if (is_trainer && is_athlete) {
          return 'Trainer and Athlete';
        } else if (is_trainer) {
          return 'Trainer';
        } else if (is_athlete) {
          return 'Athlete';
        } else {
          return 'N/A';
        }
    }
      
    handleGoalScreen = async () => {
        this.props.navigation.navigate('GoalScreen');
    }

    handleGoalsListScreen = async () => {
        this.props.navigation.navigate('GoalsListScreen');
    }

    handleNewTrainingScreen = async () => {
        this.props.navigation.navigate('NewTrainingScreen');
    }

    render() {
        const { fullname, mail } = this.props.data || {};
        return(    
            <View style={Styles.container}>
                    {this.props.data && (
                        /* TODO: ver cargado de imagen de firebase para la foto de perfil */
                        <>
                            <Image
                                source={require('../assets/images/user_predet_image.png')}
                                style={{... styles_hs.userImage, marginTop: 40}}
                            />
                            <Text style={{... styles_hs.text, marginTop: 40}}>Welcome {fullname}!</Text>
                            <Text style={styles_hs.text}>Email: {mail}</Text>
                            <Text style={{... styles_hs.text, marginBottom: 40}}>Role: {this.getRole()}</Text>
                        </>
                    )}

                    <ButtonStandard 
                        title="Crear Meta"
                        onPress={this.handleGoalScreen}
                    />

                    <ButtonStandard 
                        title="Listado de Metas"
                        onPress={this.handleGoalsListScreen}
                        style={{marginTop: 20}}
                    />

                    <ButtonStandard 
                        title="Nuevo Entrenamiento"
                        onPress={this.handleNewTrainingScreen}
                        style={{marginTop: 20}}
                    />
                </View>
        );
    }
}

// TODO: revisar que esto sirva de algo o si hay que moverlo a styles
const styles_hs = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        marginTop: 10,
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 100/2
    }
});