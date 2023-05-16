import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from '../src/styles/styles';

import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import GoalsList from '../src/components/GoalsList';
import { ConfirmationButtons } from '../src/styles/BaseComponents';
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Constants from 'expo-constants'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class GoalsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handlePress = this.handlePress.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.handleDeselection = this.handleDeselection.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.state = {
            title: '',
            description: '',
            metric: '',
            days: 0,
            goals: [],
            selectedGoalsIds: [],
            trainerData: {},
            trainingData: props.route.params.trainingData,
        }
    }

    handleSelection(goal_id) {
        const ids = [...this.state.selectedGoalsIds, goal_id]

        const body = {
            training_id: 1,
            goal_id: goal_id
        }

        axios.put(
            API_GATEWAY_URL + "trainings/" + this.state.trainerData.id + "/goals/" + goal_id.toString(), 
            body)
            .then(response => {
                console.log(ids)
                this.setState({ selectedGoalsIds: ids })
            })
            .catch(error => {
                console.log(error)
            })

    }

    handleDeselection(goal_id) {
        const ids = this.state.selectedGoalsIds.filter(id => id !== goal_id)

        console.log(ids)
        this.setState({ selectedGoalsIds: ids })
    }

    handlePress = (goal) => {
        alert('id de meta: ' + goal.goal_id + '\n' + 'Titulo: ' + goal.title)
    }

    componentDidMount() {
        const encoded_jwt = tokenManager.getAccessToken();
        const trainerData = jwt_decode(encoded_jwt);
        this.setState({ trainerData });
        
        console.log(tokenManager.getAccessToken());
        const trainerGoalsPromise = axios.get(API_GATEWAY_URL + "trainers/" + trainerData.id + "/goals", {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
            
        const trainingGoalsPromise = axios.get(API_GATEWAY_URL + "trainings/" + this.state.trainingData.id + "/goals", {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
        
        Promise.all([trainerGoalsPromise, trainingGoalsPromise])
            .then(responses => {
                const goals = responses[0].data;
                const selectedGoalsIds = responses[1].data.map(goal => goal.id);

                goals.sort(( a, b) => 
                    selectedGoalsIds.includes(a.id) ? -1 
                    : 
                    selectedGoalsIds.includes(b.id) ? 1 : 0
                )

                this.setState({ goals, selectedGoalsIds });
            }).catch(function (error) {
                console.log(error);
            }
            );
    }



    handleSearch (queryText) {
        axios.get(API_GATEWAY_URL + "trainers/" + this.state.trainerData.id +"/goals")
            .then(response => {
                const goals = response.data;
                const filteredGoals = goals.filter(goal => goal.title.toLowerCase().includes(queryText.trim().toLowerCase()))
                this.setState({ goals: filteredGoals })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleCreatePress = async () => {

    }

    handleCancelPress = async () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <>
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollViewWithFooter}
            >
            
            <View style={styles.container}>
                
                <SearchInputWithIcon
                    onIconPress={() => alert('Icon pressed')}
                    onSubmit={this.handleSearch}
                    placeholder="Buscar por título"
                    style={{
                        marginTop: 20,
                    }}
                />

                <GoalsList 
                    goals={this.state.goals}
                    style={{
                        marginTop: 20,
                    }}
                    onPress={this.handlePress}
                    selectedGoalsIds={this.state.selectedGoalsIds}
                    onSelection={this.handleSelection}
                    onDeselection={this.handleDeselection}
                />

            </View>
            </ScrollView>
            <View style={styles.footerContainer}>
                <ConfirmationButtons
                    confirmationText="Continuar"
                    cancelText="Cancelar"
                    onConfirmPress={this.handleCreatePress}
                    onCancelPress={this.handleCancelPress}
                    style={{
                        marginTop: 10,
                        alignSelf: 'flex-end',
                    }}
                />
            </View>
            </>
        );
    }
}