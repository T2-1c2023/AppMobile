import React from 'react';
import Constants from 'expo-constants';
import { ButtonStandard } from '../styles/BaseComponents';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { registerGoogleAcc, logInGoogleAcc } from '../User';

GoogleSignin.configure({
    webClientId: Constants.manifest?.extra?.webClientId
});   // Default options: you get user email and basic profile info.

export function GoogleSignInButton({ phone_number, is_athlete, is_trainer}) {
    
    async function onGoogleButtonPress() {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            await registerGoogleAcc(idToken, phone_number, is_athlete, is_trainer);
            
        } catch (error) {
            console.log(error);
            console.log(error.code);
        }

        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            console.log("Usuario se encuentra logeado con google")
        } else {
            console.log("Usuario no se encuentra logeado")
        }
    }

    return (
        <ButtonStandard
            onPress={() => onGoogleButtonPress()}
            title="Sign In con Google"
            marginTop={30}
            marginBottom={10}
        />
    );
}

export function GoogleLogInButton() {
    async function onGoogleButtonPress() {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            console.log('Token:' + idToken);
            await logInGoogleAcc();
            
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
}
