import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}


/*import React, { Component } from 'react';
import { View, Button, Text, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Handler that will cause the notification to show the alert
// (even when user is not currently using the application)
/*Notifications.setNotificationHandler({
    handleNotification: async () => ({
        // Configuration for when a notification is received
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
});*/

/*class NotificationsTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expoPushToken: '',
            notification: false,
        };
        // So that I can unsubscribe from listeners on componentWillUnmount
        //this.notificationListener = React.createRef();
        //this.responseListener = React.createRef();
    }

    /*componentDidMount() {
        this.registerForPushNotificationsAsync().then((token) => 
            this.setState({ expoPushToken: token })
        );

        
        // When a notification is received by the app, the callback function is called. 
        this.notificationListener.current = 
            Notifications.addNotificationReceivedListener((notification) => {
                this.setState({ notification });
            });
        
        // When user interacts with notification, the callback function is called.
        this.responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(response);
            });
    }

    // Unsubscribe from listeners
    componentWillUnmount() {
        Notifications.removeNotificationSubscription(
            this.notificationListener.current
        );
        Notifications.removeNotificationSubscription(
            this.responseListener.current
        );
    }

    registerForPushNotificationsAsync = async () => {
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
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();

            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        return token;
    }

    schedulePushNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { data: 'goes here' },
            },
            trigger: { seconds: 2},
        });
    };*/

    /*render() {
        const  { expoPushToken, notification } = this.state;
        
        return (
            <View
                style={{
                    flex:1,
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }}
            >
                <Text>Your expo push token: {expoPushToken}</Text>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Title: {notification && notification.request.content.title} </Text>
                    <Text>Title: {notification && notification.request.content.body} </Text>
                    <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
                </View>
            </View>
        )
    }
}

export default NotificationsTest;

//--------------------------------------------------------------------------------
/*
import React, { Component } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../../src/Notifications';

class NotificationTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expoPushToken: '',
            notification: false,
        };
    }

    componentDidMount() {
        registerForPushNotificationsAsync().then((token) => 
            this.setState({ expoPushToken: token })
        );
    }

    schedulePushNotification = async () => {
        Alert.alert("Programando Notificación");
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { data: 'goes here' },
            },
            trigger: { seconds: 2},
        });
    };

    render() {
        const  { expoPushToken, notification } = this.state;
        
        return (
            <View
                style={{
                    flex:1,
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }}
            >
                <Text>Your expo push token: {expoPushToken}</Text>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Title: {notification && notification.request.content.title} </Text>
                    <Text>Title: {notification && notification.request.content.body} </Text>
                    <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
                </View>
                <Button
                    title="Press to schedule a notification"
                    onPress={this.schedulePushNotification}
                />
            </View>
        )
    }
}

export default NotificationTest;
*/