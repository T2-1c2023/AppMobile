import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator, View, Image } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen1 from './screens/RegisterScreen1';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAuthentication } from './utils/hooks/useAuthentication'

const Stack = createNativeStackNavigator();

export default App = () => {

  const loginNavigation = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"LoginScreen"}>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ title: 'Welcome' }}
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
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const userLoggedNavigation = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"HomeScreen"}>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ title: 'Welcome' }}
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
        </Stack.Navigator>
      </NavigationContainer >
    );
  }

  const rootNavigation = () => {
    const { user } = useAuthentication();

    return user ? userLoggedNavigation() : loginNavigation();
  }

  return (
    <PaperProvider>
      {rootNavigation()}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
