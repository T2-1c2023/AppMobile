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
import { View, Text, StyleSheet } from 'react-native';
import Styles from '../src/styles/styles';
import TrainingsListScreen from './TrainingsListScreen';
import ChangePasswordScreen from './ChangePasswordScreen';

import { IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 

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
        
        //console.log(this.data)
    }

    componentDidMount() {
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
                        )
                    }}
                >
                    {() => <ProfileScreen data={this.data} navigation={this.props.navigation} owner/>}
                    {/* {() => <ProfileEditionScreen data={this.data} navigation={this.props.navigation}/>}*/}
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

                <Drawer.Screen 
                    name="Entrenamientos"
                    options={{
                        drawerIcon: () => (
                            <View style={styles.drawerIconContainer}>
                                <FontAwesome5 name="dumbbell" size={16} color="black" />
                            </View>
                        ),
                        headerRight: () =>
                            this.data.is_trainer ? (
                                <IconButton
                                    icon="plus"
                                    color="black"
                                    size={30}
                                    onPress={() => 
                                        this.props.navigation.navigate('NewTrainingScreen', { trainerData: tokenManager.getAccessToken() })
                                    }
                                />
                            ) : null
                    }}
                >
                    {() => <TrainingsListScreen data={this.data} navigation={this.props.navigation} />}

                </Drawer.Screen>
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