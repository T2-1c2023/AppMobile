import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ButtonStandard } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'
// User information
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
// Requests
import Constants from 'expo-constants';
import axios from 'axios';

import { titleManager } from '../src/TitleManager';

const MAX_ACTIVITIES = 20;

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class TrainingActivitiesScreen extends Component {
    constructor(props) {
        super(props)
        this.handleContinuePress = this.handleContinuePress.bind(this)
        this.refreshActivities = this.refreshActivities.bind(this)
        this.state = {
            activities: [],
            trainerData: {},
            trainingData: props.route.params.trainingData,
        }
    }

    componentDidMount() {
        console.log("navigation state " + this);
        const encoded_jwt = tokenManager.getAccessToken();
        const trainerData = jwt_decode(encoded_jwt);
        this.setState({ trainerData });

        this.refreshActivities();
        titleManager.setTitle(this.props.navigation, "Actividades", 22)
    }

    handleContinuePress() {
        console.log("this.state.trainingData " + JSON.stringify(this.state.trainingData));
        this.props.route.params.from === 'TrainingScreen'
        ? this.props.navigation.navigate('TrainingScreen', { userData: jwt_decode(tokenManager.getAccessToken()), token:tokenManager.getAccessToken(), trainingId: this.state.trainingData.id })
        : this.props.navigation.navigate('TrainingGoalsEditionScreen', { trainingData: this.state.trainingData, id:this.state.trainerData.id });
        
    }

    refreshActivities() {
        axios.get(API_GATEWAY_URL + 'trainings/' + this.state.trainingData.id + '/activities', {
                headers: {
                    Authorization: tokenManager.getAccessToken()
                }
            })
            .then(response => {
                const activities = response.data;
                this.setState({ activities });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>

                <DividerWithLeftText
                    text="Lista de actividades"
                    maxCounter={MAX_ACTIVITIES}
                    counter = {this.state.activities.length}
                    style={{
                        marginTop: 10,
                    }}
                />

                <ActivityList
                    maxActivities={MAX_ACTIVITIES}
                    activities={this.state.activities}
                    trainingId={this.state.trainingData.id}
                    onChange={this.refreshActivities}
                    style={{
                        marginTop: 5,
                    }}
                    editionMode
                />

                <ButtonStandard
                    onPress={this.handleContinuePress}
                    title="Continuar"
                    style={{
                        marginTop: 15,
                    }}
                />
            </View>
              
            </ScrollView>
        );
    }
}
