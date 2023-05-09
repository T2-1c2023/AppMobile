import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import styles from '../src/styles/styles';

import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import GoalsList from '../src/components/GoalsList';
import axios from 'axios';

export default class GoalsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handleGoalPress = this.handleGoalPress.bind(this)
        this.state = {
            title: '',
            description: '',
            metric: '',
            days: 0,
            goals: [],
        }
    }

    handleGoalPress = (goal) => {
        alert('id de meta: ' + goal.goal_id + '\n' + 'Titulo: ' + goal.title)
    }

    componentDidMount() {
        axios.get("https://trainings-g6-1c-2023.onrender.com/trainers/1/goals")
            .then(response => {
                const goals = response.data;
                this.setState({ goals });
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
                    onGoalPress={this.handleGoalPress}
                />

            </View>
              
            </ScrollView>
        );
    }
}