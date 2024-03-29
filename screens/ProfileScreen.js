import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../src/styles/styles';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import TrainerVerification from '../src/components/TrainerVerification';
// Image upload
import { downloadImage } from '../services/Media';
import Constants from 'expo-constants'
import axios from 'axios';
import { tokenManager } from '../src/TokenManager';
import { titleManager } from '../src/TitleManager';
// for componentDidMount() (TODO: it shouldn't be needed?)
import jwt_decode from 'jwt-decode';

import ProfileHeader from '../src/components/ProfileHeader';
import { TextLinked, DividerWithMultipleTexts, TextProfileName, TextDetails, ButtonStandard } from '../src/styles/BaseComponents';
import InterestsList from '../src/components/InterestsList';

import { UserContext } from '../src/contexts/UserContext';
import { UsersListMode } from './UsersListScreen';

import { getLocation } from '../services/Geocoding';

import { responseErrorHandler } from '../src/utils/responseErrorHandler';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class ProfileScreen extends Component {
    static contextType = UserContext;
    
    constructor(props) {
        super(props);
        this.onPressCreatedTrainings = this.onPressCreatedTrainings.bind(this);
        this.onPressSubscribedTrainings = this.onPressSubscribedTrainings.bind(this);
        this.onPressFollowers = this.onPressFollowers.bind(this);
        this.onPressFollowing = this.onPressFollowing.bind(this);
        this.onPressFollow = this.onPressFollow.bind(this);
        this.onPressUnfollow = this.onPressUnfollow.bind(this);
        this.onPressSendMessage = this.onPressSendMessage.bind(this);
        this.onPressFavoriteTrainings = this.onPressFavoriteTrainings.bind(this);
        
        const data = this.props.route !== undefined ? this.props.route.params.data : this.props.data

        this.emptyBodyWithToken = { headers: {
            Authorization: tokenManager.getAccessToken()
        }}

        // owner defines if the profile is the user's or another user's
        this.owner = this.props.route !== undefined ? this.props.route.params.owner : this.props.owner

        // variables estaticas (se pueden sacar del token o data)
        this.id = data.id
        this.is_trainer = data.is_trainer
        this.is_athlete = data.is_athlete
        this.mail = data.mail
        
        // variables dinamicas (no pueden sacarse del token)
        this.state = {
            loading: true,
            interests: [],
            profilePic: require('../assets/images/user_predet_image.png'),
            fullname: '',
            phone_number: '',
            location: '',
            weight: '',

            // TODO: Cuando esten las requests deben inicializarse en loadUserInfo()
            certifiedTrainer: false,

            // only applied when this.owner == false
            // TODO: quitar hardcodeo
            following: false,

            verificationPopUp: false
        }
        this.focusListener = this.props.navigation.addListener('focus', () => {
            // this.loadInterests();
            // this.loadUserInfo();
            // this.loadFollowingInfo();
            this.componentDidMount()
        });
    }

    async loadInterests() {
        const url = API_GATEWAY_URL + 'users/' + this.id + '/interests'
        try {
            const response = await axios.get(url, this.emptyBodyWithToken)
            const interests = response.data
            this.setState({ interests })
        }
        catch (error) {
            console.log(error.response)
        }
    }

    async loadUserInfo() {
        const url = API_GATEWAY_URL + 'users/' + this.id
        const response = await axios.get(url, this.emptyBodyWithToken)

        const photo_id = response.data.photo_id
        if (photo_id) {
            const imageUrl = await downloadImage(photo_id);
            this.setState({ profilePic: { uri: imageUrl } });
        }

        const fullname = response.data.fullname
        const phone_number = response.data.phone_number
        const certifiedTrainer = response.data.is_recognized_trainer
        const weight = response.data.weight
        this.setState({ fullname, phone_number, weight, certifiedTrainer })

        const { latitude, longitude } = response.data;
        const formattedLocation = await getLocation(latitude, longitude);
        this.setState( { location: formattedLocation });

        if (this.props.route !== undefined) {titleManager.setTitle(this.props.navigation, response.data.fullname, 22)}
    }

    loadFollowingInfo() {      
        const token =  tokenManager.getAccessToken()
        const decodedToken = jwt_decode(token)
        const id = decodedToken.id
        if (id !== this.id) {
            const url = API_GATEWAY_URL + 'users/' + id + '/followed';
            axios.get(url, this.emptyBodyWithToken)
                .then(response => {
                    const following = (response.data.filter(f => f.id === this.id).length > 0);
                    this.setState({ following });
                })
                .catch(function (error) {
                    responseErrorHandler(error.response, this.props.navigation)
                });
        }
        
    }

    async componentDidMount() {
        try {
            await this.loadInterests()
            await this.loadUserInfo()
            this.loadFollowingInfo()
            this.setState({ loading: false });
        } catch (error) {
            responseErrorHandler(error.response, this.props.navigation)
        }
    }

    onPressCreatedTrainings() {
        const params = {
            data: jwt_decode(tokenManager.getAccessToken()),
            type:'created',
            trainerId:this.id
        }
        this.props.navigation.navigate('TrainingsListScreen', params)

    }
    
    onPressSubscribedTrainings() {
        this.props.navigation.navigate('TrainingsListScreen', {data: jwt_decode(tokenManager.getAccessToken()), type:'enrolled', athleteId:this.id})
    }

    onPressFavoriteTrainings() {
        this.props.navigation.navigate('TrainingsListScreen', {data: jwt_decode(tokenManager.getAccessToken()), type:'favorites', athleteId:this.id})
    }

    onPressFollowers() {
        console.log('Followers pressed');
        const params = {
            mode: UsersListMode.Followers,
        }
        this.props.navigation.navigate('UsersListScreen', params)
    }

    onPressFollowing() {
        console.log('Following pressed')
        const params = {
            mode: UsersListMode.Followed,
        }
        this.props.navigation.navigate('UsersListScreen', params)
    }

    onPressFollow() {
        const url = API_GATEWAY_URL + 'users/' + jwt_decode(tokenManager.getAccessToken()).id + '/followed';
        const body = {followed_id: this.id}
        axios.post(url, body, this.emptyBodyWithToken)
            .then(response => {
                this.setState({ following: true });
            })
            .catch(function (error) {
                console.log('onPressFollowing ' + error);
                responseErrorHandler(error.response, this.props.navigation)
            });
    }

    onPressUnfollow() {
        const token = tokenManager.getAccessToken()
        const url = API_GATEWAY_URL + 'users/' + jwt_decode(token).id + '/followed';
        const body = {followed_id: this.id}
        axios.delete(url, {
            data: body,
            headers: {
                Authorization: token
            },
        })
            .then(response => {
                this.setState({ following: false });
            })
            .catch(function (error) {
                console.log('onPressUnfollow ' + error);
                responseErrorHandler(error.response, this.props.navigation)
            });
    }

    onPressSendMessage() {
        console.log('Send message pressed');
    }

    getFollowingButton() {
        if (this.state.following) {
            return (
                <ButtonStandard
                    title='Siguiendo'
                    onPress={this.onPressUnfollow}
                    greyMode
                />
            )
        } else {
            return (
                <ButtonStandard
                    title='Seguir'
                    onPress={this.onPressFollow}
                />
            )
        }
    }

    getHeaderLeftButton() {
        if (this.owner) {
            return (
                <TextLinked
                    linkedText='Seguidores'
                    onPress={this.onPressFollowers}
                />
            )
        } else {
            return this.getFollowingButton()
        }
    }

    getHeaderRightButton() {
        if (this.owner) {
            return (
                <TextLinked
                    linkedText='Seguidos'
                    onPress={this.onPressFollowing}
                />
            )
        } /*else {
            return (
                <ButtonStandard
                    title='Enviar mensaje'
                    onPress={this.onPressSendMessage}
                />
            )
        }*/
    }

    // Callback function to show pop up when trainer logo in ProfileHeader is pressed
    showVerificationPopUp = () => {
        this.setState({ verificationPopUp: true });
    }

    renderHeader() {
        return (
            <ProfileHeader
                profilePic={this.state.profilePic}
                name={this.state.fullname}
                isAthlete={this.is_athlete}
                isTrainer={this.is_trainer}
                certifiedTrainer={this.state.certifiedTrainer}
                owner={this.owner}
                bottomLeft={this.getHeaderLeftButton()}
                bottomRight={this.getHeaderRightButton()}
                style={{
                    marginTop: 15
                }}
                onPressTrainerLogo={this.showVerificationPopUp}
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
            <View style={{ alignItems: 'center', marginTop: 10, width: 250 }}>
                <Text style={{  textAlign: 'center', color: 'grey', fontWeight: 'bold' }}>
                    {title}
                </Text>
                <Text style={{ textAlign: 'center', color: 'black' }}>
                    {text}
                </Text>
            </View>
        )
    }

    renderPersonalData() {
        const { location, phone_number, weight } = this.state;
        return (
            <React.Fragment>
                {this.renderSectionTitle('Datos personales')}
                
                {this.renderTitleAndText('Ubicación', location)}
                {this.renderTitleAndText('Teléfono', phone_number)}
                {this.renderTitleAndText('Peso', weight)}
            </React.Fragment>
        )
    }

    renderContactInfo() {
        return (
            <React.Fragment>
                {this.renderSectionTitle('Contacto')}
                
                {this.renderTitleAndText('Correo electrónico', this.mail)}
            </React.Fragment>
        )
    }

    renderInterests() {
        return (
            <React.Fragment>
                {this.renderSectionTitle('Intereses')}

                <InterestsList
                    interests={this.state.interests}
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
                {texts.map((text, index) => 
                    <TextLinked
                        key={index}
                        linkedText={text.title}
                        onPress={text.handler}
                        multiline
                        style={{width: 100, textAlign: 'center'}}
                    />
                )}
            </View>
        )
    }

    renderTrainingsInfo() {
        
        linkedTexts = []

        if (this.is_trainer) {
            linkedTexts.push({
                title: 'Ver entrenamientos creados', 
                handler: this.onPressCreatedTrainings
            })
        }
        if (this.is_athlete) {
            linkedTexts.push({
                title: 'Ver entrenamientos suscriptos', 
                handler: this.onPressSubscribedTrainings
            })
        }
        
        return (
            <React.Fragment>
                {this.renderSectionTitle('Entrenamientos')}

                {this.renderLinkedTexts(linkedTexts)}
            </React.Fragment>
        )
    }

    // Callback function to close pop up
    closeVerificationPopUp = () => {
        this.setState({ verificationPopUp: false });
    }

    renderVerificationPopUp = () => {
        const { verificationPopUp } = this.state;
    

        return (
          <Modal
            isVisible={verificationPopUp}
            animationIn="slideInDown"
            animationOut="slideOutUp"
            animationInTiming={100}
          >
            <TrainerVerification 
              data={this.props.data}
              certifiedTrainer={this.state.certifiedTrainer}
              onClose={this.closeVerificationPopUp} 
            />
          </Modal>
        )
    }

    render() {
        const { loading } = this.state;

        if (loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#21005D" />
                    <Text style={{ marginTop: 30 }}>Cargando...</Text>
                </View>                
            )
        } else {
            return (
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    style={styles.scrollView}
                >
                    <View style={styles.container}>
                        {this.renderHeader()}
                        {this.owner && this.renderPersonalData()}
                        {this.renderContactInfo()}
                        {this.renderInterests()}
                        {this.renderTrainingsInfo()}

                        {this.renderVerificationPopUp()}
                    </View>
                </ScrollView>
            );
        }
    }
}

const profileStyles = StyleSheet.create({
    bottomButtons: { 
        width:'100%', 
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10,
    }
});
