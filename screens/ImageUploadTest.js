import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { uploadImage } from '../services/Media'; 

class ImageUploadTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            image: null
        }
    }

    componentDidMount() {
        const data = {
            fullname: 'Nombre',
            mail: 'un mail',
            is_athlete: true,
            is_trainer: false
        }

        this.setState({ data: data })
    }

    async handleImageUpload() {
        const imageUri = await uploadImage();
        console.log('Home:' + imageUri);
        this.setState({ image: imageUri });
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
            </View>
        );
    }
}

export default ImageUploadTest;

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
