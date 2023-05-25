import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from '../src/styles/styles';
import { ButtonStandard } from '../src/styles/BaseComponents';
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import GoalsList from '../src/components/GoalsList';
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Constants from 'expo-constants'
import { ActivityIndicator } from 'react-native-paper';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class GoalsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handlePress = this.handlePress.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.handleDeselection = this.handleDeselection.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.getTokenData = this.getTokenData.bind(this)
        this.state = {
            loading: true,
            title: '',
            description: '',
            metric: '',
            days: 0,
            goals: [],
            selectedGoalsIds: [],
        }
        this.tokenData = ''
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

    handlePress = (goal) => {
        alert('id de meta: ' + goal.goal_id + '\n' + 'Titulo: ' + goal.title)
    }

    fetchData = async () => {

        console.log("data " + JSON.stringify(this.tokenData));
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
                completed: false
            }
         })
        .then((response) => {
            this.setState({ goals: response.data});
            console.log(response.data);
        }) 
        .catch((error) => {
            console.error(error);
        })
        

        this.setState({ loading: false });
    }

    componentDidMount() {
        this.getTokenData();
        this.fetchData();
        // TODO: averiguar como hacer para que se reinicie siempre que vuelva el foco a esta pantalla
    }

    handleSearch (queryText) {
        console.log(API_GATEWAY_URL + "trainers/" + this.tokenData.id +"/goals");
        axios.get(API_GATEWAY_URL + "trainers/" + this.tokenData.id +"/goals", {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
            })
            .then(response => {
                const goals = response.data;
                console.log("goals " + goals);
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
                        () => this.props.navigation.navigate('GoalScreen', { data: this.tokenData })
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