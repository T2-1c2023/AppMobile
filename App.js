import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "515433769-5dirln5s1j5p21ljgskj2iem5mnj4cp2.apps.googleusercontent.com",
    iosClientId: "515433769-5tsdm43sg2jn3kfooie095humq6802j1.apps.googleusercontent.com",
    androidClientId: "515433769-lhbj6odnvl3es8rv2o1bnd1f9v25ogqm.apps.googleusercontent.com"
  });

  // Vemos si el usuario tiene o no una sesión de Google
  React.useEffect(() => {
    if(response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo(); // Solo si hay un token hace un fetch
    }
  }, [response, accessToken])

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userInfo = await response.json();
    setUser(userInfo);
  }

  const ShowUserInfo = () => {
    if(user) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 35, fontWeight: 'bold', marginBottom: 20}}>Welcome</Text>
          <Image source={{uri: user.picture}} style={{width: 100, height: 100, borderRadius: 50}} />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user.name}</Text>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      {user && <ShowUserInfo />}
      {user === null && 
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
});

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
});*/
