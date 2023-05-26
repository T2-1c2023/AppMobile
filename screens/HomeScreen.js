import React, { Component } from 'react';
// User Session
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Screens 
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'; 
import GoalsListScreen from './GoalsListScreen';
import GoalScreen from './GoalScreen';
import ProfileScreen from './ProfileScreen';
import ProfileEditionScreen from './ProfileEditionScreen';
// Temporary (Test)
import { View, Text, StyleSheet } from 'react-native';
import Styles from '../src/styles/styles';
import TrainingsListScreen from './TrainingsListScreen';
import ChangePasswordScreen from './ChangePasswordScreen';

import { IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 

import { CommonActions } from '@react-navigation/native';

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
    }

    handleLogout = async () => {
        const isSignedInGoogle = await GoogleSignin.isSignedIn();
        if (isSignedInGoogle) {
            await GoogleSignin.signOut();
        }
        await tokenManager.unloadTokens()
        // this.props.navigation.replace('LoginScreen')


        this.props.navigation.dispatch(
            // Reset del navigation stack para que no se muestre 
            // el botón de 'go back' a profile selection screen.
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }]
            })
        )

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

    // TODO: mostrar de mejor forma que tipo de usuario sos

    /*
        TODO:
        nuevo entrenamiento es de entrenador. Similar a lo de listado de metas y crear meta

        Botón de ver perfiles (WIP)
    */

    // TODO: (no prioritario) mejorar visualmente el sidebar https://www.youtube.com/watch?v=M4WNSjTWFDo

    render() {
        return (
            <Drawer.Navigator 
                drawerContent={this.CustomDrawerContent} 
                initialRouteName="Mi Perfil"
                screenOptions={{
                    drawerActiveTintColor: '#5925b0',
                    drawerStyle: {
                        backgroundColor: '#CCC2DC',
                    },
                    headerStyle: {
                        backgroundColor: '#CCC2DC'
                    }
                }}
            >
                <Drawer.Screen name="Mi Perfil"
                    options={{
                        drawerIcon: () => (
                            <View style={styles.drawerIconContainer}>
                                <FontAwesome name="user-circle-o" size={20} color="black" />
                            </View>
                        ),
                        /*headerRight: () =>
                        <IconButton
                            icon="pencil"
                            iconColor="black"
                            size={30}
                            onPress={() => 
                                this.props.navigation.navigate('ProfileEditionScreen', { trainerData: tokenManager.getAccessToken() })//TO_DO ir a profileeditionscreen
                            }
                        />*/
                    }}
                >
                    {() => <ProfileScreen data={this.data} navigation={this.props.navigation} />}
                    {/* { () => <GoalScreen data={this.data} navigation={this.props.navigation} /> } */}
                </Drawer.Screen>

                <Drawer.Screen name="Metas"
                    options={{
                        drawerIcon: () => (
                            <View style={styles.drawerIconContainer}>
                                <FontAwesome name="bullseye" size={24} color="black" />
                            </View>
                        )
                        
                    }}
                >
                    {() => <GoalsListScreen data={this.data} navigation={this.props.navigation} />}
                </Drawer.Screen>

                {this.data.is_athlete ? 
                    <Drawer.Screen 
                        name="Entrenamientos favoritos" //TO_DO
                        options={{
                            drawerIcon: () => (
                                <View style={styles.drawerIconContainer}>
                                    <FontAwesome5 name="dumbbell" size={16} color="black" />
                                </View>
                            ),
                        }}
                    >
                        {() => <TrainingsListScreen data={this.data} navigation={this.props.navigation} type='favorites' />}

                    </Drawer.Screen>
                : null}

                {this.data.is_athlete ? 
                    <Drawer.Screen 
                        name="Entrenamientos suscriptos"
                        options={{
                            drawerIcon: () => (
                                <View style={styles.drawerIconContainer}>
                                    <FontAwesome5 name="dumbbell" size={16} color="black" />
                                </View>
                            ),
                        }}
                    >
                        {() => <TrainingsListScreen data={this.data} navigation={this.props.navigation} type={'enrolled'} />}

                    </Drawer.Screen>
                : null }

                {this.data.is_trainer ? 
                    <Drawer.Screen 
                        name="Entrenamientos creados"
                        options={{
                            drawerIcon: () => (
                                <View style={styles.drawerIconContainer}>
                                    <FontAwesome5 name="dumbbell" size={16} color="black" />
                                </View>
                            ),
                            headerRight: () =>
                                <IconButton
                                    icon="plus"
                                    iconColor="black"
                                    size={30}
                                    onPress={() => 
                                        this.props.navigation.navigate('NewTrainingScreen', { trainerData: tokenManager.getAccessToken() })
                                    }
                                />
                        }}
                    >
                        {() => <TrainingsListScreen data={this.data} navigation={this.props.navigation} type={'created'} />}

                    </Drawer.Screen>
                : null}
            </Drawer.Navigator>
        );
    }
}

export default HomeScreen;

const styles = StyleSheet.create({
    drawerIconContainer: {
        marginRight: -20
    }
})