import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../src/styles/styles';
import { Ionicons } from '@expo/vector-icons';
// Image upload
import { selectImage, uploadImageFirebase, downloadImage } from '../services/Media';
import Constants from 'expo-constants'
import axios from 'axios';
import { tokenManager } from '../src/TokenManager';
// for componentDidMount() (TODO: it shouldn't be needed?)
import jwt_decode from 'jwt-decode';

import ProfileHeader from '../src/components/ProfileHeader';
import { TextLinked, DividerWithMultipleTexts, TextProfileName, TextDetails} from '../src/styles/BaseComponents';



const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class UserMainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePic: require('../assets/images/user_predet_image.png'),
            name: '',
            isTrainer: false,
            isAthlete: false,
            certifiedTrainer: false,
        }
    }

    async componentDidMount() {
        // TODO: no encontre forma de leer los props en componentDidMount(). Revisar
        // Tampoco debería ser un problema, es solo para no decodificar el jwt de más
        const encoded_jwt = tokenManager.getAccessToken();
        const data = jwt_decode(encoded_jwt);

        const url = API_GATEWAY_URL + 'users/' + data.id;
        axios.get(url, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
            })
            .then(async (response) => {
                if (response.data.photo_id) {
                    const imageUrl = await downloadImage(response.data.photo_id);
                    if (imageUrl) {
                        this.setState({ profilePic: {uri: imageUrl}});
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    getRole() {
        const { is_trainer, is_athlete } = this.props.data;
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

    // TODO: (extra) modularizar para que sea más legible?
    uploadProfilePicture = async () => {
        const imageLocalUri = await selectImage();
        if (imageLocalUri != null) {
            this.setState({ profilePic: { uri: imageLocalUri } });

            const imageId = await uploadImageFirebase(imageLocalUri);
            
            // Update image id on back end
            const url = API_GATEWAY_URL + 'users/' + this.props.data.id; 
            const body = {
                photo_id: imageId
            }
            // TODO: Es mejor hacer un load con await?
            axios.patch(url, body, {
                headers: {
                    Authorization: tokenManager.getAccessToken()
                }
                })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }

    // Lets user choose a profile picture from library
    handleProfilePicturePress = async () => {
        
        Alert.alert(
            'Editar foto de perfil', 
            'Desea modificar la foto de perfil?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Continuar',
                    onPress: async () => {
                        this.uploadProfilePicture();
                    }
                }
            ]
        ); 
    }

    renderTitleAndText(title, text) {
        return(
            <View style={{alignItems: 'center', marginTop: 10}}>
                <Text style={{color: 'grey', fontWeight: 'bold'}}>
                    {title}
                </Text>
                <Text style={{color: 'black'}}>
                    {text}
                </Text>
            </View>
        )
    }

    render() {
        const { fullname, mail } = this.props.data || {};
        return(
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            <View style={styles.container}>
                    {/* {this.props.data && (
                        <>
                            <TouchableOpacity onPress={this.handleProfilePicturePress}>
                                <Image
                                    source={this.state.profilePic}
                                    style={{... styles_hs.userImage, marginTop: 40}}
                                />
                                <View style={styles_hs.editIcon}>
                                    <Ionicons name="pencil" size={24} color="white" />
                                </View>
                            </TouchableOpacity>
                            <Text style={{... styles_hs.text, marginTop: 40}}>Welcome {fullname}!</Text>
                            <Text style={styles_hs.text}>Email: {mail}</Text>
                            <Text style={{... styles_hs.text, marginBottom: 20}}>Role: {this.getRole()}</Text>
                        </>
                    )} */}

                    <ProfileHeader
                        profilePic={this.state.profilePic}
                        name= 'Sebastian Capelli se ba'
                        isAthlete= {true}
                        isTrainer= {true}
                        certifiedTrainer= {true}
                        bottomLeft={
                            <TextLinked
                                linkedText='Seguidores'
                                onPress={() => console.log('Goals')} 
                            />
                        }
                        bottomRight={
                            <TextLinked
                                linkedText='Seguidos'
                                onPress={() => console.log('Goals')} 
                            />
                        }
                        style={{ 
                            marginTop: 15
                        }}
                    />

                    {/* Sección de datos personales */}
                    <DividerWithMultipleTexts
                        texts={['Datos personales']}
                        style={{
                            marginTop: 20,
                            marginHorizontal: 20,
                        }}
                    />
                    {this.renderTitleAndText('Ubicación', 'To be implemented')}
                    {this.renderTitleAndText('Teléfono', 'To be implemented')}

                    {/* Sección de contacto */}
                    <DividerWithMultipleTexts
                        texts={['Contacto']}
                        style={{
                            marginTop: 20,
                            marginHorizontal: 20,
                        }}
                    />

                    {this.renderTitleAndText('Correo electrónico', 'to@be.implemented')}

                </View>
                </ScrollView>
        );
    }
}

// TODO: revisar que esto sirva de algo o si hay que moverlo a styles
const styles_hs = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        marginTop: 10,
    },
    userImage: {
        width: 140,
        height: 140,
        borderRadius: 140/2
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 140/2,
        padding: 5
    }
});