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
import TrainingsListScreen from './TrainingsListScreen';
import ChatList from './ChatList';

import ChangePasswordScreen from './ChangePasswordScreen';

import UsersListScreen from './UsersListScreen';

// Temporary (Test)
import { View, Text, StyleSheet } from 'react-native';
import Styles from '../src/styles/styles';
import NotificationsTest from './test_screens/NotificationsTest';
import ChatTest from './test_screens/ChatTest';
import VerificationTest from './test_screens/VerificationTest';



import { IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 

import { CommonActions } from '@react-navigation/native';

import { UserContext } from '../src/contexts/UserContext';

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
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.createGoalButtonForAthlete = this.createGoalButtonForAthlete.bind(this)
        this.createGoalButtonForTrainer = this.createGoalButtonForTrainer.bind(this)

        // this.data = jwt_decode(tokenManager.getAccessToken())
        this.data = tokenManager.getPayload()
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
                <DrawerItem 
                    label={ this.context.name + " - Rol: " + (this.context.isTrainer? "Entrenador" : "Atleta")}
                />
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
        return this.createGoalButton(Mode.TrainerCreate)
    }

    // botón solo para entrenadores
    renderTrainerCreatedGoalsButton() {
        return (
            <Drawer.Screen name="Metas creadas"
                options={{
                    drawerIcon: () => (
                        <View style={styles.drawerIconContainer}>
                            <FontAwesome name="bullseye" size={24} color="black" />
                        </View>
                    ),
                    headerRight: this.createGoalButtonForTrainer
                }}
            >
                {() => <GoalsListScreen
                        navigation={this.props.navigation}
                        listMode={ListMode.TrainerGoalsCreated} 
                />}
            </Drawer.Screen>
        )
    }


    createGoalButtonForAthlete() {
        return this.createGoalButton(Mode.AthleteCreate)
    }

    // botón solo para atletas
    renderPersonalGoalsLeftButton() {
        return (
            <Drawer.Screen name="              En proceso"
                options={{
                    headerRight: this.createGoalButtonForAthlete
                }}
            >
                {() => <GoalsListScreen
                        navigation={this.props.navigation}
                        listMode={ListMode.AthletePersonalGoalsLeft} 
                />}
            </Drawer.Screen>
        )
    }

    // botón solo para atletas
    renderPersonalGoalsCompletedButton() {
        return (
            <Drawer.Screen name={"              Completadas"}

            >
                {() => <GoalsListScreen
                        navigation={this.props.navigation}
                        listMode={ListMode.AthletePersonalGoalsCompleted} 
                />}
            </Drawer.Screen>
        )
    }

    renderAthleteTrainingGoalsButton(completed) {
        return (
            <Drawer.Screen name={completed? 
                "             Completadas" 
                : 
                "             En proceso"
            }>
                {() => <GoalsListScreen
                        navigation={this.props.navigation}
                        listMode={completed? 
                            ListMode.AthletesAllTrainingsGoalsCompleted 
                            : 
                            ListMode.AthleteAllTrainingsGoalsLeft
                        }
                />}
            </Drawer.Screen>
        )
    }

    renderSearchUsers() {
        return (
            <Drawer.Screen name="Buscar usuarios"
                options={{
                    drawerIcon: () => (
                        <View style={styles.drawerIconContainer}>
                            <FontAwesome name="search" size={24} color="black" />
                        </View>
                    ),
                }}
            >
                {() => <UsersListScreen mode={"search"} navigation={this.props.navigation}/>}
            </Drawer.Screen>
        )
    }

    renderTitle(title, icon) {
        return (
            <Drawer.Screen 
                name={title}
                options={{
                    drawerIcon: () => (
                        <View style={styles.drawerIconContainer}>
                            <FontAwesome name={icon} size={24} color="black" />
                        </View>
                    ),
                }}
            >
                {() => <></>}
            </Drawer.Screen>
        )
    }

    renderTitle5(title, icon) {
        return (
            <Drawer.Screen 
                name={title}
                options={{
                    drawerIcon: () => (
                        <View style={styles.drawerIconContainer}>
                            <FontAwesome5 name={icon} size={16} color="black" />
                        </View>
                    ),
                    }}
            >
                {() => <></>}
            </Drawer.Screen>
        )
    }

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

                {this.renderSearchUsers()}

                {this.context.isTrainer && this.renderTrainerCreatedGoalsButton()}

                {this.context.isAthlete && this.renderTitle("Metas personales", "bullseye")}
                {this.context.isAthlete && this.renderPersonalGoalsLeftButton()}
                {this.context.isAthlete && this.renderPersonalGoalsCompletedButton()}

                {this.context.isAthlete && this.renderTitle("Metas de entrenamientos", "bullseye")}
                {this.context.isAthlete && this.renderAthleteTrainingGoalsButton(completed=false)}
                {this.context.isAthlete && this.renderAthleteTrainingGoalsButton(completed=true)}


                {this.context.isAthlete && this.renderTitle5("Entrenamientos", "dumbbell")}

                {this.context.isAthlete ? 
                    <Drawer.Screen
                        name="             Favoritos"
                        options={{
                            headerRight: () =>
                                <IconButton
                                    icon="magnify"
                                    iconColor="black"
                                    size={30}
                                    onPress={() => 
                                        this.props.navigation.navigate('TrainingsListScreen', { token: tokenManager.getAccessToken(), type:'all'})
                                    }
                                />
                        }}
                    >
                        {() => <TrainingsListScreen data={this.data} navigation={this.props.navigation} type='favorites' athleteId={this.data.id}/>}

                    </Drawer.Screen>
                : null}

                {this.context.isAthlete ? 
                    <Drawer.Screen 
                        name="             Suscriptos"
                        options={{
                            headerRight: () =>
                                <IconButton
                                    icon="magnify"
                                    iconColor="black"
                                    size={30}
                                    onPress={() => 
                                        this.props.navigation.navigate('TrainingsListScreen', { token: tokenManager.getAccessToken(), type:'all'})
                                    }
                                />
                        }}
                    >
                        {() => <TrainingsListScreen data={this.data} navigation={this.props.navigation} type={'enrolled'} athleteId={this.data.id} />}

                    </Drawer.Screen>
                : null }

                {this.context.isTrainer ? 
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
                        {() => <TrainingsListScreen data={this.data} navigation={this.props.navigation} type={'created'} trainerId={this.data.id} />}

                    </Drawer.Screen>
                : null}

                <Drawer.Screen name="Chats"
                    options={{
                        drawerIcon: () => (
                            <View style={styles.drawerIconContainer}>
                                <FontAwesome name="comment" size={20} color="black" />
                            </View>
                        ),
                    }}
                >
                    {() => 
                      <ChatList 
                        data={this.data} 
                        navigation={this.props.navigation}
                      />
                    }
                </Drawer.Screen>

                <Drawer.Screen name="Notificaciones Test"
                    options={{
                        drawerIcon: () => (
                            <View style={styles.drawerIconContainer}>
                                <FontAwesome name="bell" size={20} color="black" />
                            </View>
                        ),
                    }}
                >
                    {() => <NotificationsTest />}
                </Drawer.Screen>

                {this.data.is_trainer ?
                    <Drawer.Screen name="Verification Test"
                    options={{
                        drawerIcon: () => (
                            <View style={styles.drawerIconContainer}>
                                <FontAwesome name="check" size={20} color="black" />
                            </View>
                        ),
                    }}
                    >
                        {() => <VerificationTest data={this.data} />}
                    </Drawer.Screen>
                : null }

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