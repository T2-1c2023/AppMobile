import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'

import axios from 'axios';


export default class TrainingActivitiesScreen extends Component {
    constructor(props) {
        super(props)
        this.handleConfirmationPress = this.handleConfirmationPress.bind(this)
        this.handleCancelPress = this.handleCancelPress.bind(this)
        this.refreshActivities = this.refreshActivities.bind(this)
        this.maxActivities = 20
        this.state = {
            activities: [],
        }
    }

    componentDidMount() {
        this.refreshActivities();
    }

    handleConfirmationPress() {
    }

    handleCancelPress() {
        alert('Cancel pressed')
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
                    maxCounter={this.maxActivities}
                    counter = {this.state.activities.length}
                    style={{
                        marginTop: 10,
                    }}
                />

                <ActivityList
                    activities={this.state.activities}
                    onChange={this.refreshActivities}
                    style={{
                        marginTop: 5,
                    }}
                />

                <ConfirmationButtons 
                    confirmationText="Confirmar actividades"
                    cancelText="Cancelar"
                    onConfirmPress={this.handleConfirmationPress}
                    onCancelPress={this.handleCancelPress}
                    style={{
                        marginTop: 20,
                    }}
                />
            </View>
              
            </ScrollView>
        );
    }
}
