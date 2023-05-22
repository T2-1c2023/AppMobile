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
import { TextLinked, DividerWithMultipleTexts, TextProfileName, TextDetails } from '../src/styles/BaseComponents';
import InterestsList from '../src/components/InterestsList';


const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class UserMainScreen extends Component {
    constructor(props) {
        super(props);
        this.onPressCreatedTrainings = this.onPressCreatedTrainings.bind(this);
        this.onPressSubscribedTrainings = this.onPressSubscribedTrainings.bind(this);
        this.onPressCurrentGoals = this.onPressCurrentGoals.bind(this);
        this.onPressCompletedGoals = this.onPressCompletedGoals.bind(this);

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
                        this.setState({ profilePic: { uri: imageUrl } });
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    onPressCreatedTrainings() {
        console.log('Created trainings pressed');
    }
    
    onPressSubscribedTrainings() {
        console.log('Subscribed trainings pressed');
    }
    
    onPressCurrentGoals() {
        console.log('Current goals pressed');
    }
    
    onPressCompletedGoals() {
        console.log('Completed goals pressed');
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

    renderHeader() {
        return (
            <ProfileHeader
                profilePic={this.state.profilePic}
                name='Sebastian Capelli'
                isAthlete={false}
                isTrainer={true}
                certifiedTrainer={true}
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
        )
    }

    renderSectionTitle(title) {
        return (
            <DividerWithMultipleTexts
                texts={[title]}
                style={{
                    marginTop: 20,
                    marginHorizontal: 20,
                }}
            />
        )
    }

    renderTitleAndText(title, text) {
        return (
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: 'grey', fontWeight: 'bold' }}>
                    {title}
                </Text>
                <Text style={{ color: 'black' }}>
                    {text}
                </Text>
            </View>
        )
    }

    renderPersonalData() {
        return (
            <React.Fragment>
                {this.renderSectionTitle('Datos personales')}
                
                {this.renderTitleAndText('Ubicación', 'To be implemented')}
                {this.renderTitleAndText('Teléfono', 'To be implemented')}
            </React.Fragment>
        )
    }

    renderContactInfo() {
        return (
            <React.Fragment>
                {this.renderSectionTitle('Contacto')}
                
                {this.renderTitleAndText('Correo electrónico', 'to@be.implemented')}
            </React.Fragment>
        )
    }

    renderInterests() {

        const interesesHarcodeados = [
            {
              "id": 1,
              "description": "Fuerza"
            },
            {
              "id": 2,
              "description": "Resistencia"
            },
            {
              "id": 3,
              "description": "Flexibilidad"
            },
            {
              "id": 4,
              "description": "Velocidad"
            },
          ]

        return (
            <React.Fragment>
                {this.renderSectionTitle('Intereses')}

                <InterestsList
                    interests={interesesHarcodeados}
                    style={{
                        marginTop: 10,
                    }}
                />
            </React.Fragment>
        )
    }


    renderLinkedTexts(texts) {
        return (
            <View style={profileStyles.bottomButtons}>
                <TextLinked
                    linkedText={texts[0].title}
                    onPress={texts[0].handler}
                    multiline
                    style={{width: 100, textAlign: 'center'}}
                />
                <TextLinked
                    linkedText={texts[1].title}
                    onPress={texts[1].handler}
                    multiline
                    style={{width: 100, textAlign: 'center'}}
                />
            </View>
        )
    }

    renderTrainingsInfo() {
        return (
            <React.Fragment>
                {this.renderSectionTitle('Entrenamiento')}

                {this.renderLinkedTexts([
                    {title: 'Ver entrenamientos creados', handler: this.props.onPressCreatedTrainings},
                    {title: 'Ver entrenamientos suscriptos', handler: this.props.onPressSubscribedTrainings}
                ])}
            </React.Fragment>
        )
    }

    renderGoalsInfo() {
        return (
            <React.Fragment>
                {this.renderSectionTitle('Metas')}
                
                {this.renderLinkedTexts([
                    {title: 'Ver metas actuales', handler: this.props.onPressCurrentGoals},
                    {title: 'Ver metas cumplidas', handler: this.props.onPressCompletedGoals}
                ])}
            </React.Fragment>
        )
    }

    render() {
        const { fullname, mail } = this.props.data || {};
        return (
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

                    {this.renderHeader()}

                    {this.renderPersonalData()}

                    {this.renderContactInfo()}

                    {this.renderInterests()}

                    {this.renderTrainingsInfo()}

                    {this.renderGoalsInfo()}

                </View>
            </ScrollView>
        );
    }
}

// TODO: revisar que esto sirva de algo o si hay que moverlo a styles
const profileStyles = StyleSheet.create({
    bottomButtons: { 
        width:'100%', 
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10,
    }
});

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
        borderRadius: 140 / 2
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 140 / 2,
        padding: 5
    }
});