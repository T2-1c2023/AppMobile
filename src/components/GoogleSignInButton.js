import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { ButtonStandard } from '../styles/BaseComponents';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: Constants.manifest?.extra?.webClientId
});   // Default options: you get user email and basic profile info.

export default function GoogleSingInButton() {
    async function onGoogleButtonPress() {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            console.log('Token:' + idToken);

            // Puedo conectar con firebase o enviar token al api gateway
        } catch (error) {
            console.log(error);
            console.log(error.code);
        }
    }

    return (
        <ButtonStandard
            onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
            title="Sign In con Google"
            marginTop={30}
            marginBottom={10}
        />
    );
}


