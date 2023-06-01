import React, { Component } from 'react';
import { Avatar, Button, Card, Text, IconButton, Divider } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';
import { DividerWithMultipleTexts, TextLinked, TextWithLinkFlexible, TextWithLink } from '../styles/BaseComponents';
import StarsScore from './StarsScore';
import Constants from 'expo-constants'
import axios from 'axios';
import { tokenManager } from '../TokenManager';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class TrainingData extends Component {
    constructor(props) {
        super(props)
        this.alreadyRated = this.alreadyRated.bind(this);
        this.state = {
        }
        this.isAlreadyRated = false
        this.myScore = this.props.myScore
        }

    componentDidMount() {
        this.alreadyRated();
        
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

    async alreadyRated() {
        const url = API_GATEWAY_URL + 'trainings/' + this.props.training.id + '/ratings';
        const params = { athlete_id: this.props.userId }
        let result = false;
        await axios.get(url, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            },
            params: params
        })
            .then(response => {
                const data = response.data;
                if (data.length > 0) {
                    this.myScore = data[0].score
                    //this.setState({myScore: data[0].score})
                    this.isAlreadyRated = true;
                    result = true;
                } else {
                    this.isAlreadyRated = false;
                    result = false;
                }
                    
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    this.isAlreadyRated = false
                    result = false;
                }
                console.error("alreadyRated " + error);
            })
        return result;
    }

    renderStarsWithText(flex, text, rate) {
        return (
            <View style={{ flexDirection: 'row', flex: flex}}>
                <View style={{ backgroundColor: 'transparent', flex: 0.5}}>
                    <StarsScore 
                        score={rate? this.myScore : this.props.training.score}
                        style={{
                        }}
                    />
                </View>
                <View style={{ flex: 0.5, backgroundColor: 'transparent', paddingTop: 2 }}>
                    <TextLinked
                        onPress={() => rate
                            ? this.props.navigation.navigate('TrainingReviewScreen', {alreadyRated: this.props.isAlreadyRated, training:this.props.training, userId:this.props.userId})
                            : this.props.navigation.navigate('TrainingsReviewsListScreen', {trainingId:this.props.training.id })}
                        linkedText={text}
                    />
                </View>
            </View>
        )
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
            const calificationText = alreadyRated ? 'Editar' : 'Deja tu opinión';
            let alreadyRated = this.alreadyRated().then((value) => {
                //console.log("value " + value);
                this.isAlreadyRated = value;
            });
            
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
    
                        {!this.isAlreadyRated && (
                            <View style={{ flex: 0.50, backgroundColor: 'transparent', paddingTop: 4 }}>
                                <TextWithLink
                                    text={calificationText}
                                    linkedText={'aqui'}
                                    onPress={() => this.props.navigation.navigate('TrainingReviewScreen', {alreadyRated: this.isAlreadyRated, training:this.props.training, userId:this.props.userId})}
                                    notFixedWidth
                                />
                            </View>
                        )}
    
                        {this.isAlreadyRated && (
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
                        <Text>{this.getLevelName()}</Text>
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

                {this.renderCalificationsData()}

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
    },

    locationText: {
        width: 100, 
        textAlign: 'center',
        color: 'grey',
        marginRight: 40,
    },
})