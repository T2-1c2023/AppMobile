import React, { Component } from 'react';
import { View, Button, Alert } from 'react-native';
import Video from 'react-native-video';
// TODO: adaptar Media.js para que funcione con videos
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
// Back end request
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../../src/TokenManager';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

class VerificationTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUri: null,
        };
    };

    selectVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1
        });

        if (!result.canceled) {
            const videoUri = result.assets[0].uri;
            this.setState({ videoUri });
            Alert.alert(
                'Confirmar',
                'Desea subir el video?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Continuar', 
                      onPress: () => this.uploadVideoFirebaseRecognizedTrainer(videoUri) 
                    }
                ]
            );
        }
    };

    // Tries to upload video to firebase. On success, sends request to back end
    uploadVideoFirebaseRecognizedTrainer = async (uri) => {
        try {
            // Video id for firebase storage
            const videoId = Date.now().toString();
            const storageRef = storage().ref().child(`videos/${videoId}`);
            await storageRef.putFile(uri);
            this.requestRecognizedTrainer(videoId);
        } catch (error) {
            console.error(error);
        }
    }

    requestRecognizedTrainer = async (videoId) => {
        const trainer_id = this.props.data.id;
        const url = API_GATEWAY_URL + 'recognized-trainers/' + trainer_id;
        const headers = {
            Authorization: tokenManager.getAccessToken()
        }
        const data = {
            video_id: videoId      
        }

        try {
            const response = await axios.post(url, data, { headers });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { videoUri } = this.state;

        return (
            <View>
                <Button title="Subir Video" onPress={this.selectVideo} />
                {videoUri && <Video source={{ uri: videoUri }} style={{ width: 300, height: 300 }} repeat={true} />}
            </View>
        );
    }
}

export default VerificationTest;