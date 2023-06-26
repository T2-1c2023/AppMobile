import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView, Button } from 'react-native';
import styles from '../src/styles/styles';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
// Image upload
import { selectImage, uploadImageFirebase, downloadImage } from '../services/Media';
import Constants from 'expo-constants'
import axios from 'axios';
import { tokenManager } from '../src/TokenManager';
import { titleManager } from '../src/TitleManager';
import jwt_decode from 'jwt-decode';
// User changes
import { updateUserData } from '../src/User';

import ProfileHeader from '../src/components/ProfileHeader';
import { TextLinked, DividerWithMultipleTexts, TextProfileName, TextDetails, ButtonStandard } from '../src/styles/BaseComponents';
import InterestsList from '../src/components/InterestsList';

import { CommonActions } from '@react-navigation/native';
import { TextInput, HelperText } from 'react-native-paper';

import { UserContext } from '../src/contexts/UserContext';

import * as Location from 'expo-location';
import { getLocation } from '../services/Geocoding';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class ProfileEditionScreen extends Component {
    static contextType = UserContext;
    
    constructor(props) {
        super(props);
        this.nameEmpty = this.nameEmpty.bind(this);
        this.invalidPhone = this.invalidPhone.bind(this);
        this.handleProfilePicturePress = this.handleProfilePicturePress.bind(this);
        this.loadUserInfo = this.loadUserInfo.bind(this);
        this.onPressChangeRole = this.onPressChangeRole.bind(this);
        this.onPressEditInterests = this.onPressEditInterests.bind(this);

        this.emptyBodyWithToken = { headers: {
            Authorization: tokenManager.getAccessToken()
        }}

        this.state = {
            loading: false,
            loadingMessage: 'Realizando cambio...',
            profilePic: require('../assets/images/user_predet_image.png'),
            fullname: props.route.params.data.fullname, 
            newFullName: props.route.params.data.fullname,
            phone: props.route.params.data.phone_number,
            newPhone: props.route.params.data.phone_number,
            locationDisplayName: ''
        }
        console.log(props.route.params.data);

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.loadUserInfo();
        });
    }

    async componentDidMount() {
        titleManager.setTitle(this.props.navigation, "Editar perfil", 22)
        try {
            this.loadUserInfo()
        } catch (error) {
            console.log(error)
        }
    }

    getLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permiso para acceder a la ubicación denegado');
            return;
        }

        Alert.alert(
            'Actualizar ubicación',
            'Desea modificar la ubicación con su ubicación actual?',
            [
                { text: 'Cancelar', style: 'cancel'},
                {
                  text: 'Continuar',
                  onPress: async () => {
                    this.setState({ loading: true });
                    const location = await Location.getCurrentPositionAsync({});
                
                    const { latitude, longitude } = location.coords;
                    const formattedLocation = await getLocation(latitude, longitude);
                    if (formattedLocation !== this.state.locationDisplayName) {
                        
                        try {
                            const userId = this.props.route.params.data.id;
                            const newData = {
                                latitude: latitude,
                                longitude: longitude
                            }
                            // TODO: averiguar por error 400 (bad request)
                            await updateUserData(newData, userId);
                            this.setState( { locationDisplayName: formattedLocation });
                        } catch (error) {
                            console.log(error);
                        }
                        this.setState({ loading: false });
                    } else {
                        this.setState({ loading: false });
                        Alert.alert('No se encontraron cambios', 'Su ubicación actual coincide con la ubicación obtenida');
                    }
                  }
                }
            ]
        )
    }

    async loadUserInfo() {
        this.setState({ loading: true, loadingMessage: 'Cargando datos...'});
        const url = API_GATEWAY_URL + 'users/' + this.props.route.params.data.id
        console.log(url)
        const response = await axios.get(url, this.emptyBodyWithToken)

        const photo_id = response.data.photo_id
        if (photo_id) {
            const imageUrl = await downloadImage(photo_id);
            this.setState({ profilePic: { uri: imageUrl } });
        }

        const fullname = response.data.fullname;
        const newFullName = response.data.fullname;
        const phone = response.data.phone_number;
        const newPhone = response.data.phone_number;
        this.setState({ fullname, newFullName, phone, newPhone });

        const { latitude, longitude } = response.data;
        const formattedLocation = await getLocation(latitude, longitude);
        this.setState( { locationDisplayName: formattedLocation });
        this.setState({ loading: false, loadingMessage: 'Realizando cambios...'});
    }

    renderProfilePic() {
        return (
            <View style={editionStyles.headerContainer}>
                <View style={editionStyles.profilePicContainer}>
                    <TouchableOpacity onPress={this.handleProfilePicturePress}>
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

    // Lets user choose a profile picture from library
    handleProfilePicturePress = async () => {
        Alert.alert(
            'Editar foto de perfil',
            'Desea modificar la foto de perfil?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Continuar', onPress: this.uploadProfilePicture }
            ]
        );
    }

    uploadProfilePicture = async () => {
        this.setState({ loading: true });
        const imageLocalUri = await selectImage();
        
        if (imageLocalUri != null) {
            this.setState({ profilePic: { uri: imageLocalUri } });

            const imageId = await uploadImageFirebase(imageLocalUri);

            try {
                // Update image id on back end
                const userId = this.props.route.params.data.id;
                const newData = {
                    photo_id: imageId
                };
                await updateUserData(newData, userId);
            } catch (error) {
                console.log(error);
                // TODO: borrar foto de firebase
            }
        }
        this.setState({ loading: false });
    }

    nameEmpty() {
        return this.state.fullname == '';
    }

    invalidPhone() {
        return this.state.phone == '';
    }

    handleNameFieldBlur = () => {
        const { fullname, newFullName } = this.state;
        if (newFullName.trim() !== fullname.trim()) {
            Alert.alert(
                'Desea modificar su nombre de usuario a "' + newFullName + '"?',
                '',
                [
                    { text: 'Cancel', style: 'cancel', 
                      onPress: () => {this.setState({ newFullName: fullname })}
                    },
                    { text: 'Continuar', onPress: this.handleChangeUsername }
                ],
                { cancelable: false }
            );
        } else console.log('No hubo cambios')
    };

    handleChangeUsername = async () => {
        this.setState({ loading: true });
        try {
            const { newFullName } = this.state;
            const userId = this.props.route.params.data.id;
            const newData = {
                fullname: newFullName
            }
            await updateUserData(newData, userId);
            this.setState({ fullname: newFullName });
            await this.context.setName(newFullName)
        } catch (error) {   
            console.log(error);
            this.setState({ newFullName: this.state.fullname });
        } finally {
            this.setState({ loading: false });
        }
    }

    handlePhoneNumberFieldBlur = () => {
        const { phone, newPhone } = this.state;
        if (newPhone.trim() !== phone.trim()) {
            Alert.alert(
                'Desea modificar su número de teléfono a "' + newPhone + '"?',
                '',
                [
                    { text: 'Cancel', style: 'cancel', 
                      onPress: () => {this.setState({ newPhone: phone })}
                    },
                    { text: 'Continuar', onPress: this.handleChangePhone }
                ],
                { cancelable: false }
            );
        } else console.log('No hubo cambios')
    };

    handleChangePhone = async () => {
        this.setState({ loading: true });
        try {
            const { newPhone } = this.state;
            const userId = this.props.route.params.data.id;
            const newData = {
                phone_number: newPhone
            }
            await updateUserData(newData, userId);
            this.setState({ phone: newPhone });
        } catch (error) {   
            console.log(error);
            this.setState({ newPhone: this.state.phone });
        } finally {
            this.setState({ loading: false });
        }
    }

    renderNameField() {
        return (
            <React.Fragment>
                <TextInput
                    label={'Nombre y apellido'}
                    onChangeText={(newFullName) => this.setState({ newFullName })}
                    onBlur={this.handleNameFieldBlur}
                    theme={this.nameEmpty()? editionStyles.themeErrorColors : editionStyles.themeColors}
                    value={this.state.newFullName}
                    mode='flat'
                    style={editionStyles.inputText}
                />
                {this.nameEmpty() &&
                    <HelperText 
                        type="error" 
                        visible
                        style={editionStyles.helperText}
                    >
                        El nombre no puede estar vacío
                    </HelperText>
                }
            </React.Fragment>
        )
    }

    renderPhoneField() {
        return (
            <React.Fragment>
                <TextInput
                    label={'Teléfono'}
                    keyboardType='numeric'
                    onChangeText={(newPhone) => this.setState({ newPhone })}
                    onBlur={this.handlePhoneNumberFieldBlur}
                    theme={this.invalidPhone()? editionStyles.themeErrorColors : editionStyles.themeColors}
                    value={this.state.newPhone}
                    mode='flat'
                    style={editionStyles.inputText}
                />
                {this.invalidPhone() &&
                    <HelperText 
                        type="error" 
                        visible
                        style={editionStyles.helperText}
                    >
                        El teléfono no puede estar vacío
                    </HelperText>
                }
            </React.Fragment>
        )
    }

    renderLocationField() {
        const { locationDisplayName } = this.state;
        return (
          <React.Fragment>
            <Text style={{ marginTop: 25, marginLeft: 25, alignSelf: 'flex-start' }}>Ubicación:</Text>
            <TouchableOpacity 
              onPress={this.getLocationPermission} 
              style={{marginLeft: 25, alignSelf: 'flex-start' }}
            >
              <Text>
                {(locationDisplayName !== '') ? locationDisplayName : 'Ubicación no disponible. Actualizar ubicación.'}
              </Text>
            </TouchableOpacity>
            <View style={editionStyles.divider} />
          </React.Fragment>
        )
    }

    onPressChangePassword = () => {
        this.props.navigation.navigate('ChangePasswordScreen', {data: this.props.route.params.data});
    }

    onPressEditInterests = () => {
        this.props.navigation.navigate('InterestsScreen', { userId: jwt_decode(this.emptyBodyWithToken.headers.Authorization).id, from:'edit' });
    }

    onPressEnrollFingerprint = () => {
        this.props.navigation.navigate('ValidatePasswordScreen', {data: this.props.route.params.data});
    }

    onPressChangeRole() {
        // this.props.navigation.replace('RoleSelectionScreen', {data: this.props.route.params.data});
        this.props.navigation.dispatch(
            // Reset del navigation stack para que no se muestre 
            // el botón de 'go back' a profile selection screen.
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'RoleSelectionScreen' }]
            })
        )
    }

    MixedUser() {
        return tokenManager.isMixedUser()
    }

    renderLinks() {
        return (
            <React.Fragment>
                <TextLinked
                    linkedText={'Editar intereses'}
                    onPress={this.onPressEditInterests}
                    style={{alignSelf: 'flex-start', marginLeft: 30, marginTop: 50}}
                />
                <TextLinked
                    linkedText={'Cambiar contraseña'}
                    onPress={this.onPressChangePassword}
                    style={{alignSelf: 'flex-start', marginLeft: 30, marginTop: 30}}
                />
                <TextLinked
                    linkedText={'Registrar huella'}
                    onPress={this.onPressEnrollFingerprint}
                    style={{alignSelf: 'flex-start', marginLeft: 30, marginTop: 30}}
                />
                {this.MixedUser() && 
                    <TextLinked
                        linkedText={'Cambiar rol'}
                        onPress={this.onPressChangeRole}
                        style={{alignSelf: 'flex-start', marginLeft: 30, marginTop: 30}}
                    />
                }
            </React.Fragment>
        )
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#21005D" />
                    <Text style={{marginTop: 30}}>{this.state.loadingMessage}</Text>
                </View>
            )
        } else {
            return (
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    style={styles.scrollView}
                >
                    <View style={styles.container}>
                        {this.renderProfilePic()}
                        {this.renderNameField()}

                        {this.renderLocationField()}
                        
                        {this.renderPhoneField()}

                        {this.renderLinks()}

                    </View>
                </ScrollView>
            )
        }
    }
}

const editionStyles = StyleSheet.create({
    headerContainer: {
        width: '100%', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    },

    themeColors: {
        colors: { 
            //placeholder unfocus (big and small)
            onSurfaceVariant: 'black',
            
            //underline unfocus
            onSurface: 'black',

            //underline and title focus
            primary: '#21005D',        
        }
    },

    themeErrorColors: {
        colors: { 
            onSurfaceVariant: 'black',
            onSurface: 'red', 
            primary: 'red', 
        }
    },

    divider: { 
        width: '95%', 
        height: 2, 
        backgroundColor: 'grey',
        marginTop: 10, 
        opacity: 0.5
    },
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
