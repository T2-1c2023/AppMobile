import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

// Flujo de pantallas si el usuario no se encuentra logeado
export default function UserStack() {
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ title: 'Welcome' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
    );
}