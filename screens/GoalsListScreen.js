import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import styles from '../src/styles/styles';

import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import GoalsList from '../src/components/GoalsList';
import axios from 'axios';

export default class GoalsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handlePress = this.handlePress.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.handleDeselection = this.handleDeselection.bind(this)
        this.state = {
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



    componentDidMount() {
        const trainerGoalsPromise = axios.get("https://trainings-g6-1c-2023.onrender.com/trainers/1/goals")
            
        const trainingGoalsPromise = axios.get("https://trainings-g6-1c-2023.onrender.com/trainings/1/goals")
        
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

    render() {
        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>
                
                <SearchInputWithIcon
                    onIconPress={() => alert('Icon pressed')}
                    onSubmit={(queryText) => alert('searching for ' + queryText)}
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
        );
    }
}