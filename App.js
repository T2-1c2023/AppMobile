// PRUEBA DE CONCEPTO LOGIN CON GOOGLE
/*
import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session'; // Para versión actualizada
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Versión de documentación de expo https://docs.expo.dev/guides/google-authentication/ (deprecada)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "515433769-5dirln5s1j5p21ljgskj2iem5mnj4cp2.apps.googleusercontent.com",
    iosClientId: "515433769-5tsdm43sg2jn3kfooie095humq6802j1.apps.googleusercontent.com",
    androidClientId: "515433769-lhbj6odnvl3es8rv2o1bnd1f9v25ogqm.apps.googleusercontent.com"
    // androidClientId (firebase): AIzaSyBQsSPYZH7Uwnt8gwvxsNbf09xrlwlKFRA
    // clientId (firebase): AIzaSyD4FQ79tPQz70hWShAvVJe3WldnMPYzWFw
    // No funcionan los de firebase "Oauth client not found"
    // Ir a google cloud y preguntar como usar el de firebase o si es necesario
  });*/

  // Version actualizada https://github.com/expo/fyi/blob/main/auth-proxy-migration.md pero no compila
  /*const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '515433769-5dirln5s1j5p21ljgskj2iem5mnj4cp2.apps.googleusercontent.com',
      scopes: [...],
      redirectUri: makeRedirectUri({
      scheme: 'your-scheme'
      }),
    },
  );*/

  // Vemos si el usuario tiene o no una sesión de Google
  /*useEffect(() => {
    if(response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me", 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      console.log(error);
    }
  }

  const ShowUserInfo = () => {
    if(userInfo) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 35, fontWeight: 'bold', marginBottom: 20}}>Welcome</Text>
          <Image source={{uri: userInfo.picture}} style={{width: 100, height: 100, borderRadius: 50}} />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{userInfo.name}</Text>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      {userInfo && <ShowUserInfo />}
      {userInfo === null && 
        <>
        <Text style={{fontSize: 35, fontWeight: 'bold', marginBottom: 20}}>Welcome</Text>
        <Text style={{fontSize: 35, fontWeight: 'bold', marginBottom: 20, color: 'gray'}}>Please login</Text>
        <TouchableOpacity
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        >  
          <Image source={require("./assets/images/googleSignIn.png")} style={{width: 300, height: 40}} />
        </TouchableOpacity>          
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/


//================================================================================================
// PROGRAMA PRINCIPAL USANDO NAVIGATION
import React from 'react';
import './config/firebase';
import RootNavigation from './navigation/index';

export default function App() {
  return (
    <RootNavigation />
  );
}

//================================================================================================
// PROGRAMA PRINCIPAL

/*import React, { Component } from 'react';
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

export default function App() {

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
*/