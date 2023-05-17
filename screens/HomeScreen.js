import React, { Component } from 'react';
// User Session
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Screens 
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'; 
import GoalsListScreen from './GoalsListScreen';
import UserMainScreen from './UserMainScreen';
// Temporary (Test)
import { View, Text } from 'react-native';
import Styles from '../src/styles/styles';
import NewTrainingScreen from './NewTrainingScreen';

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
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        // Decode the token data for the first and only time
        const encoded_jwt = tokenManager.getAccessToken();
        console.log(encoded_jwt);
        const data = jwt_decode(encoded_jwt);
        this.setState({ data: data });
        console.log(data);
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

    // TODO: hacerlo como el menú lateral en figma 
    // https://www.figma.com/proto/jiVNEnqmSViteDehnJC59D/Prototipo?type=design&node-id=35-727&scaling=scale-down&page-id=22%3A517&starting-point-node-id=23%3A3165
    
    // TODO: hay opciones que solo podés mostrarle a entrenadores, un atleta no debería verlas

    // TODO: mostrar la foto de perfil del usuario o una predeterminada si no hay

    // TODO: mostrar de mejor forma que tipo de usuario sos

    /*
        TODO:
        nuevo entrenamiento es de entrenador. Similar a lo de listado de metas y crear meta

        Usar api gateway en vez de servicio de usuarios

        Botón de ver perfiles (WIP)
    */

    // TODO: (no prioritario) mejorar visualmente el sidebar https://www.youtube.com/watch?v=M4WNSjTWFDo

    // TODO: mover botónes al sidebar
    render() {
        return (
            <Drawer.Navigator drawerContent={this.CustomDrawerContent} initialRouteName="Mi Perfil">
                <Drawer.Screen name="Mi Perfil">
                    {() => <UserMainScreen data={this.state.data} navigation={this.props.navigation} />}
                </Drawer.Screen>
                <Drawer.Screen name="Metas">
                    {() => <GoalsListScreen data={this.state.data} navigation={this.props.navigation} />}
                </Drawer.Screen>
                <Drawer.Screen name="Entrenamientos" >
                    {() => <NewTrainingScreen data={this.state.data} navigation={this.props.navigation} />}
                </Drawer.Screen>
                <Drawer.Screen name="Seguidos" component={Test} />
            </Drawer.Navigator>
        );
    }
}

export default HomeScreen;