import React, { Component } from 'react';
// User Session
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Screens 
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'; 
import GoalsListScreen from './GoalsListScreen';
import ProfileScreen from './ProfileScreen';
import ProfileEditionScreen from './ProfileEditionScreen';
// Temporary (Test)
import { View, Text } from 'react-native';
import Styles from '../src/styles/styles';
import TrainingsListScreen from './TrainingsListScreen';
import ChangePasswordScreen from './ChangePasswordScreen';

const Drawer = createDrawerNavigator();

function Test() {
    return (
        <View style={Styles.container}>
            <Text>Work In Progress...</Text>
        </View>
    )
}

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.data = jwt_decode(tokenManager.getAccessToken())
        
        console.log(this.data)
    }

    componentDidMount() {
        // Decode the token data for the first and only time
        
        this.setState({ data: this.data });
        // console.log(encoded_jwt)
    }

    handleLogout = async () => {
        const isSignedInGoogle = await GoogleSignin.isSignedIn();
        if (isSignedInGoogle) {
            await GoogleSignin.signOut();
        }
        await tokenManager.unloadTokens()
        this.props.navigation.replace('LoginScreen')
    }

    // So that 'Cerrar Sesión' drawer functions as button
    CustomDrawerContent = (props) => {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem 
                    label="Cerrar Sesión"
                    onPress={this.handleLogout}
                />
            </DrawerContentScrollView>
        )
    }

    // TODO: hay opciones que solo podés mostrarle a entrenadores, un atleta no debería verlas

    // TODO: mostrar la foto de perfil del usuario o una predeterminada si no hay

    // TODO: mostrar de mejor forma que tipo de usuario sos

    /*
        TODO:
        nuevo entrenamiento es de entrenador. Similar a lo de listado de metas y crear meta

        Botón de ver perfiles (WIP)
    */

    // TODO: (no prioritario) mejorar visualmente el sidebar https://www.youtube.com/watch?v=M4WNSjTWFDo

    render() {
        return (
            <Drawer.Navigator drawerContent={this.CustomDrawerContent} initialRouteName="Mi Perfil">
                <Drawer.Screen name="Mi Perfil">
                    {/* {() => <ProfileScreen data={this.data} navigation={this.props.navigation} owner/>} */}
                    {/* {() => <ProfileEditionScreen data={this.data} navigation={this.props.navigation}/>} */}
                    {() => <ChangePasswordScreen/>}
                </Drawer.Screen>
                <Drawer.Screen name="Metas">
                    {() => <GoalsListScreen data={this.data} navigation={this.props.navigation} />}
                </Drawer.Screen>
                <Drawer.Screen name="Entrenamientos" >
                    {() => <TrainingsListScreen data={this.data} navigation={this.props.navigation} />}
                </Drawer.Screen>
                <Drawer.Screen name="Seguidos" component={Test} />
            </Drawer.Navigator>
        );
    }
}

export default HomeScreen;