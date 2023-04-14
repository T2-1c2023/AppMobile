import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebase';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

// ToDo --> por alguna razón rompe cuando hago este import
// import { GoogleSignin, GoogleSigninButton, statusCodes, } from '@react-native-google-signin/google-signin';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  const [token, setToken] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "515433769-5dirln5s1j5p21ljgskj2iem5mnj4cp2.apps.googleusercontent.com",
    iosClientId: "515433769-5tsdm43sg2jn3kfooie095humq6802j1.apps.googleusercontent.com",
    androidClientId: "515433769-lhbj6odnvl3es8rv2o1bnd1f9v25ogqm.apps.googleusercontent.com"
  });

  // Vemos si el usuario tiene o no una sesión de Google
  useEffect(() => {
    if(response?.type === "success") {
      setToken(response.authentication.accessToken);
      console.log('Token generado por google: ' + token);
      
      // Inicio la sesión en firebase
      // ToDo --> firebase no puede parsear el google id token
      const credential = GoogleAuthProvider.credential(
        auth,
        response.idToken,
        response.accessToken
      );
      console.log('Credencial generada por firebase: ' + credential);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Usuario autenticado en Firebase: ', user);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }, [response, token]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
          disabled={!request}
          onPress={() => {
            console.log('Login con google');
            promptAsync();
          }}
        >  
          <Image source={require("../assets/images/googleSignIn.png")} style={{width: 300, height: 40}} />
        </TouchableOpacity>          
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