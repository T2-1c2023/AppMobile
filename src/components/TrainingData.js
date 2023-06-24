import React, { Component } from 'react';
import { Avatar, Button, Card, Text, IconButton, Divider } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';
import { DividerWithMultipleTexts, TextLinked, TextWithLinkFlexible, TextWithLink } from '../styles/BaseComponents';
import StarsScore from './StarsScore';
import Constants from 'expo-constants'
import axios from 'axios';
import { tokenManager } from '../TokenManager';

import Icon from 'react-native-paper/src/components/Icon'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class TrainingData extends Component {
    constructor(props) {
        super(props)
        // this.alreadyRated = this.alreadyRated.bind(this);
        this.onPressRate = this.onPressRate.bind(this);
        this.onPressViewAllReviews = this.onPressViewAllReviews.bind(this);
        this.state = {
            myScore: 0,
        }
        this.myScore = this.props.myScore
        }

    componentDidMount() {
        // this.alreadyRated();
        
    }

    getLevelIcon() {
        switch (this.props.training.severity) {
            case 1:
                return require('../../assets/images/level-basic.png')
            case 2:
                return require('../../assets/images/level-intermediate.png')
            case 3:
                return require('../../assets/images/level-advanced.png')
            default:
                return require('../../assets/images/level-basic.png')
        }
    }

    getLevelName() {
        switch (this.props.training.severity) {
            case 1:
                return 'Básico'
            case 2:
                return 'Intermedio'
            case 3:
                return 'Avanzado'
            default:
                return 'Nivel desconocido'
        }
    }

    // async alreadyRated() {

    //     // GET /trainings/{training_id}/ratings?athlete_id={athlete_id}
    //     const url = API_GATEWAY_URL + 'trainings/' + this.props.training.id + '/ratings';
    //     const params = { athlete_id: this.props.userId }
    //     let result = false;
    //     await axios.get(url, {
    //         headers: {
    //             Authorization: tokenManager.getAccessToken()
    //         },
    //         params: params
    //     })
    //         .then(response => {
    //             const data = response.data;
    //             if (data.length > 0) {
    //                 this.myScore = data[0].score
    //                 //this.setState({myScore: data[0].score})
    //                 this.isAlreadyRated = true;
    //                 result = true;
    //             } else {
    //                 this.isAlreadyRated = false;
    //                 result = false;
    //             }
                    
    //         })
    //         .catch((error) => {
    //             if (error.response && error.response.status === 404) {
    //                 this.isAlreadyRated = false
    //                 result = false;
    //             }
    //             console.error("[TrainingData] alreadyRated " + error);
    //         })
    //     return result;
    // }

    renderStarsWithText(flex, text, rate) {
        return (
            <View style={{ flexDirection: 'row', flex: flex}}>
                <View style={{ backgroundColor: 'transparent', flex: 0.5}}>
                    <StarsScore 
                        score={rate? this.props.myScore : this.props.training.score}
                        style={{
                        }}
                    />
                </View>
                <View style={{ flex: 0.5, backgroundColor: 'transparent', paddingTop: 2 }}>
                    <TextLinked
                        onPress={rate? this.onPressRate : this.onPressViewAllReviews }
                        //     ? this.props.navigation.navigate('TrainingReviewScreen', {alreadyRated: this.props.isAlreadyRated, trainingTitle:this.props.training.title, trainingDescription:this.props.training.description, trainingId:this.props.training.id, userId:this.props.userId})
                        //     : this.props.navigation.navigate('TrainingsReviewsListScreen', {trainingId:this.props.training.id })}
                        
                        linkedText={text}
                    />
                </View>
            </View>
        )
    }

    onPressViewAllReviews() {
        this.props.onPressViewAllReviews()
    }

    onPressRate() {
        this.props.onPressRate()
    }

    renderCalificationsData() {
        const canRate = this.props.canRate;
    
        let calificationsData = (
            <View style={{marginTop: 10}}>
                <DividerWithMultipleTexts
                    texts={['Calificación general']}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 8,
                    }}
                >
                    <View style={{  flex: 0.15}} />
                    {this.renderStarsWithText(0.35, "ver todas", false)}
                    <View style={{  flex: 0.1}} />
                </View>
            </View>
        );
    
        if (canRate) {
            const calificationText = this.props.isAlreadyRated ? 'Editar' : 'Deja tu opinión';
            // let alreadyRated = this.alreadyRated().then((value) => {
            //     //console.log("value " + value);
            //     this.isAlreadyRated = value;
            // });

            

            
            //console.log(alreadyRated);
            alreadyRated = true;
            
            calificationsData = (
                <View style={{marginTop: 15}}>
                    <DividerWithMultipleTexts
                        texts={['Calificación general', 'Tu calificación']}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 8,
                        }}
                    >
                        <View style={{  flex: 0.15}} />
    
                        {this.renderStarsWithText(0.35, "Ver todas", false)}
    
                        {!this.props.isAlreadyRated && (
                            <View style={{ flex: 0.50, backgroundColor: 'transparent', paddingTop: 4 }}>
                                <TextWithLink
                                    text={calificationText}
                                    linkedText={'aqui'}
                                    // onPress={() => this.props.navigation.navigate('TrainingReviewScreen', {alreadyRated: this.isAlreadyRated, training:this.props.training, userId:this.props.userId})}
                                    onPress={this.onPressRate}
                                    notFixedWidth
                                />
                            </View>
                        )}
    
                        {this.props.isAlreadyRated && (
                            <React.Fragment>
                                <View style={{  flex: 0.1}} />
                                {this.renderStarsWithText(0.35, "Editar", true)}
                                <View style={{  flex: 0.05}} />
                            </React.Fragment>
                        )}
                    </View>
                </View>
            );
        
        }
    
        return calificationsData;
    }

    renderSuscriptorsAmmount() {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon source="bookmark" size={25} color='#21005D'/>
                <Text style={dataStyles.suscriptorsAmmount}>
                    {this.props.training.subscriptions}
                </Text>
            </View>
        )
    }

    renderFavouritesAmmount() {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon source="heart" size={25} color='#21005D'/>
                <Text style={dataStyles.favouritesAmmount}>
                    {this.props.training.favorites}
                </Text>
            </View>
        )
    }
    
    renderSuscriptorsAndFavourites() {
        return (
            <View style={{marginTop: 20}}>
                <DividerWithMultipleTexts
                    texts={['#Suscriptores', '#Favoritos']}
                />
                <View
                        style={dataStyles.suscriptorsAndFavouritesContainer}
                    >
                    {this.renderSuscriptorsAmmount()}
                    {this.renderFavouritesAmmount()}
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={[this.props.style,{ width: '100%' }]}>

                <DividerWithMultipleTexts
                    texts={['Nivel', 'Tipo', 'Ubicación']}
                />

                <View style={dataStyles.dataBox}>
                    <View style={dataStyles.severityBox}>
                        <Image
                            source={this.getLevelIcon()}
                            style={dataStyles.severityIcon}
                        />
                        <Text style={{color: "black"}}>{this.getLevelName()}</Text>
                    </View>
                    <Text
                        style={dataStyles.typeText}
                    >
                        {this.props.training.type}
                    </Text>
                    <Text 
                        style={dataStyles.locationText}
                    >
                        {'to be implemented'}
                    </Text>

                </View>

                <DividerWithMultipleTexts
                    texts={['MET', 'Distancia']}
                />

                <View style={dataStyles.dataBox}>
                    <Text
                        style={dataStyles.metText}
                    >
                        {this.props.training.met}
                    </Text>
                    <Text 
                        style={dataStyles.distanceText}
                    >
                        {this.props.training.distance}
                    </Text>
                </View>

                {this.renderCalificationsData()}

                {this.renderSuscriptorsAndFavourites()}
            </View>
        )               
    }
}

const dataStyles = StyleSheet.create({
    dataBox: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between',
        marginTop: 10,
    },

    severityIcon: {
        height: 40,
        aspectRatio: 479/239, 
    },

    severityBox: {
        alignItems: 'center',
        marginLeft: 40,
    },

    typeText: {
        width: 100,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },

    metText: {
        width: 235,
        textAlign: 'center',
        fontSize: 16,
        color: 'black',
    },

    distanceText: {
        width: 155,
        textAlign: 'left',
        fontSize: 16,
        color: 'black',
    },

    locationText: {
        width: 100, 
        textAlign: 'center',
        color: 'grey',
        marginRight: 40,
    },

    suscriptorsAndFavouritesContainer: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: 'center',
        marginTop: 10,
    },

    suscriptorsAmmount: {
        color: 'black', 
        fontSize: 30, 
        fontFamily: 'serif', 
        fontWeight: 'bold', 
        marginRight: 10
    },

    favouritesAmmount: {
        color: 'black',
        fontSize: 30,
        fontFamily: 'serif',
        fontWeight: 'bold',
        marginLeft: 10
    },
})