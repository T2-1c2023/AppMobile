import React, { Component } from 'react';
// Visuals
import { View, Text, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import { ButtonStandard } from '../styles/BaseComponents';
import Video from 'react-native-video';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
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
            loading: false,
            requestSent: false,
            pendingRequest: false,
            videoUri: null,
        };

        console.log(props.data);
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

    handleContinuePress = async () => {
        const { videoUri } = this.state;
        
        Alert.alert(
            'Confirmar',
            'Desea subir el video?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Continuar',
                    onPress: async () => {
                        this.setState({ loading: true });
                        await this.uploadVideoFirebaseRecognizedTrainer(videoUri)
                        this.setState({ loading: false });
                    }
                }
            ]
        );
    }

    // Tries to upload video to firebase. On success, sends request to backend
    uploadVideoFirebaseRecognizedTrainer = async (uri) => {
        try {
            const videoId = Date.now().toString();
            const storageRef = storage().ref().child(`videos/${videoId}`);
            await storageRef.putFile(uri);
            await this.requestRecognizedTrainer(videoId);
        } catch (error) {
            alert(error);
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
            this.setState({ requestSent: true });
        } catch (error) {
            if (error.response.status === 406) {
                this.setState({ requestSent: true, pendingRequest: true });
            } else {
                alert(error, error.message);
            }
        }
    }

    render() {
        const { onClose, certifiedTrainer } = this.props;
        const { fullname } = this.props.data;
        const { videoUri, loading, requestSent, pendingRequest } = this.state;

        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#21005D" />
                    <Text style={styles.loadingText}>Enviando Solicitud...</Text>
                </View>                
            )
        } else if (requestSent) {
            if (pendingRequest) {
                return (
                    <View style={styles.popupContainer}>
                        <Text style={styles.title}>Solicitud Pendiente</Text>
                        <Text style={styles.description}>Ya tiene una solicitud de verificación pendiente.</Text>
                        <Text style={styles.description}>Por favor, espere la confirmación de verificación por parte del equipo de administración.</Text>
                        <View style={[styles.buttonContainer, { marginTop: 10 }]}>
                            <ButtonStandard title="Cerrar" onPress={onClose} />
                        </View>
                    </View>
                )
            } else {
                return (
                    <View style={styles.popupContainer}>
                        <Text style={styles.title}>Solicitud Enviada</Text>
                        <Text style={styles.description}>Su solicitud de verificación ha sido enviada correctamente.</Text>
                        <Text style={styles.description}>Por favor, espere la confirmación de verificación por parte del equipo de administración.</Text>
                        <Text style={styles.description}>Éxitos!</Text>
                        <View style={[styles.buttonContainer, { marginTop: 10 }]}>
                            <ButtonStandard title="Cerrar" onPress={onClose} />
                        </View>
                    </View>
                )
            }
        } else if (certifiedTrainer) { 
            return (
                <View style={styles.popupContainer}>
                    <Text style={styles.title}>Ya se encuentra verificado!</Text>
                    <View style={[styles.buttonContainer, { marginTop: 10 }]}>
                        <ButtonStandard title="Cerrar" onPress={onClose} />
                    </View>
                </View>
            )
        } else {
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
                            onPress={this.handleContinuePress}
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
    loadingContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 30
    }
})