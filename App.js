import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator, View, Image} from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


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

  render() {
    if (this.state.isLoading) {
      return (
        <Image
          source={require('./assets/images/logo.png')}
          style={{ width: 400, resizeMode: 'center' }}
        />
      );
    }
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"LoginScreen"}>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ title: 'Welcome' }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: 'Welcome' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
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
