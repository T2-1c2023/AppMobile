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

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class GoalsTrainingsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handlePress = this.handlePress.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.handleDeselection = this.handleDeselection.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
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
        if (this.props.route.params.trainingData.trainer_id === this.props.route.params.id) {
            console.log("puede");//debug
            const ids = [...this.state.selectedGoalsIds, goal_id]

            const body = {
                training_id: this.props.route.params.trainingData.id,
                goal_id: goal_id
            }
            axios.put(
                API_GATEWAY_URL + "trainings/" + this.props.route.params.trainingData.id + "/goals/" + goal_id.toString(), 
                body, 
                {
                    headers: {
                        Authorization: tokenManager.getAccessToken()
                    }
                })
                .then(response => {
                    console.log(ids)
                    this.setState({ selectedGoalsIds: ids })
                })
                .catch(error => {
                    console.log(error)
                })
        } else {console.log("no puede")}
    }

    handleDeselection(goal_id) {
        if (this.props.route.params.trainingData.trainer_id === this.props.route.params.id) {
            const ids = this.state.selectedGoalsIds.filter(id => id !== goal_id)

            console.log(ids)
            this.setState({ selectedGoalsIds: ids })
        } else {console.log("no puede")}
    }

    handlePress = (goal) => {
        alert('id de meta: ' + goal.goal_id + '\n' + 'Titulo: ' + goal.title)
    }

    fetchData = async () => {
        const trainerGoalsPromise = axios.get(API_GATEWAY_URL + "trainers/" + this.props.route.params.trainingData.trainer_id + "/goals", {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
            
        console.log(API_GATEWAY_URL + "trainings/" + this.props.route.params.trainingData.id + "/goals")
        const trainingGoalsPromise = axios.get(API_GATEWAY_URL + "trainings/" + this.props.route.params.trainingData.id + "/goals", {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })

        // TODO: al seleccionar una foto salta [AxiosError: Request failed with status code 401]
        
        this.setState({ loading: true });

        await Promise.all([trainerGoalsPromise, trainingGoalsPromise])
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
        this.fetchData();
        // TODO: averiguar como hacer para que se reinicie siempre que vuelva el foco a esta pantalla
    }

    handleSearch (queryText) {
        axios.get(API_GATEWAY_URL + "trainers/" + props.route.params.trainingData.trainer_id +"/goals", {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
            .then(response => {
                const goals = response.data;
                const filteredGoals = goals.filter(goal => goal.title.toLowerCase().includes(queryText.trim().toLowerCase()))
                this.setState({ goals: filteredGoals })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    canEdit() {
        return this.props.route.params.trainingData.trainer_id === jwt_decode(tokenManager.getAccessToken()).id
    }

    render() {
        return (
            <>
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollViewWithFooter}
            >
            
            <View style={styles.container}>
                
                { this.canEdit() &&
                    <SearchInputWithIcon
                        onIconPress={
                            () => this.props.navigation.navigate('GoalScreen', { data: jwt_decode(tokenManager.getAccessToken()) })
                        }
                        onSubmit={this.handleSearch}
                        placeholder="Buscar por título"
                        style={{
                            marginTop: 20,
                        }}
                    />
                }

                {this.state.loading ? 
                    <View style={{marginTop: 80}}>
                        <ActivityIndicator size="large" color="#21005D"/>
                    </View>
                    :
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
                }

            </View>
            {/* TODO: este view no debería estar, debería actualizarse solo al volver. Como? */}
            {!this.state.loading &&
                <View style={styles.container}>
                    <ButtonStandard 
                        title="Refresh"
                        onPress={this.fetchData}
                        style={{marginTop: 20}}
                    />

                    <ButtonStandard 
                        title="Continuar"
                        onPress={() => this.props.navigation.replace('TrainingScreen',
                            {token:tokenManager.getAccessToken(), userData:jwt_decode(tokenManager.getAccessToken()), trainingId:this.props.route.params.trainingData.id})}
                        style={{marginTop: 20}}
                    />
                </View>
            }
            </ScrollView>
            </>
        );
    }
}