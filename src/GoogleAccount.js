import Constants from 'expo-constants';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { registerGoogleAcc, logInGoogleAcc } from './User';
import auth from '@react-native-firebase/auth'
import { tokenManager } from './TokenManager';
import jwt_decode from "jwt-decode";

GoogleSignin.configure({
    webClientId: Constants.manifest?.extra?.webClientId
});   // Default options: you get user email and basic profile info.

// On success returns user's mail, on failure returns undefined.
export function googleSignIn(data) {
    // TODO: emprolijar esto sacando el .then
    return new Promise(async (resolve, reject) => {
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
        await auth()
          .signInWithCredential(googleCredential)
          .then(async (userCredential) => {
            const firebaseToken = await userCredential.user.getIdToken();
            data.token = firebaseToken;
  
            const success = await registerGoogleAcc(data);
  
            if (success) {
              const decodedToken = await jwt_decode(data.token);
              console.log('GoogleAccount retorna:', decodedToken.email);
              resolve(decodedToken.email); // Resolve with the email value
            } else {
              reject(new Error('Registration failed.'));
            }
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

export async function googleLogIn() {
    try {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
        // TODO: esta parte podría ir en firebase.js
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        await auth().signInWithCredential(googleCredential)
            .then(async (userCredential) => {
                const firebaseToken = await userCredential.user.getIdToken();
                await logInGoogleAcc(firebaseToken);
            })
            .catch((error) => {
                console.error(error);
            })
                        
    } catch (error) {
        console.log(error);
        console.log(error.code);
    }

    // If user was not registered and a google account was signed in, sign out.
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn && tokenManager.getAccessToken() === null) {
        await GoogleSignin.signOut();
    }
}
