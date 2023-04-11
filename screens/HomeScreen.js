import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import {tokenManager, constante} from '../src/TokenManager';
//import { useAuthentication } from '../utils/hooks/useAuthentication';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        //this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            //user: null,
            data: null
        }
    }

    /*componentDidMount() {
        const { user } = useAuthentication(); 
        this.setState({ user });
    }*/

    handleSignOut = () => {
        try {
            signOut(auth);
            this.props.navigation.replace('LoginScreen');
        } catch (error) {
            console.log('Error al cerrar sesión: ', error.message);
        }
    };

    /*async handleLogout() {
        await tokenManager.unloadTokens()
        this.props.navigation.replace('LoginScreen')
    }*/

    render() {
        const currentUserEmail = auth.currentUser ? auth.currentUser.email : 'usuario desconocido';
        const currentUserDisplayName = auth.currentUser ? auth.currentUser.displayName : 'No display name';
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Bienvenido {currentUserEmail}!</Text>
                <Text style={styles.text}>Nombre: {currentUserDisplayName}</Text>
                <Button
                    title="Logout"
                    onPress={this.handleSignOut}>
                </Button>
            </View>
        );
    }
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
