import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from '../src/styles/styles';
import { ButtonStandard } from '../src/styles/BaseComponents';
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import GoalsList from '../src/components/GoalsList';
import { tokenManager } from '../src/TokenManager';
import axios from 'axios';
import Constants from 'expo-constants'
import { ActivityIndicator } from 'react-native-paper';
import jwt_decode from 'jwt-decode';
import { titleManager } from '../src/TitleManager';
import { UserContext } from '../src/contexts/UserContext';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export const Mode = {
    AthleteCreate: 'athleteCreate',
    TrainerCreate: 'trainerCreate',
    Edit: 'edit',
    ReadOnly: 'readOnly'
}

export default class TrainingGoalsEditionScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.handleSelection = this.handleSelection.bind(this)
        this.handleDeselection = this.handleDeselection.bind(this)

        this.trainingId = this.props.route.params.trainingId
        console.log("[TrainingGoalsEditionScreen] trainingId: ", this.trainingId)

        this.state = {
            loading: true,
            title: '',
            description: '',
            metric: '',
            days: 0,
            goals: [],
            selectedGoalsIds: [],
        }
    }

    handleSelection(goal_id) {
        const url = API_GATEWAY_URL + "trainings/" + this.trainingId + "/goals/" + goal_id.toString()
        const body = {
            training_id: this.trainingId,
            goal_id: goal_id
        }
        const config = { headers: {Authorization: tokenManager.getAccessToken()} }

        const ids = [...this.state.selectedGoalsIds, goal_id]
        
        axios.put(url, body, config)
            .then(response => {
                console.log(ids)
                this.setState({ selectedGoalsIds: ids })
            })
            .catch(error => {
                console.log(error)
            })
    }

    handleDeselection(goal_id) {
        const config = { headers: { Authorization: tokenManager.getAccessToken() } }
        const url = API_GATEWAY_URL + "trainings/" + this.trainingId + "/goals/" + goal_id.toString()
        const ids = this.state.selectedGoalsIds.filter(id => id !== goal_id)

        axios.delete(url,config)
            .then(response => {
                this.setState({ selectedGoalsIds: ids })
            })
            .catch(error => {
                console.log(error)
            })
    }

    handlePress = (goal) => {
        alert('id de meta: ' + goal.goal_id + '\n' + 'Titulo: ' + goal.title)
    }

    async fetchDataForTrainer() {
        const config = { headers: { Authorization: tokenManager.getAccessToken() } }
        urlTrainerGoals = API_GATEWAY_URL + "trainers/" + this.context.userId + "/goals"
        urlActualTrainingGoals = API_GATEWAY_URL + "trainings/" + this.trainingId + "/goals"

        console.log("[TrainingGoalsEditionScreen] urlTrainerGoals: ", urlTrainerGoals)
        console.log("[TrainingGoalsEditionScreen] urlActualTrainingGoals: ", urlActualTrainingGoals)

        const trainerGoalsPromise = axios.get(urlTrainerGoals, config)
            
        const actualTrainingGoalsPromise = axios.get(urlActualTrainingGoals, config)
        
        this.setState({ loading: true });

        await Promise.all([trainerGoalsPromise, actualTrainingGoalsPromise])
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

            this.setState({ loading: false });
    }

    componentDidMount() {
        this.fetchDataForTrainer();
        titleManager.setTitle(this.props.navigation, "Metas del entrenamiento", 18)
    }

    render() {
        return (
            <>
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollViewWithFooter}
            >
            
            <View style={styles.container}>

                {this.state.loading ?
                    <View style={{marginTop: 80}}>
                        <ActivityIndicator size="large" color="#21005D"/>
                    </View>
                    :
                    <React.Fragment>
                        <Text style={{color: 'black', marginTop: 20}}>Las metas seleccionadas forman parte del entrenamiento</Text>
                        <GoalsList 
                            goals={this.state.goals}
                            style={{
                                marginTop: 20,
                            }}
                            onPress={this.handlePress}
                            selectedGoalsIds={this.state.selectedGoalsIds}
                            onSelection={this.handleSelection}
                            onDeselection={this.handleDeselection}
                            canEdit
                        />
                        <ButtonStandard 
                            title="Continuar"
                            onPress={() => this.props.navigation.goBack()}
                            style={{
                                marginTop: 20
                            }}
                        />
                    </React.Fragment>
                }
                
            </View>
            {/* TODO: este view no debería estar, debería actualizarse solo al volver. Como? */}
            {/* {!this.state.loading &&
            } */}
            </ScrollView>
            </>
        );
    }
}