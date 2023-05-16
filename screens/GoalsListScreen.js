import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from '../src/styles/styles';
import { ButtonStandard } from '../src/styles/BaseComponents';
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import GoalsList from '../src/components/GoalsList';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';

export default class GoalsListScreen extends Component {
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
        const ids = [...this.state.selectedGoalsIds, goal_id]

        const body = {
            training_id: 1,
            goal_id: goal_id
        }
        // TODO: acá debería pegarle al api gateway
        axios.put(
            "https://trainings-g6-1c-2023.onrender.com/trainings/1/goals/" + goal_id.toString(), 
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

    fetchData = async () => {
        // New Code ------------------------------------------------------------------------------------------------
        // TODO: ver como funciona la selección de fotos en Old Code
        /*this.setState({ loading: true });
        // TODO: acá debería pegarle al api gateway
        const trainerGoalsUrl = "https://trainings-g6-1c-2023.onrender.com/trainers/" + this.props.data.id + "/goals"
        
        // url hardcodeado para testing sin servicio de usuarios
        // const trainerGoalsUrl = "https://trainings-g6-1c-2023.onrender.com/trainers/34/goals";

        await axios.get(trainerGoalsUrl)
            .then((response) => {
                this.setState({ goals: response.data});
            }) 
            .catch((error) => {
                console.error(error);
            })
        
        this.setState({ loading: false });*/

        // Old Code ------------------------------------------------------------------------------------------------
        // TODO: acá debería pegarle al api gateway
        const trainerGoalsUrl = "https://trainings-g6-1c-2023.onrender.com/trainers/" + this.props.data.id + "/goals"
        const trainerGoalsPromise = axios.get(trainerGoalsUrl);
            
        // TODO: preguntar funcionamiento de este links
        const trainingGoalsPromise = axios.get("https://trainings-g6-1c-2023.onrender.com/trainings/1/goals")

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
        // TODO: acá debería pegarle al api gateway
        const url = "https://trainings.com/trainers/" + this.props.data.id + "/goals";
        
        // url hardcodeado para testing sin servicio de usuarios
        // const url = "https://trainings-g6-1c-2023.onrender.com/trainers/34/goals";

        axios.get(url)
            .then(response => {
                const goals = response.data;
                const filteredGoals = goals.filter(goal => goal.title.toLowerCase().includes(queryText.trim().toLowerCase()))
                this.setState({ goals: filteredGoals })
            })
            .catch(function (error) {
                console.log(error);
            });
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
                    onIconPress={
                        () => this.props.navigation.navigate('GoalScreen', { data: this.props.data })
                    }
                    onSubmit={this.handleSearch}
                    placeholder="Buscar por título"
                    style={{
                        marginTop: 20,
                    }}
                />

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
                </View>
            }
            </ScrollView>
            </>
        );
    }
}