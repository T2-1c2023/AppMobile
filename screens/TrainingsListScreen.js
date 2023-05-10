import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'

import axios from 'axios';

export default class TrainingsListScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            trainings: [],
        }
    }

    componentDidMount() {
        // get trainings list
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


            </View>
              
            </ScrollView>
        );
    }
}
