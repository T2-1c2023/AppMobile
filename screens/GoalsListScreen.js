import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from '../src/styles/styles';
import { ButtonStandard } from '../src/styles/BaseComponents';
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import GoalsList from '../src/components/GoalsList';
// import { Mode } from './GoalsScreen';
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Constants from 'expo-constants'
import { ActivityIndicator, IconButton } from 'react-native-paper';

import { UserContext } from '../src/contexts/UserContext';

import { Mode } from './GoalScreen';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

// export const Mode = {
//     AthleteCreate: 'athleteCreate',
//     TrainerCreate: 'trainerCreate',
//     Edit: 'edit',
//     ReadOnly: 'readOnly'
// }

export const ListMode = {
    TrainerGoalsCreated: 'trainerGoalsCreated',

    AthletePersonalGoalsLeft: 'athletePersonalGoalsLeft',
    AthletePersonalGoalsCompleted: 'athletePersonalGoalsCompleted',
    
    AthleteAllTrainingsGoalsLeft: 'athleteAllTrainingsGoalsLeft',
    AthletesAllTrainingsGoalsCompleted: 'athletesAllTrainingsGoalsCompleted',
    
    AthleteSingleTrainingGoalsLeft: 'athleteSingleTrainingGoalsLeft',
    
    CreatorTrainingGoals: 'creatorTrainingGoals',
}

export default class GoalsListScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.onPressGoal = this.onPressGoal.bind(this)
        this.getTokenData = this.getTokenData.bind(this)

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.componentDidMount()
        })

        this.props = props

        this.state = {
            loading: true,
            goals: [],
        }
        
        this.listMode = this.props.listMode?? this.props.route.params.listMode
        console.log("listMode " + this.listMode)
    }

    getTokenData() {
        this.tokenData = this.props.route !== undefined ? this.props.route.params.data : this.props.data
    }

    onPressGoal(goal) {
        console.log("onPressGoal " + JSON.stringify(goal));
        const goalCompleted = this.listMode === ListMode.AthletePersonalGoalsCompleted || this.listMode === ListMode.AthletesAllTrainingsGoalsCompleted
        const personalGoal = this.listMode === ListMode.AthletePersonalGoalsLeft || this.listMode === ListMode.AthletePersonalGoalsCompleted 
        const isSubscribed = this.listMode === ListMode.AthleteAllTrainingsGoalsLeft || this.listMode === ListMode.AthleteSingleTrainingGoalsLeft

        this.props.navigation.navigate('GoalScreen', { goalData: goal, userData: this.props.data, mode: Mode.ReadOnly, goalCompleted, personalGoal, isSubscribed })
    }

    loadGoals(url, params) {
        console.log("token: " + tokenManager.getAccessToken())
        console.log("url: " + url)

        const config = { 
            headers: { Authorization: tokenManager.getAccessToken() }, 
            params: params,
        }

        axios.get(url, config)
            .then((response) => {
                this.setState({ goals: response.data });
                console.log("goals retrieve: "+response.data);
            })
            .catch((error) => {
                console.error("loadGoals error " + error);
            })
    }

    setEditButton() {
        console.log("setEditButton")
        this.props.navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="pencil"
                    iconColor="#21005D"
                    size={30}
                    onPress={() => this.props.navigation.navigate('TrainingGoalsEditionScreen', { 
                        trainingId: this.props.trainingId?? this.props.route.params.trainingId 
                    })}
                />
            ),
        });
    }

    componentDidMount() {
        let params
        let url

        let userId = this.context.userId

        switch (this.listMode) {
            case ListMode.TrainerGoalsCreated:
                params = {}
                url = API_GATEWAY_URL + "trainers/" + userId + "/goals"
                break

            case ListMode.AthletePersonalGoalsLeft:
                params = {completed: false}
                url = API_GATEWAY_URL + "athletes/" + userId + "/personal-goals"
                break

            case ListMode.AthletePersonalGoalsCompleted:
                params = {completed: true}
                url = API_GATEWAY_URL + "athletes/" + userId + "/personal-goals"
                break

            case ListMode.AthleteAllTrainingsGoalsLeft:
                params = {completed: false}
                url = API_GATEWAY_URL + "athletes/" + userId + "/subscriptions/goals"            
                break

            case ListMode.AthletesAllTrainingsGoalsCompleted:
                params = {completed: true}
                url = API_GATEWAY_URL + "athletes/" + userId + "/subscriptions/goals"
                break

            case ListMode.AthleteSingleTrainingGoalsLeft:
                params = {
                    completed: false, 
                    training_id: this.props.trainingId?? this.props.route.params.trainingId
                }
                url = API_GATEWAY_URL + "athletes/" + userId + "/subscriptions/goals"
                break

            case ListMode.CreatorTrainingGoals:
                let trainingId = this.props.trainingId?? this.props.route.params.trainingId
                params = {}
                url = API_GATEWAY_URL + "trainings/" + trainingId + "/goals"
                this.setEditButton()
                break

            default:
                throw new Error("ListMode not implemented: " + this.listMode)
        }

        this.loadGoals(url, params)
        this.setState({ loading: false });
    }

    render() {

        if (this.state.loading) {
            return (
                <View style={{ marginTop: 80 }}>
                    <ActivityIndicator size="large" color="#21005D" />
                </View>
            )
        } else {
            return (
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    style={styles.scrollViewWithFooter}
                >
                    <View style={styles.container}>
                        <GoalsList
                            goals={this.state.goals}
                            style={{
                                marginTop: 20,
                            }}
                            onPress={this.onPressGoal}
                            selectable={false}
                        />
                    </View>
                </ScrollView>
            );
        }
    }
}