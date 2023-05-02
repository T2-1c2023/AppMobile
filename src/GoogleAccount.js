import Constants from 'expo-constants';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { registerGoogleAcc, logInGoogleAcc } from './User';
import auth from '@react-native-firebase/auth'
import { tokenManager } from './TokenManager';

GoogleSignin.configure({
    webClientId: Constants.manifest?.extra?.webClientId
});   // Default options: you get user email and basic profile info.

export async function googleSignIn(phone_number, is_athlete, is_trainer) {
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
                await registerGoogleAcc(firebaseToken, phone_number, is_athlete, is_trainer);
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
                console.log(firebaseToken);
                await logInGoogleAcc(firebaseToken);
            })
            .catch((error) => {
                console.error(error);
            })
                        
    } catch (error) {
        console.log(error);
        console.log(error.code);
    }
}

/*export function GoogleLogInButton() {
    async function onGoogleButtonPress() {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            // TODO: esta parte podría ir en firebase.js
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            auth().signInWithCredential(googleCredential)
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
    }

    return (
        <ButtonStandard
            onPress={() => onGoogleButtonPress()}
            title="Log In con Google"
            marginTop={30}
            marginBottom={10}
        />
    );
}*/
