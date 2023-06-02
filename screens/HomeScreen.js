import React, { Component } from 'react';
// User Session
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Screens 
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'; 

import GoalsListScreen from './GoalsListScreen';
import { ListMode } from './GoalsListScreen';

import { Mode } from './GoalScreen';

import ProfileScreen from './ProfileScreen';
import ProfileEditionScreen from './ProfileEditionScreen';
import TrainingsListScreen from './TrainingsListScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
// Temporary (Test)
import { View, Text, StyleSheet } from 'react-native';
import Styles from '../src/styles/styles';



import { IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 

import { CommonActions } from '@react-navigation/native';

import Constants from 'expo-constants'
const Drawer = createDrawerNavigator();
const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

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
        this.createGoalButtonForAthlete = this.createGoalButtonForAthlete.bind(this)

        this.data = jwt_decode(tokenManager.getAccessToken())
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

    createGoalButton(mode) {
        return (
            <IconButton
                icon="plus"
                iconColor="black"
                size={30}
                onPress={() => this.props.navigation.navigate('GoalScreen', 
                    {
                        userData: this.data, 
                        mode: mode,
                    }
                )}
            />
        )
    }

    createGoalButtonForTrainer() {

    }

    createGoalButtonForAthlete() {
        return this.createGoalButton(Mode.AthleteCreate)
    }

    // botón solo para atletas
    renderPersonalGoalsLeftButton() {
        return (
            <Drawer.Screen name="Metas personales en proceso"
                options={{
                    drawerIcon: () => (
                        <View style={styles.drawerIconContainer}>
                            <FontAwesome name="bullseye" size={24} color="black" />
                        </View>
                    ),
                    headerRight: this.createGoalButtonForAthlete
                }}
            >
                {() => <GoalsListScreen 
                        data={this.data} 
                        navigation={this.props.navigation}
                        listMode={ListMode.AthletePersonalGoalsLeft} 
                />}
            </Drawer.Screen>
        )
    }

    // botón solo para atletas
    renderPersonalGoalsCompletedButton() {
        return (
            <Drawer.Screen name={"Metas personales cumplidas"}
                options={{
                    drawerIcon: () => (
                        <View style={styles.drawerIconContainer}>
                            <FontAwesome name="bullseye" size={24} color="black" />
                        </View>
                    ),
                }}
            >
                {() => <GoalsListScreen 
                        data={this.data} 
                        navigation={this.props.navigation}
                        listMode={ListMode.AthletePersonalGoalsCompleted} 
                />}
            </Drawer.Screen>
        )
    }

    render() {
        return (
            <Drawer.Navigator 
                drawerContent={this.CustomDrawerContent} 
                initialRouteName="Metas personales en proceso"
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
                        headerRight: () =>
                        <IconButton
                            icon="pencil"
                            iconColor="black"
                            size={25}
                            onPress={() => 
                                this.props.navigation.navigate('ProfileEditionScreen', { data: this.data })
                            }
                        />
                    }}
                >
                    {() => <ProfileScreen data={this.data} navigation={this.props.navigation} owner/>}
                </Drawer.Screen>

                {this.data.is_athlete && this.renderPersonalGoalsLeftButton()}
                {this.data.is_athlete && this.renderPersonalGoalsCompletedButton()}
                

                {this.data.is_athlete ? 
                    <Drawer.Screen 
                        name="Entrenamientos favoritos"
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
                                        this.props.navigation.navigate('TrainingsListScreen', { token: tokenManager.getAccessToken(), type:'all'})
                                    }
                                />
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
                            headerRight: () =>
                                <IconButton
                                    icon="plus"
                                    color="black"
                                    size={30}
                                    onPress={() => 
                                        this.props.navigation.navigate('TrainingsListScreen', { token: tokenManager.getAccessToken(), type:'all'})
                                    }
                                />
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
                                        this.props.navigation.navigate('NewTrainingScreen', { trainerData: tokenManager.getAccessToken(), isNew: true })
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