import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen1 from '../screens/RegisterScreen1';

const Stack = createNativeStackNavigator();

// Flujo de pantallas si el usuario no se encuentra logeado
export default function AuthStack() {
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={"LoginScreen"}>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
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