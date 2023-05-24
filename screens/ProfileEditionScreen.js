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
import { TextLinked, DividerWithMultipleTexts, TextProfileName, TextDetails, ButtonStandard } from '../src/styles/BaseComponents';
import InterestsList from '../src/components/InterestsList';

import { TextInput, HelperText } from 'react-native-paper';


const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class ProfileEditionScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profilePic: require('../assets/images/user_predet_image.png'),
            fullname: '',
        }
    }

    renderHeader() {
        return (
            <View style={editionStyles.headerContainer}>
                <View style={editionStyles.profilePicContainer}>
                    <TouchableOpacity onPress={(this.handleProfilePicturePress)}>
                        <Image
                            source={this.state.profilePic}
                            style={editionStyles.profilePic}
                        />
                        <View style={editionStyles.editIcon}>
                            <Ionicons name="pencil" size={24} color="white" />
                        </View>
                    </TouchableOpacity>  
                </View>

                <View style={editionStyles.paddingContainer} />
            </View>
        )
    }

    renderInputField() {
        return (
            <React.Fragment>
                <TextInput
                    label="Nombre y apellido"
                    // theme={true?
                    //     { colors: { primary: '#21005D', placeholder: 'black', underlineColor: 'black', text: 'black',}}
                    //     : 
                    //     { colors: { primary: 'red'}}}
                    onChangeText={fullname => this.setState({ fullname })}
                    theme={{ colors: { onSurfaceVariant: 'grey'} }}
                    underlineColor={'black'}
                    textColor={'black'}
                    activeOutlineColor={'black'}
                    outlineColor={'black'}
                    activeUnderlineColor={'black'}
                    selectionColor={'black'}

                    mode='flat'
                    style={editionStyles.inputText}
                />
                <HelperText 
                    type="error" 
                    visible={true}
                    style={editionStyles.helperText}
                >
                    La nueva contraseña no coincide
                </HelperText>
            </React.Fragment>
        )
    }

    render() {
        return (
            <ScrollView
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
                <View style={styles.container}>
                    {this.renderHeader()}
                    {this.renderInputField()}
                </View>
            </ScrollView>
        );
    }
}

const editionStyles = StyleSheet.create({
    headerContainer: {
        width: '100%', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        marginTop: 10,
    },

    profilePicContainer: {
        width: 140,
        marginLeft: 20,
    },

    paddingContainer: {
        flexGrow: 1,
    },

    profilePic: {
        width: 120, 
        height: 120,
        borderRadius: 140/2,
        alignSelf: 'center',
    },

    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 140 / 2,
        padding: 5
    },

    inputText: {
        backgroundColor: "transparent",
        width: '95%',
        marginTop: 20,
    },

    helperText: {
        alignSelf: 'flex-start',
        marginLeft: 15,
        color: 'red',
    }
});



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