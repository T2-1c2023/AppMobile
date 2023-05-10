import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import Styles from '../src/styles/styles';
import { tokenManager } from '../src/TokenManager';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import jwt_decode from 'jwt-decode';
import { uploadImage } from '../services/Media'; 

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            data: null,
            image: null
        }
    }

    componentDidMount() {
        const encoded_jwt = tokenManager.getAccessToken();
        const data = jwt_decode(encoded_jwt);
        this.setState({ data: data });
        console.log(data);
    }

    async handleImageUpload() {
        const imageUri = await uploadImage();
        console.log('Home:' + imageUri);
        this.setState({ image: imageUri });
    }

    async handleLogout() {
        //const isSignedInGoogle = await GoogleSignin.isSignedIn();
        /*if (isSignedInGoogle) {
            await GoogleSignin.signOut();
        }*/
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
            <View style={styles_hs.container}>
                {this.state.data && (
                    <>
                        <Text style={styles_hs.text}>Welcome {fullname}!</Text>
                        <Text style={styles_hs.text}>Email: {mail}</Text>
                        <Text style={styles_hs.text}>Role: {this.getRole()}</Text>
                    </>
                )}

                {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}

                <Button 
                    title="Subir imágen"
                    onPress={this.handleImageUpload = this.handleImageUpload.bind(this)}
                >

                </Button>

                <Button
                    title="Logout"
                    onPress={this.handleLogout}>
                </Button>
            </View>
        );
    }
}

export default HomeScreen;

const styles_hs = StyleSheet.create({
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
