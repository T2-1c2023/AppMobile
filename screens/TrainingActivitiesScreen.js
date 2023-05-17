import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'
import Constants from 'expo-constants';
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';

import axios from 'axios';

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
        const encoded_jwt = tokenManager.getAccessToken();
        const trainerData = jwt_decode(encoded_jwt);
        this.setState({ trainerData });

        this.refreshActivities();
    }

    handleContinuePress() {
        console.log(this.state.trainingData);
        this.props.navigation.navigate('GoalsTrainingsListScreen', { trainingData: this.state.trainingData });
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
