import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { tokenManager } from '../TokenManager';

// import { responseErrorHandler } from '../src/utils/responseErrorHandler'
// Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsIm1haWwiOiJzZWJhc3RpYW5Ac2ViYXN0aWFuLmNvbSIsImZ1bGxuYW1lIjoiU2ViYXN0acOhbiBDYXBlbGxpIiwicGhvbmVfbnVtYmVyIjoiOTk5ODg4Nzc3IiwiYmxvY2tlZCI6ZmFsc2UsImlzX3RyYWluZXIiOmZhbHNlLCJpc19hdGhsZXRlIjp0cnVlLCJwaG90b19pZCI6IjE2ODc4MDM2MzMwNDEiLCJpc192ZXJpZmllZCI6dHJ1ZSwiZXhwb19wdXNoX3Rva2VuIjoiRXhwb25lbnRQdXNoVG9rZW5bSTJKUGJ0RmJmc3JEU3lOQVIzNXBhb10iLCJsYXRpdHVkZSI6Ii0zNC42MzEwMzgiLCJsb25naXR1ZGUiOiItNTguNDY1NzIwMiIsIndlaWdodCI6NjUsImlzX3JlY29nbml6ZWRfdHJhaW5lciI6ZmFsc2UsImlzX2FkbWluIjpmYWxzZSwiaWF0IjoxNjg3ODEwMjcyLCJleHAiOjE2ODc4MTM4NzJ9.Ti98g9J3bV0DS8MPQaOh1Rkl9ZQucaYngQKZCoYdARs"
// responseErrorHandler(error.response, this.props.navigation)

goToLoginScreen = (navigation) => {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }]
        })
    )
}

handle401= (navigation) => {
    if (tokenManager.tokenLoaded()) {
        tokenManager.unloadTokens().then(() => {
            alert("Su sesión ha expirado");
            goToLoginScreen(navigation);
        })
    }
}

export function responseErrorHandler(response, navigation) {
        if (response.status === 401) {
            console.log("[responseErrorHandler] 401");
            handle401(navigation);
        }
        else if (response.status === 404) {
            console.log("[responseErrorHandler] 404");
        }
        else if (response.status === 500) {
            console.log("[responseErrorHandler] 500");
        }
        else if (response.status === 503) {
            // console.log("[responseErrorHandler] 503");
        }
        else if (response.status === 400) {
            console.log("[responseErrorHandler] 400");
        }
        else {
            console.log("[responseErrorHandler] " + response.status);
        }
}
