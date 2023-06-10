import React, { Component } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Pressable } from 'react-native';
import { DividerWithLeftText, TextBox, TextLinked } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard, ButtonWithLeftIcon } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import TrainingsList from '../src/components/TrainingsList';
import Modal from "react-native-modal";
import { SelectList } from 'react-native-dropdown-select-list'
import { TextDetails, TextSubheader, DividerWithMiddleText } from '../src/styles/BaseComponents';
import Constants from 'expo-constants'
import { titleManager } from '../src/TitleManager';

import { IconButton } from 'react-native-paper'

import TrainingData from '../src/components/TrainingData'
import axios from 'axios';
import { downloadImage } from '../services/Media';
import { tokenManager } from '../src/TokenManager';

import { UserContext } from '../src/contexts/UserContext';

import { ListMode } from './GoalsListScreen';

const MAX_ACTIVITIES = 20;

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

// const ListMode = {
//     trainingGoals_Selectable: 'selectable',
//     trainingGoals_ReadOnly: 'readOnly',
//     personalGoals: 'athlete'
// }

export default class TrainingScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.handleDataEditPress = this.handleDataEditPress.bind(this)
        this.handleActivityEditPress = this.handleActivityEditPress.bind(this)
        this.handleFavoriteButtonPress = this.handleFavoriteButtonPress.bind(this)
        this.handleDeletePress = this.handleDeletePress.bind(this)
        this.handleBackToTrainings = this.handleBackToTrainings.bind(this)
        this.handleSubscribeButtonPress = this.handleSubscribeButtonPress.bind(this)
        this.onPressTrainingGoals = this.onPressTrainingGoals.bind(this)

        this.state = {
            isInFavorites: false,
            isSubscribed: false,
            training: {
                title: '',
                description: '',
                location: '',
                activities: [],
            },
            trainer: {},
            trainerProfilePic: require('../assets/images/user_predet_image.png'),
            myScore: 2,
            isAlreadyRated: false
        }
        this.emptyBodyWithToken = {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        }
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.componentDidMount();
        });

        console.log("[TrainingScreen] this.props.navigation ", this.props.navigation)
    }

    handleFavoriteButtonPress() {
        const newIsInFavorites = !this.state.isInFavorites
        this.changeFavoriteStatus(newIsInFavorites).then(() => {
            this.checkFavoriteStatus();
        })
            .catch(function (error) {
                console.log('handleFavoriteButtonPress' + error);
            });

    }

    async changeFavoriteStatus(newValue) {
        const url = API_GATEWAY_URL + 'athletes/' + this.props.route.params.userData.id + '/favorites'
        const body = { training_id: this.props.route.params.trainingId }
        let response;
        try {
            if (newValue === true) {
                response = await axios.post(url, body, this.emptyBodyWithToken)
            } else {
                response = await axios.delete(url, {
                    data: body,
                    headers: {
                        Authorization: tokenManager.getAccessToken()
                    },
                })
            }
        } catch (error) {
            console.error("changeFavoriteStatus " + error)
        }

        return
    }

    async isInFavorites() {
        let isInFavorites = false;
        const url = API_GATEWAY_URL + 'athletes/' + this.props.route.params.userData.id + '/favorites'
        await axios.get(url, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
            .then(response => {
                //console.log("isInFavorites response " + JSON.stringify(response.data));
                const favorites = response.data;
                isInFavorites = false
                if (favorites.some(f => f.id === this.props.route.params.trainingId)) {
                    isInFavorites = true
                }
                this.setState({ isInFavorites })
                return isInFavorites;
            })
            .catch(function (error) {
                console.log('isInFavorites ' + error);
            });
        return isInFavorites
    }

    checkFavoriteStatus() {

        this.isInFavorites().then(isInFavorites => {
            this.setState({ isInFavorites })
            this.props.navigation.setOptions({
                headerRight: () => (
                    <IconButton
                        icon={isInFavorites ? 'heart' : 'heart-outline'}
                        iconColor='#21005D'
                        size={30}
                        onPress={this.handleFavoriteButtonPress}
                    />
                ),
            })
        }
        ).catch(function (error) {
            console.log('checkFavoriteStatus ' + error);
        });
    }

    async handleSubscribeButtonPress() {
        if (!this.state.isSubscribed) {
            this.subscribe();
        } else {
            this.unsubscribe();
        }
    }

    async subscribe() {
        const body = { training_id: this.props.route.params.trainingId }
        //console.log(this.props.route.params.trainingId);
        axios.post(API_GATEWAY_URL + 'athletes/' + this.props.route.params.userData.id + '/subscriptions', body, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
            .then(response => {
                //console.log("subscribe response " + response);
                const isSubscribed = true;
                this.setState({ isSubscribed });
            })
            .catch(function (error) {
                console.log('subscribe ' + error);
            });
    }

    async unsubscribe() {
        const body = { training_id: this.props.route.params.trainingId }
        const url = API_GATEWAY_URL + 'athletes/' + this.props.route.params.userData.id + '/subscriptions'
        axios.delete(url, {
            data: body,
            headers: {
                Authorization: tokenManager.getAccessToken()
            },
        })
            .then(response => {
                const isSubscribed = false;
                this.setState({ isSubscribed });
            })
            .catch(function (error) {
                console.log('unsubscribe ' + error);
                if (error.response) {
                    console.log(error.response.data); // => the response payload 
                }
            });
    }

    async checkSubscriptionStatus() {
        if (!this.props.route.params.userData.is_athlete) {
            // console.log("no es atleta");
            const isSubscribed = false;
            this.setState({ isSubscribed });
            //console.log("seteo");
        } else {
            //axios.get(API_GATEWAY_URL + 'athletes/' + this.props.route.params.userData.id + '/subscriptions', {
            axios.get('https://trainings-g6-1c-2023.onrender.com/athletes/' + this.props.route.params.userData.id + '/subscriptions', {
                headers: {
                    Authorization: tokenManager.getAccessToken()
                }
            })
                .then(response => {
                    const subscribedTrainings = response.data;
                    //console.log(subscribedTrainings);//debug
                    const isSubscribed = (subscribedTrainings.filter(t => t.id === this.props.route.params.trainingId).length > 0);
                    //console.log("isSubscribed " + isSubscribed);
                    this.setState({ isSubscribed });
                })
                .catch(function (error) {
                    console.log('isSubscribed' + error);
                });
        }
    }

    async componentDidMount() {
        await this.loadTrainingInfo();
        this.checkFavoriteStatus();
        this.checkSubscriptionStatus();
    }

    async loadAthleteRatingInfo() {
        console.log("[loadAthleteRatingInfo] called")
        // GET trainings/id/ratings
        const url = API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId + '/ratings';
        
        const params = { athlete_id: this.context.userId }
        const config = {
            headers: {
                Authorization: tokenManager.getAccessToken()
            },
            params: params
        }
        
        console.log(params);
        
        try { 
            let response = await axios.get(url, config)

            const data = response.data;
            console.log("reviewstrainingscreen  " + JSON.stringify(data) + " length " + data.length)
            if (data.length > 0) {
                console.log("alreadyRated ok")
                this.myScore = data[0].score
                this.setState({ myScore: data[0].score, isAlreadyRated: true })
                this.isAlreadyRated = true;
            } else {
                this.isAlreadyRated = false;
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error("ERROR")
                this.setState({ isAlreadyRated: false })
            } 
            console.error("alreadyRatedd" + error);
        }
    }

    async loadTrainingInfo() {
        console.log("[loadTrainingInfo] called")

        const config = { headers: { Authorization: tokenManager.getAccessToken() } }
        const urlGetTraining = API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId

        try {
            let response = await axios.get(urlGetTraining, config)
            const training = response.data;
            console.log(training);//debug
            console.log(this.props.route.params.userData);
            this.setState({ training });
            this.loadTrainerInfo(training.trainer_id);
            titleManager.setTitle(this.props.navigation, this.state.training.title, 22)
        } catch (error) {
            console.log('loadTrainingInfo ' + error);
        }

        if (this.context.isAthlete)
            this.loadAthleteRatingInfo();
        
    }

    loadTrainerInfo(trainer_id) {
        axios.get(API_GATEWAY_URL + 'users/' + trainer_id, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
            .then(response => {
                const trainer = response.data;
                this.setState({ trainer });
                // Update profile picture if needed
                this.getUriById(trainer.photo_id);
                return response.data
            })
            .catch(function (error) {
                console.log('TRAINER ' + error);
            });
    }

    handleActivityEditPress() {
        this.props.navigation.navigate('TrainingActivitiesScreen', { trainingData: this.state.training, data: { id: this.state.trainer.id }, from: 'TrainingScreen' });
    }

    handleDataEditPress() {
        this.props.navigation.navigate('NewTrainingScreen', { trainerData: tokenManager.getAccessToken(), isNew: false, trainingId: this.props.route.params.trainingId })
    }

    handleDeletePress() {
        axios.delete(API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
            .then(response => {
                alert('Entrenamiento eliminado');
                this.props.navigation.replace('TrainingsListScreen', { token: tokenManager.getAccessToken(), type: 'created', trainerId:this.state.trainer.id });//al pasársela así cree que es la segunda pantalla, no desde drawer?
            })
            .catch(function (error) {
                console.log('handleDeletePress ' + error);
            });
    }

    handleBackToTrainings() {
        this.props.navigation.navigate('TrainingsListScreen', { token: tokenManager.getAccessToken(), type: 'created', trainerId:this.state.trainer.id })
    }

    async getUriById(image_id) {
        if (image_id != undefined && image_id != '') {
            const imageUri = await downloadImage(image_id);
            if (imageUri != null)
                this.setState({ trainerProfilePic: { uri: imageUri } });
        }
    }

    onPressTrainingGoals() {
        const listMode = this.isOwner()?
            ListMode.CreatorTrainingGoals 
            :
            ListMode.AthleteSingleTrainingGoalsLeft
        
        console.log("[onPressTrainingGoals] ListMode: ", listMode)

        this.props.navigation.navigate('GoalsListScreen', {
            trainingId: this.props.route.params.trainingId,
            listMode: listMode
        })
    }

    renderCreatorImage() {
        return (
            <React.Fragment>
                <Text style={trainigStyles.creatorTitle}>Creador</Text>
                <Pressable onPress={() => this.props.navigation.navigate('ProfileScreen', {data:this.data, navigation:this.props.navigation, owner:false, data:this.state.trainer})}>
                    <Image
                        source={this.state.trainerProfilePic}
                        style={trainigStyles.creatorImage}
                        resizeMode='contain'
                    />
                </Pressable>
                <Text style={trainigStyles.creatorName}>{this.state.trainer.fullname}</Text>
            </React.Fragment>
        )
    }

    shouldRenderGoalsButton() {
        return this.isOwner() || this.state.isSubscribed
    }

    isOwner() {
        console.log("[isOwner] userId: ", this.context.userId)
        console.log("[isOwner] trainerId: ", this.state.training.trainer_id)
        return this.state.training.trainer_id === this.context.userId
    }

    renderGoalsButton() {
        const buttonName = this.isOwner()?
            "Ver metas del entrenamiento" 
            : 
            "Ver metas restantes para completar el entrenamiento"
        
        return (
            <TextLinked
                linkedText={buttonName} 
                onPress={this.onPressTrainingGoals}
                style={{
                    marginRight: 20,
                }}
            />
        )
    }

    renderCreatorAndGoalsArea() {
        return (
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, alignItems: 'center' }}>
                <View style={{ flex: 0.4, alignItems: 'center' }}>
                    {this.renderCreatorImage()}
                </View>
                
                <View style={{ flex: 0.3 }} />
                
                <View style={{ flex: 0.3, alignItems: 'flex-end', justifyContent: 'center' }}>
                    {this.shouldRenderGoalsButton() && 
                        this.renderGoalsButton()
                    }
                </View>
            </View>
        )
    }

    canEdit() {
        return this.state.training.trainer_id === this.props.route.params.userData.id
    }

    canSubscribe() {
        return this.props.route.params.userData.is_athlete && (this.state.training.trainer_id !== this.props.route.params.userData.id)
    }

    canDelete() {
        return this.state.training.trainer_id === this.props.route.params.userData.id
    }

    canRate() {
        return this.context.isAthlete && !this.isOwner()
    }

    renderDivider() {
        return (
            <View style={{ marginTop: 20, width: '100%', height: 1, backgroundColor: 'grey' }} />
        )
    }



    render() {
        return (
            <ScrollView
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >

                <View style={styles.container}>

                    <DividerWithLeftText
                        text={this.state.training.title}
                        style={{
                            marginTop: 10,
                        }}
                        editButtonPress={this.canEdit() ? this.handleDataEditPress : null}
                    />

                    <TextDetails
                        body={this.state.training.description}
                        style={{
                            marginTop: 5,
                            width: '90%',
                        }}
                        alignLeft
                    />

                    <TrainingData
                        training={this.state.training}
                        userId={this.props.route.params.userData.id}
                        navigation={this.props.navigation}
                        myScore={this.myScore}
                        canRate={this.canRate()}
                        isAlreadyRated={this.state.isAlreadyRated}
                        onPressViewAllReviews={() => {console.log("onPressViewAllReviews pressed")}}
                        onPressRate={() => {console.log("onPressRate pressed")}}
                        style={{
                            marginTop: 20,
                        }}
                    />

                    <DividerWithLeftText
                        text="Lista de actividades"
                        maxCounter={MAX_ACTIVITIES}
                        counter={this.state.training.activities.length}
                        style={{
                            marginTop: 20,
                        }}
                        editButtonPress={this.canEdit() ? this.handleActivityEditPress : null}
                    />

                    <ActivityList
                        activities={this.state.training.activities}
                        onChange={this.refreshActivities}
                        style={{
                            marginTop: 10,
                        }}
                    />

                    {this.renderDivider()}

                    {this.renderCreatorAndGoalsArea()}

                    {this.renderDivider()}

                    {this.canSubscribe() &&
                        <ButtonStandard
                            onPress={this.handleSubscribeButtonPress}
                            title={this.state.isSubscribed ? "Cancelar suscripción" : "Suscribirse"}
                            style={{
                                marginTop: 20,
                            }}
                            icon={this.state.isSubscribed ? 'bookmark-off' : 'bookmark'}
                            warningTheme={this.state.isSubscribed}
                        />
                    }

                    {this.canDelete() &&
                        <ButtonStandard
                            onPress={this.handleDeletePress}
                            title={"Eliminar entrenamiento"}
                            style={{
                                marginTop: 20,
                                marginBottom: 20,
                            }}
                            icon={'delete'}
                            warningTheme
                        />
                    }

                </View>
            </ScrollView>
        );
    }
}

const trainigStyles = StyleSheet.create({
    creatorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'grey',
    },

    creatorImage: {
        height: 100,
        width: 100,
        borderRadius: 100,
    },

    creatorName: {
        fontSize: 16,
        fontWeight: 'bold',

    },

})