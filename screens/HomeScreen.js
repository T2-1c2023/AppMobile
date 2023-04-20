import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode'; 

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        const encoded_jwt = tokenManager.getAccessToken();
        const data = jwt_decode(encoded_jwt);
        this.setState({ data });
        console.log(data);
    }

    async handleLogout() {
        await tokenManager.unloadTokens()
        this.props.navigation.replace('LoginScreen')
    }

    getRole() {
        const { is_trainer, is_athlete } = this.state.data;
        if (is_trainer && is_athlete) {
          return 'Trainer and Athlete';
        } else if (is_trainer) {
          return 'Trainer';
        } else if (is_athlete) {
          return 'Athlete';
        } else {
          return 'N/A';
        }
    }
      

    render() {
        const { fullname, mail } = this.state.data || {};
        return (
            <View style={styles.container}>
                {this.state.data && (
                    <>
                        <Text style={styles.text}>Welcome {fullname}!</Text>
                        <Text style={styles.text}>Email: {mail}</Text>
                        <Text style={styles.text}>Role: {this.getRole()}</Text>
                    </>
                )}

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
    text: {
        fontSize: 30,
    }
});
