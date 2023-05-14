import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Styles from '../src/styles/styles';
import { ButtonStandard } from '../src/styles/BaseComponents';
import { tokenManager } from '../src/TokenManager';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import jwt_decode from 'jwt-decode';
// import { createDrawerNavigator } from '@react-navigation/drawer'; 

// const Drawer = createDrawerNavigator();

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        const encoded_jwt = tokenManager.getAccessToken();
        const data = jwt_decode(encoded_jwt);
        this.setState({ data: data });
        console.log(data);
    }

    async handleLogout() {
        const isSignedInGoogle = await GoogleSignin.isSignedIn();
        if (isSignedInGoogle) {
            await GoogleSignin.signOut();
        }
        await tokenManager.unloadTokens()
        this.props.navigation.replace('LoginScreen')
    }

    getRole() {
        const { is_trainer, is_athlete } = this.state.data;
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

    // TODO: el homescreen donde muestre info del usuario y una barra lateral para acceder a las otras partes.

    // TODO: hacerlo como el menú lateral en figma 
    // https://www.figma.com/proto/jiVNEnqmSViteDehnJC59D/Prototipo?type=design&node-id=35-727&scaling=scale-down&page-id=22%3A517&starting-point-node-id=23%3A3165
    
    // TODO: hay opciones que solo podés mostrarle a entrenadores, un atleta no debería verlas

    // TODO: mostrar la foto de perfil del usuario o una predeterminada si no hay

    // TODO: mostrar de mejor forma que tipo de usuario sos

    render() {
        const { fullname, mail } = this.state.data || {};
        return (
            <View style={Styles.container}>
                {this.state.data && (
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
                    title="Crear Meta (entrenador)"
                    onPress={this.handleGoalScreen}
                />

                <ButtonStandard 
                    title="Listado de Metas (entrenador)"
                    onPress={this.handleGoalsListScreen}
                    style={{marginTop: 20}}
                />

                <ButtonStandard 
                    title="Nuevo Entrenamiento"
                    onPress={this.handleNewTrainingScreen}
                    style={{marginTop: 20}}
                />

                <ButtonStandard
                    title="Logout"
                    onPress={this.handleLogout}
                    style={{marginTop: 20}}
                />
            </View>
        );
    }
}

export default HomeScreen;

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
