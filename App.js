import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator, View, Image, Text, Button } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen1 from './screens/RegisterScreen1';
import PinCodeScreen from './screens/PinCodeScreen';
import PhoneNumberScreen from './screens/phoneNumberScreen';
import PassRecoveryScreen from './screens/PassRecoveryScreen';
import PassRecoveryConfirmationScreen from './screens/PassRecoveryConfirmationScreen';
import EnrollmentScreen from './screens/EnrollmentScreen';
import ProfileSelectionScreen from './screens/ProfileSelectionScreen';
import GoalScreen from './screens/GoalScreen';
import PlaygroundScreen from './screens/PlaygroundScreen';
import GoalsListScreen from './screens/GoalsListScreen';
import NewTrainingScreen from './screens/NewTrainingScreen';
import TrainingActivitiesScreen from './screens/TrainingActivitiesScreen';
import TrainingsListScreen from './screens/TrainingsListScreen';

import ChangePasswordScreen from './screens/ChangePasswordScreen';
import TrainingScreen from './screens/TrainingScreen'; 
import TrainingGoalsEditionScreen from './screens/TrainingGoalsEditionScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileEditionScreen from './screens/ProfileEditionScreen';
import TrainingReviewScreen from './screens/TrainingReviewScreen';
import TrainingsReviewsListScreen from './screens/TrainingsReviewsListScreen';
import ValidatePasswordScreen from './screens/ValidatePasswordScreen';
import InterestsScreen from './screens/InterestsScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import FlashMessage  from 'react-native-flash-message';
import * as Notifications from 'expo-notifications';

// Chat Test (borrar)
import ChatTest from './screens/test_screens/ChatTest';

import { AppProvider } from './src/contexts/UserContext';

// Handler that will cause the notification to show the alert
// (even when user is not currently using the application)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
      // Configuration for when a notification is received
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
  })
});

const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    // So that I can unsubscribe from listeners on componentWillUnmount
    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();
  }

  async componentDidMount() {
    // await new Promise(resolve => setTimeout(resolve, 1000));

    this.setState({ isLoading: false });

    // Set notification listeners
    // When a notification is received by the app, the callback function is called. 
    this.notificationListener.current = 
    Notifications.addNotificationReceivedListener((notification) => {
        this.setState({ notification });
    });

    // When user interacts with notification, the callback function is called.
    this.responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
        });
  }

  componentWillUnmount() {
    // Unsubscribe from listeners
    Notifications.removeNotificationSubscription(
      this.notificationListener.current
    );
    Notifications.removeNotificationSubscription(
        this.responseListener.current
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Image
          source={require('./assets/images/icon.png')}
          style={{ width: 400, resizeMode: 'center' }}
        />
      );
    }
    return (
      <PaperProvider><AppProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={"LoginScreen"}
            screenOptions={{
              headerStyle: {
                backgroundColor: '#CCC2DC',
              },
              headerTitleAlign: 'center',
              // headerShown: false
            }}
          >
            <Stack.Screen 
              name='ChatTest'
              component={ChatTest}
            />

            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterScreen1"
              component={RegisterScreen1}
            />
            <Stack.Screen
              name="InterestsScreen"
              component={InterestsScreen}
            />
            <Stack.Screen
              name="ProfileSelectionScreen"
              component={ProfileSelectionScreen}
            />
            <Stack.Screen
              name="PinCodeScreen"
              component={PinCodeScreen}
            />
            <Stack.Screen
              name="PhoneNumberScreen"
              component={PhoneNumberScreen}
            />
            <Stack.Screen
              name="PassRecoveryScreen"
              component={PassRecoveryScreen}
            />
            <Stack.Screen
              name="PassRecoveryConfirmationScreen"
              component={PassRecoveryConfirmationScreen}
            />
            <Stack.Screen
              name="EnrollmentScreen"
              component={EnrollmentScreen}
            />
            <Stack.Screen
              name="PlaygroundScreen"
              component={PlaygroundScreen}
            />
            <Stack.Screen
              name="GoalScreen"
              component={GoalScreen}
              // options={({ route }) => ({ title: route.params.title })}
              
              //temporal
              //--------
              options={() => ({ title: 'Nueva meta' })}
              //--------
            />
            <Stack.Screen
              name="GoalsListScreen"
              component={GoalsListScreen}
              
              //temporal
              //--------
              options={() => ({
                headerTitle: () => (
                  <Text numberOfLines={2} style={{ fontSize: 16, textAlign: 'center' }}>
                    Definicion muscular - Cuerpo 
                    {'\n'}
                    Metas
                  </Text>
                )
              })}
              //--------
            />
            <Stack.Screen
              name="NewTrainingScreen"
              component={NewTrainingScreen}
              options={() => ({ title: 'Nuevo entrenamiento' })}
            />

            <Stack.Screen
              name="TrainingActivitiesScreen"
              component={TrainingActivitiesScreen}
              options={() => ({
                headerTitle: () => (
                  <Text numberOfLines={2} style={{ fontSize: 16, textAlign: 'center' }}>
                    Definicion muscular - Cuerpo 
                    {'\n'}
                    Actividades
                  </Text>
                )
              })}
            />

            <Stack.Screen
              name="TrainingsListScreen"
              component={TrainingsListScreen}
              options={() => ({
                headerTitle: () => (
                  <Text numberOfLines={2} style={{ fontSize: 16, textAlign: 'center' }}>
                    Titulo
                    {'\n'}
                    Subtitulo
                  </Text>
                ),
              })}
            />

            <Stack.Screen 
              name="TrainingsReviewsListScreen"
              component={TrainingsReviewsListScreen}
            />

            <Stack.Screen
              name="ChangePasswordScreen"
              component={ChangePasswordScreen}
              options={{ title: "Cambio de contraseña" }}
            />

            <Stack.Screen
              name="ValidatePasswordScreen"
              component={ValidatePasswordScreen}
              options={{ title: "Validar contraseña" }}
            />

            <Stack.Screen 
              name="TrainingGoalsEditionScreen"
              component={TrainingGoalsEditionScreen}
            />

            <Stack.Screen 
              name="ProfileScreen"
              component={ProfileScreen}
            />

            <Stack.Screen 
              name="ProfileEditionScreen"
              component={ProfileEditionScreen}
            />

            <Stack.Screen
              name='TrainingScreen'
              component={TrainingScreen}
            />

            <Stack.Screen 
              name="TrainingReviewScreen"
              component={TrainingReviewScreen}
            />

          </Stack.Navigator>
        </NavigationContainer>
        <FlashMessage position="bottom" />
        </AppProvider></PaperProvider>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
