import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import Video from 'react-native-video';
// TODO: adaptar Media.js para que funcione con videos
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';

// TODO: subir video a firebase
// TODO: pegarle al api gateway


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
        }
    };

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