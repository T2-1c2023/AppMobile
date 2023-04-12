import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator, View, Image } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen1 from './screens/RegisterScreen1';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAuthentication } from './utils/hooks/useAuthentication'

const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    // await new Promise(resolve => setTimeout(resolve, 1000));
    this.setState({ isLoading: false });
  }

  loginNavigation = () => {
    return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName={"LoginScreen"}>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ title: 'Welcome' }}
            />
            <Stack.Screen
              name="RegisterScreen1"
              component={RegisterScreen1}
            />
          </Stack.Navigator>
        </NavigationContainer>
    );
  }

  userLoggedNavigation = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"HomeScreen"}>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: 'Welcome' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  rootNavigation = () => {
    const { user } = useAuthentication();

    //return user ? this.userLoggedNavigation : this.loginNavigation;
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Image
          source={require('./assets/images/icon.png')}
          style={{ width: 400, resizeMode: 'center' }}
        />
      );
    }
    return (
      <PaperProvider>
        {this.rootNavigation()}
      </PaperProvider>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
