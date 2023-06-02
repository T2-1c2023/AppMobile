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

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

const Mode = {
    Create: 'create',
    Edit: 'edit',
    ReadOnly: 'readOnly'
}

export const ListMode = {
    TrainerGoalsCreated: 'trainerGoalsCreated',

    AthletePersonalGoalsLeft: 'athletePersonalGoalsLeft',
    AthletePersonalGoalsCompleted: 'athletePersonalGoalsCompleted',
    
    AthleteAllTrainingsGoalsLeft: 'athleteAllTrainingsGoalsLeft',
    AthletesAllTrainingsGoalsCompleted: 'athletesAllTrainingsGoalsCompleted',
    
    AthleteSingleTrainingGoalsLeft: 'athleteSingleTrainingGoalsLeft',
    
    CreatorTrainingGoals: 'creatorTrainingGoals',
    CreatorTrainingGoalsEdition: 'creatorTrainingGoalsEdition'
}

export default class GoalsListScreen extends Component {
    constructor(props) {
        super(props)
        this.onPressGoal = this.onPressGoal.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.handleDeselection = this.handleDeselection.bind(this)
        this.getTokenData = this.getTokenData.bind(this)

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.componentDidMount()
        })

        this.props = props

        this.data = this.props.data

        this.state = {
            loading: true,
            goals: [],
        }
        this.listMode = this.props.listMode

        console.log("props " + JSON.stringify(this.props))
        console.log("data " + JSON.stringify(this.data))
        console.log("listMode " + this.listMode)
    }

    getTokenData() {
        this.tokenData = this.props.route !== undefined ? this.props.route.params.data : this.props.data
    }

    handleSelection(goal_id) {  //TO_DO ver si se puede quitar esta función
        const ids = [...this.state.selectedGoalsIds, goal_id]

        const body = {
            training_id: 1,
            goal_id: goal_id
        }
    }

    handleDeselection(goal_id) {  //TO_DO ver si se puede quitar esta función

    }

    onPressGoal(goal) {
        console.log("onPressGoal " + JSON.stringify(goal));
        const goalCompleted = this.listMode === ListMode.AthletePersonalGoalsCompleted || this.listMode === ListMode.AthletesAllTrainingsGoalsCompleted

        this.props.navigation.navigate('GoalScreen', { goalData: goal, userData: this.props.data, mode: Mode.ReadOnly, goalCompleted })
    }

    fetchData = async () => {
        //console.log("data " + JSON.stringify(this.tokenData));
        let endpoint;
        if (this.tokenData.is_trainer) {   //TO_DO qué pasa si alguno es entrenador y atleta?
            endpoint = 'trainers/'
        } else if (this.tokenData.is_athlete) {
            endpoint = 'athletes/'
        }
        console.log(API_GATEWAY_URL + endpoint + this.tokenData.id + "/goals")
        console.log(tokenManager.getAccessToken());
        await axios.get(API_GATEWAY_URL + endpoint + this.tokenData.id + "/goals", {
            headers: {
                Authorization: tokenManager.getAccessToken()
            },
            params: {
                completed: this.completed
            }
        })
            .then((response) => {
                this.setState({ goals: response.data });
                console.log(response.data);
            })
            .catch((error) => {
                console.error("fetchData " + error);
            })


        this.setState({ loading: false });
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

    componentDidMount() {
        let params
        let url

        switch (this.listMode) {
            case ListMode.TrainerGoalsCreated:
                // GET /trainers/{id}/goals
                params = {}
                url = API_GATEWAY_URL + "trainers/" + this.data.id + "/goals"
                this.loadGoals(url, params)
                break

            case ListMode.AthletePersonalGoalsLeft:
                params = {completed: false}
                url = API_GATEWAY_URL + "athletes/" + this.data.id + "/personal-goals"
                this.loadGoals(url, params)
                break

            case ListMode.AthletePersonalGoalsCompleted:
                params = {completed: true}
                url = API_GATEWAY_URL + "athletes/" + this.data.id + "/personal-goals"
                this.loadGoals(url, params)
                break

            default:
                break
        }

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