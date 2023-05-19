import React, { Component } from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';
import { DividerWithLeftText, TextBox, TextLinked} from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard, ButtonWithLeftIcon } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import TrainingsList from '../src/components/TrainingsList';
import Modal from "react-native-modal";
import { SelectList } from 'react-native-dropdown-select-list'
import { TextDetails, TextSubheader, DividerWithMiddleText}  from '../src/styles/BaseComponents';
import Constants from 'expo-constants'

import { IconButton } from 'react-native-paper'

import TrainingData from '../src/components/TrainingData'
import axios from 'axios';

const MAX_ACTIVITIES = 20;

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class TrainingScreen extends Component {
    constructor(props) {
        super(props)
        this.handleDataEditPress = this.handleDataEditPress.bind(this)
        this.handleActivityEditPress = this.handleActivityEditPress.bind(this)
        this.handleFavoriteButtonPress = this.handleFavoriteButtonPress.bind(this)
        this.handleDeletePress = this.handleDeletePress.bind(this)
        this.handleBackToTrainings = this.handleBackToTrainings.bind(this)
        this.handleSubscribeButtonPress = this.handleSubscribeButtonPress.bind(this)
        this.state = {
            isInFavorites: false,
            isSubscribed: false,
            training: {
                title: '',
                description: '',
                location: '',
                activities: [],
            },
            
        }
    }

    handleFavoriteButtonPress() {
        alert("Logica de añadir a favoritos - TBD")

        const isInFavorites = !this.state.isInFavorites
        this.changeFavoriteStatus(isInFavorites).then(() => {
            this.checkFavoriteStatus();
        })
        .catch(function (error) {
            console.log('handleFavoriteButtonPress' + error);
        });
    }

    async changeFavoriteStatus() {
        //TODO: enviarla al back la actualizacion del estado favorito de la actividad
        // await axios.post(...)
        return
    }

    async isInFavorites() {
        //TODO: preguntarle al back si la actividad está en favoritos
        // await axios.get(...)
        return false
    }

    checkFavoriteStatus() {
        this.isInFavorites().then((isInFavorites) => {
            this.setState({isInFavorites})
            this.props.navigation.setOptions({
                headerRight: () => (
                    <IconButton
                        icon={isInFavorites? 'heart' : 'heart-outline'}
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
        const body = {training_id: this.props.route.params.trainingId}
        console.log(this.props.route.params.trainingId);
        //console.log(API_GATEWAY_URL + 'athletes/' + this.props.route.params.userData.id + '/subscriptions');
        //axios.post(API_GATEWAY_URL + 'athletes/' + this.props.route.params.userData.id + '/subscriptions', body, {
        axios.post('https://trainings-g6-1c-2023.onrender.com/athletes/' + this.props.route.params.userData.id + '/subscriptions', body, {
            headers: {
                Authorization: this.props.route.params.token
            }
        })
        .then(response => {
            const isSubscribed = true;
            this.setState({ isSubscribed });
        })
        .catch(function (error) {
            console.log('subscribe ' + error);
        });
    }

    async unsubscribe() {
        //////////////////////////  TO_DO borrar
        console.log('-------------------');
        await axios.get('https://trainings-g6-1c-2023.onrender.com/athletes/' + this.props.route.params.userData.id + '/subscriptions', body, {
            headers: {
                Authorization: this.props.route.params.token
            }
        })
        .then(response => {
            /*const isSubscribed = false;
            this.setState({ isSubscribed });*/
            console.log("getter " + JSON.stringify(response.data));
            console.log('------------------');
        })
        .catch(function (error) {
            console.log('getter ' + error);
            if( error.response ){
                console.log(error.response.data); // => the response payload 
            }
        });
        /////////////////////////////////


        const body = {training_id: this.props.route.params.trainingId}
        console.log(JSON.stringify(body));
        //axios.delete(API_GATEWAY_URL + 'athletes/' + this.props.route.params.userData.id + '/subscriptions', body, {
        console.log('https://trainings-g6-1c-2023.onrender.com/athletes/' + this.props.route.params.userData.id + '/subscriptions');
        console.log(this.props.route.params.token)
        await axios.delete('https://trainings-g6-1c-2023.onrender.com/athletes/' + this.props.route.params.userData.id + '/subscriptions', body, {
            headers: {
                Authorization: this.props.route.params.token
            }
        })
        .then(response => {
            const isSubscribed = false;
            this.setState({ isSubscribed });
        })
        .catch(function (error) {
            console.log('unsubscribe ' + error);
            if( error.response ){
                console.log(error.response.data); // => the response payload 
            }
        });
    }

    async checkSubscriptionStatus() {
        if (!this.props.route.params.userData.is_athlete) {
            console.log("no es atleta");
            const isSubscribed = false;
            this.setState({ isSubscribed });
            console.log("seteo");
        } else {
            //axios.get(API_GATEWAY_URL + 'athletes/' + this.props.route.params.userData.id + '/subscriptions', {
            axios.get('https://trainings-g6-1c-2023.onrender.com/athletes/' + this.props.route.params.userData.id + '/subscriptions', {
                headers: {
                    Authorization: this.props.route.params.token
                }
            })
            .then(response => {
                const subscribedTrainings = response.data;
                console.log(subscribedTrainings);//debug
                const isSubscribed = (subscribedTrainings.filter(t => t.id === this.props.route.params.trainingId).length > 0);
                console.log("isSubscribed " + isSubscribed);
                this.setState({ isSubscribed });
            })
            .catch(function (error) {
                console.log('isSubscribed' + error);
            });
        }
    }

    componentDidMount() {
        this.loadTrainingInfo();
        this.checkFavoriteStatus();
        this.checkSubscriptionStatus();
        console.log(this.props.route.params.trainingId);//debug
    }

    loadTrainingInfo() {     
        axios.get(API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId, {
                headers: {
                    Authorization: this.props.route.params.token
                }
            })
            .then(response => {
                const training = response.data;
                console.log(training);//debug
                console.log(this.props.route.params.userData);
                this.setState({ training });
            })
            .catch(function (error) {
                console.log('loadTrainingInfo ' + error);
            });
    }

    handleActivityEditPress() {
        alert("Edit pressed for activity");
    }

    handleDataEditPress() {
        alert("Edit pressed for data");
    }

    handleDeletePress() {
        axios.delete(API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId, {
            headers: {
                Authorization: this.props.route.params.token
            }
        })
        .then(response => {
            alert('Entrenamiento eliminado');
            this.props.navigation.replace('TrainingsListScreen');
        })
        .catch(function (error) {
            console.log('handleDeletePress ' + error);
        });
    }

    handleBackToTrainings() {
        this.props.navigation.navigate('TrainingsListScreen')
    }

    getUriById(image_id) {

        //reemplazar por logica de obtener imagen a partir de id
        //----------------
        return 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg'
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/220px-Cat_November_2010-1a.jpg'
        //----------------
    }

    renderFooter() {
        return (
            <View style={{flexDirection: 'row', width: '100%', marginTop: 10, alignItems: 'center'}}>
                <View style={{flex: 0.4, alignItems: 'center'}}>
                    <Text style={trainigStyles.creatorTitle}>Creador</Text>
                    <Image
                        source={{ uri: this.getUriById(1) }}
                        style={ trainigStyles.creatorImage }
                        resizeMode= 'contain'
                    />
                    <Text style={trainigStyles.creatorName}>Sebastian Capelli</Text>
                </View>
                <View style={{ flex: 0.3 }}/>
                <View style={{ flex: 0.3, alignItems: 'flex-end', justifyContent: 'center'}}>
                    <TextLinked
                        linkedText="Ver metas del entrenamiento"
                        onPress={() => alert("Ver metas del entrenamiento")}
                        style={{
                            marginRight: 20,
                        }}
                    />
                </View>
            </View>
        )
    }

    canEdit() {
        return this.state.training.trainer_id === this.props.route.params.userData.id
    }

    canSubscribe() {
        return this.props.route.params.userData.is_athlete
    }
    
    canDelete() {
        return this.state.training.trainer_id === this.props.route.params.userData.id
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
                    editButtonPress = {this.canEdit()? this.handleDataEditPress : null}
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
                    canRate= {true}
                    style={{
                        marginTop: 20,
                    }}
                />

                <DividerWithLeftText
                    text="Lista de actividades"
                    maxCounter={MAX_ACTIVITIES}
                    counter = {this.state.training.activities.length}
                    style={{
                        marginTop: 20,
                    }}
                    editButtonPress = {this.canEdit()? this.handleActivityEditPress : null }
                />
                
                <ActivityList
                    activities={this.state.training.activities}
                    onChange={this.refreshActivities}
                    style={{
                        marginTop: 10,
                    }}
                    />

                <View style={{ marginTop: 20, width: '100%', height: 1, backgroundColor: 'grey'}} />

                {this.renderFooter()}

                <View style={{ marginTop: 20, width: '100%', height: 1, backgroundColor: 'grey'}} />
                {/* <View style={{ marginTop: 20, width: '100%', height: 1, backgroundColor: 'grey'}} /> */}

                { this.canSubscribe() &&
                    <ButtonStandard 
                        onPress={this.handleSubscribeButtonPress}
                        title={this.state.isSubscribed? "Cancelar suscripción" : "Suscribirse"}
                        style={{
                            marginTop: 20,
                        }}
                        icon={this.state.isSubscribed? 'bookmark-off' : 'bookmark'}
                        warningTheme={this.state.isSubscribed}
                    />
                }

                { this.canDelete() &&
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

                <ButtonStandard 
                    onPress={this.handleBackToTrainings}
                    title={"Volver a entrenamientos"}
                    style={{
                        marginTop: 5,
                    }}
                    icon={this.state.isSubscribed? 'bookmark-off' : 'bookmark'}
                />                

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