import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard } from '../src/styles/BaseComponents';
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
        this.state = {
            training: '',
            title: '',
            description: '',
            activities: [],
        }
        this.levels=[
            {"key": 0, "value": "Todos"}, 
            {"key": 1, "value": "Básico"},
            {"key": 2, "value": "Intermedio"},
            {"key": 3, "value": "Avanzado"},
        ]
    }

    componentDidMount() {
        this.loadTrainingInfo();
    }

    loadTrainingInfo() {

        // sacar id desde el parametro o desde el "contexto"
        // const training_id = this.props.training_id
        const training_id = 1
        
        axios.get('https://trainings-g6-1c-2023.onrender.com/trainings/' + training_id)
            .then(response => {
                const training = response.data;
                const activities = training.activities;
                const title = training.title;
                const description = training.description;
                this.setState({ training, activities, title, description });
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

    getTrainingTypeKeyValue() {
        return this.state.trainingTypes.find((trainingType) => {
            return trainingType.key == this.state.filteredTypeKeyApplied
        })
    }

    getTrainingLevelKeyValue() {
        return this.levels.find((level) => {
            return level.key == this.state.filteredLevelKeyApplied
        })
    }

    render() {
        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>

                <DividerWithLeftText
                    text={this.state.title}
                    style={{
                        marginTop: 10,
                    }}
                    editButtonPress = {this.handleDataEditPress}
                />

                <TextDetails
                    body={this.state.description}
                    style={{
                        marginTop: 5,
                        width: '90%',
                    }}
                    alignLeft
                />

                <TrainingData/>

                <DividerWithLeftText
                    text="Lista de actividades"
                    maxCounter={MAX_ACTIVITIES}
                    counter = {this.state.activities.length}
                    style={{
                        marginTop: 10,
                    }}
                    editButtonPress = {this.handleActivityEditPress}
                />
                <ActivityList
                    activities={this.state.activities}
                    onChange={this.refreshActivities}
                    style={{
                        marginTop: 5,
                    }}
                />

            </View>
              
            </ScrollView>
        );
    }
}
