// PRUEBA DE CONCEPTO LOGIN CON GOOGLE (EXPO)

/*import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session'; // Para versión actualizada
import { StyleSheet, Text, View, Image, TouchableOpacity, Button } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Versión de documentación de expo https://docs.expo.dev/guides/google-authentication/ (deprecada)
  // Este 'funciona' +- pero por lo menos carga
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "515433769-5dirln5s1j5p21ljgskj2iem5mnj4cp2.apps.googleusercontent.com",
    iosClientId: "515433769-5tsdm43sg2jn3kfooie095humq6802j1.apps.googleusercontent.com",
    androidClientId: "515433769-lhbj6odnvl3es8rv2o1bnd1f9v25ogqm.apps.googleusercontent.com"
    // androidClientId (firebase): AIzaSyBQsSPYZH7Uwnt8gwvxsNbf09xrlwlKFRA
    // clientId (firebase): AIzaSyD4FQ79tPQz70hWShAvVJe3WldnMPYzWFw
    // No funcionan los de firebase "Oauth client not found"
    // Ir a google cloud y preguntar como usar el de firebase o si es necesario
  });

  // Version actualizada https://github.com/expo/fyi/blob/main/auth-proxy-migration.md pero no compila
  /*const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "515433769-5dirln5s1j5p21ljgskj2iem5mnj4cp2.apps.googleusercontent.com",
      iosClientId: "515433769-5tsdm43sg2jn3kfooie095humq6802j1.apps.googleusercontent.com",
      androidClientId: "515433769-lhbj6odnvl3es8rv2o1bnd1f9v25ogqm.apps.googleusercontent.com",
      //scopes: [...],
      redirectUri: makeRedirectUri({
        // scheme: 'https://auth.expo.io/@juanh2607/FiuFitApp'  // Ver link de github de abajo
        scheme: 'https://auth.expo.io/@juanh2607/FiuFitApp://expo-development-client/?url=https://u.expo.dev/2b9479bc-70c2-45c2-b25d-f071de17130a?channel-name=default'
      }),
    },
  );*/
  // Creo que hay que cambiar el scheme pero no lo entiendo bien: 
  // https://github.com/expo/fyi/blob/main/auth-proxy-migration.md#using-authexpoio-proxy
  // https://auth.expo.io/@juanh2607/FiuFitApp://expo-development-client/?url=https://u.expo.dev/2b9479bc-70c2-45c2-b25d-f071de17130a?channel-name=default

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
            console.log('Login con google');
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
