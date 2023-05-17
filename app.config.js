import 'dotenv/config';

export default {
  "expo": {
    "name": "FiuFitApp",
    "slug": "FiuFitApp",
    "scheme": "https://auth.expo.io/@juanh2607/FiuFitApp", // Id único de la aplicación
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.fiufit.appmobile"
    },
    "android": {
      "permissions": ["USE_FINGERPRINT"],
      "package": "com.fiufit.appmobile",
      "googleServicesFile": "./google-services.json",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "plugins": ["@react-native-google-signin/google-signin"],
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "2b9479bc-70c2-45c2-b25d-f071de17130a"
      },
      "firebaseApiKey": process.env.FIREBASE_API_KEY,
      "firebaseAuthDomain": process.env.FIREBASE_AUTH_DOMAIN,
      "firebaseProjectId": process.env.FIREBASE_PROJECT_ID,
      "firebaseStorageBucket": process.env.FIREBASE_STORAGE_BUCKET,
      "firebaseMessagingSenderId": process.env.FIREBASE_MESSAGING_SENDER_ID,
      "firebaseAppId": process.env.FIREBASE_APP_ID,
      "firebaseMeasurementId": process.env.FIREBASE_MEASUREMENT_ID,

      "clientId": process.env.CLIENT_ID,
      "androidClientId": process.env.ANDROID_CLIENT_ID,
      "iosClientId": process.env.IOS_CLIENT_ID,

      "webClientId": process.env.WEB_CLIENT_ID,

      "apiGatewayUrl": process.env.API_GATEWAY_URL
    }
  }
}
