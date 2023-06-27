import React, { Component } from 'react';
// Visuals
import { View, Text, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import { ButtonStandard } from '../styles/BaseComponents';
import Video from 'react-native-video';
import { Ionicons } from '@expo/vector-icons';
// Video
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
// Requests
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../TokenManager';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

// Pop up that lets a trainer request to be verified with a video
export default class TrainerVerification extends Component {
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
    }

    render() {
        const { onClose } = this.props;
        const { fullname } = this.props.data;
        const { videoUri } = this.state;

        return (
          <View style={styles.popupContainer}>
            <Text style={styles.title}>Solicitud de Verificación de Entrenador</Text>
            <Text style={styles.description}>Hola {fullname}!{'\n'} Por favor, seleccione un video para solicitar la verificación como entrenador:</Text>
            
            {videoUri ? (
                    <View style={{ alignItems: 'center'}}>
                      <TouchableOpacity onPress={this.selectVideo}>
                        <Video source={{ uri: videoUri }} style={{ width: 300, height: 300 }} repeat={true} />
                      </TouchableOpacity>
                      <View style={styles.buttonContainer}>
                        <Pressable
                        style={({ pressed }) => [
                            styles.pressableButton,
                            { backgroundColor: pressed ? '#150043' : '#21005D' },
                        ]}
                        onPress={() => console.log('Pressed')}
                        >
                          <Text style={styles.buttonText}>Enviar Solicitud</Text>
                        </Pressable>
                       </View>
                    </View>
                ) : (
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={this.selectVideo}>
                          <Ionicons name="videocam-outline" size={80} color="gray" />
                        </TouchableOpacity>
                    </View>
                )}
            
            <View style={styles.stepContainer}>
              <Text style={styles.stepDescription}>
                Una vez enviado espere la confirmación de verificación por parte del equipo de administración.
                {'\n'}Éxitos!
                </Text>
            </View>
            <View style={styles.buttonContainer}>
              <ButtonStandard title='Cerrar' onPress={onClose} />
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    popupContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center'
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 20
    },
    step: {
        fontWeight: 'bold',
        marginRight: 10
    },
    stepDescription: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: -10,
        marginBottom: 10,
        width: '50%',
        alignItems: 'center'
    },
    pressableButton: {
        borderRadius: 5,
        padding: 10,
      },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})