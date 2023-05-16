import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'

import axios from 'axios';

const MAX_ACTIVITIES = 20;

export default class TrainingActivitiesScreen extends Component {
    constructor(props) {
        super(props)
        this.handleContinuePress = this.handleContinuePress.bind(this)
        this.refreshActivities = this.refreshActivities.bind(this)
        this.state = {
            activities: [],
        }
    }

    componentDidMount() {
        this.refreshActivities();
    }

    handleContinuePress() {
        alert("Continue pressed");
    }

    refreshActivities() {
        axios.get('https://trainings-g6-1c-2023.onrender.com/trainings/1/activities')
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
