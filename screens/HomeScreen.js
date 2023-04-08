import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {tokenManager, constante} from '../src/TokenManager';

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            data: null
        }
    }

    async handleLogout() {
        await tokenManager.unloadTokens()
        this.props.navigation.replace('LoginScreen')
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Home Screen</Text>
                <Button
                    title="Logout"
                    onPress={this.handleLogout}>
                </Button>
            </View>
        );
    }
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
