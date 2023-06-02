import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default', // Display name of notification channel
            // To ensure notifications from this channel are displayed
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C' // LED light (if available)
        });
    }

    if (Device.isDevice) {
        //const { status: existingStatus } =
        //    await Notifications.getPermissionsAsync();

        //let finalStatus = existingStatus;
        //if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            //finalStatus = status;
        //}

        if (status !== 'granted') {
            return;
        }
        
        token = (await Notifications.getDevicePushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}