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

import { IconButton } from 'react-native-paper'

import TrainingData from '../src/components/TrainingData'
import axios from 'axios';

const MAX_ACTIVITIES = 20;

export default class TrainingScreen extends Component {
    constructor(props) {
        super(props)
        this.handleDataEditPress = this.handleDataEditPress.bind(this)
        this.handleActivityEditPress = this.handleActivityEditPress.bind(this)
        this.handleFavoriteButtonPress = this.handleFavoriteButtonPress.bind(this)
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
            console.log(error);
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
            console.log(error);
        });
    }

    handleSubscribeButtonPress() {
        alert("Logica de suscribirse - TBD")

        const isSubscribed = !this.state.isSubscribed
        this.changeSubscribedStatus(isSubscribed).then(() => {
            this.checkSubscriptionStatus();
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async changeSubscribedStatus(isSubscribed) {
        //TODO: enviarla al back la actualizacion de la suscripcion de la actividad
        // await axios.post(...)
        return
    }

    async isSubscribed() {
        //TODO: preguntarle al back si el usuario está suscripto
        // await axios.get(...)
        return false
    }

    checkSubscriptionStatus() {
        this.isSubscribed().then((isSubscribed) => {
            this.setState({isSubscribed})
        }
        ).catch(function (error) {
            console.log(error);
        });
    }

    componentDidMount() {
        this.loadTrainingInfo();
        this.checkFavoriteStatus();
        this.checkSubscriptionStatus();
    }

    loadTrainingInfo() {

        // sacar id desde el parametro o desde el "contexto"
        // const training_id = this.props.training_id
        const training_id = 1
        
        axios.get('https://trainings-g6-1c-2023.onrender.com/trainings/' + training_id)
            .then(response => {
                const training = response.data;
                this.setState({ training });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleActivityEditPress() {
        alert("Edit pressed for activity");
    }

    handleDataEditPress() {
        alert("Edit pressed for data");
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
        return false
    }

    canSubscribe() {
        return true
    }
    
    canDelete() {
        return true
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
                        onPress={() => alert("Logica de suscripcion - TBD")}
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
                        onPress={() => alert("Logica de eliminar - TBD")}
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