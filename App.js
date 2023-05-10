import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator, View, Image, Text } from 'react-native';
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

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import ImageUploadTest from './screens/ImageUploadTest';


const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    // await new Promise(resolve => setTimeout(resolve, 1000));

    this.setState({ isLoading: false });
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
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={"LoginScreen"}
            screenOptions={{
              headerStyle: {
                backgroundColor: '#CCC2DC',
              },
              headerTitleAlign: 'center'
            }}
          >
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ title: 'Welcome' }}
            />
            <Stack.Screen
              name="RegisterScreen1"
              component={RegisterScreen1}
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
                )
              })}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
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
