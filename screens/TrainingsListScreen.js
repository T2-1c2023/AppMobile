import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import TrainingsList from '../src/components/TrainingsList';


import axios from 'axios';

export default class TrainingsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handleTrainingPress = this.handleTrainingPress.bind(this)
        this.handleFilterPress = this.handleFilterPress.bind(this)
        this.state = {
            trainings: [],
        }
    }

    componentDidMount() {
        this.refreshActivities();
    }

    handleTrainingPress(id) {
        alert('training with id ' + id + ' pressed')
    }

    handleFilterPress() {
        alert('filter pressed')

        // agregar logica de pedido de filtrado a usuario

        // reemplazar por request con query params
        axios.get('https://trainings-g6-1c-2023.onrender.com/trainings/')
            .then(response => {
                const trainings = response.data;
                this.setState({ trainings });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    refreshActivities() {
        axios.get('https://trainings-g6-1c-2023.onrender.com/trainings/')
            .then(response => {
                const trainings = response.data;
                this.setState({ trainings });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSearch() {

    }

    render() {
        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>
                <SearchInputWithIcon
                    filter
                    onIconPress={this.handleFilterPress}
                    onSubmit={this.handleSearch}
                    placeholder="Buscar por título"
                    style={{
                        marginTop: 20,
                    }}
                />

                <TrainingsList
                    trainings={this.state.trainings}
                    onTrainingPress={this.handleTrainingPress}
                    style={{
                        marginTop: 15,
                    }}
                />

            </View>
              
            </ScrollView>
        );
    }
}
