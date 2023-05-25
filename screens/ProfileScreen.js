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


const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.onPressCreatedTrainings = this.onPressCreatedTrainings.bind(this);
        this.onPressSubscribedTrainings = this.onPressSubscribedTrainings.bind(this);
        this.onPressCurrentGoals = this.onPressCurrentGoals.bind(this);
        this.onPressCompletedGoals = this.onPressCompletedGoals.bind(this);
        this.onPressFollowers = this.onPressFollowers.bind(this);
        this.onPressFollowing = this.onPressFollowing.bind(this);
        this.onPressFollow = this.onPressFollow.bind(this);
        this.onPressUnfollow = this.onPressUnfollow.bind(this);
        this.onPressSendMessage = this.onPressSendMessage.bind(this);
        
        const data = props.data;

        this.emptyBodyWithToken = { headers: {
            Authorization: tokenManager.getAccessToken()
        }}

        // owner defines if the profile is the user's or another user's
        this.owner = props.owner

        // variables estaticas (se pueden sacar del token o data)
        this.id = data.id
        this.is_trainer = data.is_trainer
        this.is_athlete = data.is_athlete
        this.mail = data.mail
        
        // variables dinamicas (no pueden sacarse del token)
        this.state = {
            interests: [],
            profilePic: require('../assets/images/user_predet_image.png'),
            fullname: '',
            phone_number: '',
            
            // TODO: Cuando esten las requests deben inicializarse en loadUserInfo()
            certifiedTrainer: true,
            location: 'to be implemented',

            // only applied when this.owner == false
            // TODO: quitar hardcodeo
            following: false,
        }
    }

    async loadInterests() {
        const url = API_GATEWAY_URL + 'users/' + this.id + '/interests'
        const response = await axios.get(url, this.emptyBodyWithToken)
        const interests = response.data
        this.setState({ interests })
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
        this.setState({ fullname, phone_number })
    }

    async componentDidMount() {
        try {
            this.loadInterests()
            this.loadUserInfo()
        } catch (error) {
            console.log(error)
        }
    }

    onPressCreatedTrainings() {
        this.props.navigation.navigate('TrainingsListScreen', {data: jwt_decode(tokenManager.getAccessToken()), type:'created'})
    }
    
    onPressSubscribedTrainings() {
        this.props.navigation.navigate('TrainingsListScreen', {data: jwt_decode(tokenManager.getAccessToken()), type:'enrolled'})
    }
    
    onPressCurrentGoals() {
        this.props.navigation.navigate('GoalsListScreen', {data: jwt_decode(tokenManager.getAccessToken())})
    }
    
    onPressCompletedGoals() {
        console.log('Completed goals pressed');
    }

    onPressFollowers() {
        console.log('Followers pressed');
    }

    onPressFollowing() {
        console.log('Following pressed');
    }

    onPressFollow() {
        console.log('Follow pressed');
    }

    onPressUnfollow() {
        console.log('Unfollow pressed');
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
        } else {
            return (
                <ButtonStandard
                    title='Enviar mensaje'
                    onPress={this.onPressSendMessage}
                />
            )
        }
    }

    renderHeader() {
        return (
            <ProfileHeader
                profilePic={this.state.profilePic}
                name={this.state.fullname}
                isAthlete={this.is_athlete}
                isTrainer={this.is_trainer}
                certifiedTrainer={this.state.certifiedTrainer}
                bottomLeft={this.getHeaderLeftButton()}
                bottomRight={this.getHeaderRightButton()}
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
                
                {this.renderTitleAndText('Ubicación', this.state.location)}
                {this.renderTitleAndText('Teléfono', this.state.phone_number)}
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
                {this.renderSectionTitle('Entrenamiento')}

                {this.renderLinkedTexts(linkedTexts)}
            </React.Fragment>
        )
    }

    renderGoalsInfo() {
        return (
            <React.Fragment>
                {this.renderSectionTitle('Metas')}
                
                {this.renderLinkedTexts([
                    {title: 'Ver metas actuales', handler: this.onPressCurrentGoals},
                    {title: 'Ver metas cumplidas', handler: this.onPressCompletedGoals}
                ])}
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
                    {this.owner && this.renderPersonalData()}
                    {this.renderContactInfo()}
                    {this.renderInterests()}
                    {this.renderTrainingsInfo()}
                    {this.renderGoalsInfo()}
                </View>
            </ScrollView>
        );
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
