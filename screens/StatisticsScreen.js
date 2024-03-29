import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import UsersList from '../src/components/UsersList';
import Modal from "react-native-modal";
import { SelectList } from 'react-native-dropdown-select-list'
import { TextDetails, TextSubheader, DividerWithMiddleText } from '../src/styles/BaseComponents';
import { IconButton, ActivityIndicator, Checkbox} from 'react-native-paper'
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../src/TokenManager';
import { titleManager } from '../src/TitleManager';
import { UserContext } from '../src/contexts/UserContext';
import RadiusInput from '../src/components/RadiusInput';
import jwt_decode from 'jwt-decode';

import Timeline from 'react-native-timeline-flatlist'
import Icon from 'react-native-paper/src/components/Icon'

import { Slider } from '@rneui/themed';
import * as Elements from '@rneui/themed'

import { responseErrorHandler } from '../src/utils/responseErrorHandler'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class StatisticsScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.onValueChange = this.onValueChange.bind(this)
        this.onSlidingComplete = this.onSlidingComplete.bind(this)

        this.state = {
            loading: true,
            time: 0,
            calories: 0,
            distance: 0,
            goalsAmmount: 0,
            sessionsAmmount: 0,
            sessions: [],
            days: 10,
        }

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.componentDidMount()
        })
    }

    getSessionsFormatted(sessionsResponse) {
        return sessionsResponse.map((session) => {
            let description = 
                "Tiempo:    " + session.time_spent_mins + " min, " + "\n" +
                "Calorias:  " + session.calories_burned + " kcal, " + "\n" +
                "Distancia: " + session.distance_km + " km"
        
            return {
                time: session.date,
                title: session.training_type_description,
                description: description,
            }
        })
    }

    componentDidMount() {
        titleManager.setTitle(this.props.navigation, 'Estadísticas', 22)
        this.loadStats()
    }

    loadStats() {
        this.setState({loading: true})

        let athleteId = this.context.userId
        let url = API_GATEWAY_URL + "athletes/" + athleteId + "/sessions"
        
        let config = {
            headers: { Authorization: tokenManager.getAccessToken() },
            params: {
                days_before: this.state.days,
            }
        } 

        axios.get(url, config)
            .then((response) => {
                console.log("Response: " + JSON.stringify(response.data))
                let data = response.data
                let sessionsResponse = response.data.sessions
                let sessionsFormatted = this.getSessionsFormatted(sessionsResponse)
                this.setState({
                    loading: false,
                    time: data.time_spent_mins_total,
                    calories: data.calories_burned_total,
                    distance: data.distance_km_total,
                    goalsAmmount: data.completed_training_goals,
                    sessionsAmmount: data.sessions.length,
                    sessions: sessionsFormatted,
                })
            })
            .catch((error) => {
                console.log(error)
                responseErrorHandler(error.response, this.props.navigation)
            }
        )

    }

    renderStat(title, iconName, value, unit) {
        return (
            <View style={statsStyles.statContainer}>
                <Icon 
                    source={iconName} 
                    size={25} 
                    color='#21005D'/>
                <Text style={statsStyles.statText}>
                    {title}: {value} {unit}
                </Text>
            </View>
        )
    }

    onValueChange(value) {
        this.setState({days: value})
    }

    onSlidingComplete() {
        this.loadStats()
    }

    renderSlider() {
        return (
            <View style={statsStyles.sliderContainer}>
                <Text style={statsStyles.days}>
                    Últimos {this.state.days} días
                </Text>
                <Slider
                    value={this.state.days}
                    maximumValue={360}
                    minimumValue={10}
                    step={10}
                    style={statsStyles.slider}
                    onSlidingComplete={this.onSlidingComplete}
                    allowTouchTrack
                    onValueChange={this.onValueChange}
                    trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                    thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                    thumbProps={{
                        children: (
                            <Elements.Icon
                                name="clock-o"
                                type="font-awesome"
                                size={20}
                                reverse
                                containerStyle={{ bottom: 20, right: 20 }}
                                color="green"
                            />
                        ),
                    }}
                />
            </View>
        )
    }

    render() {
        return this.state.loading?
        (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#21005D" />
                <Text style={{marginTop: 30, color: 'black'}}>Cargando estadisticas ...</Text>
            </View>
        )
        :
        (
            <View style={{flex:1, backgroundColor: '#DED8E1',}} >
                {this.renderSlider()}
                <View style={[styles.container, {marginTop: 10, flex: 0.3}]}>
                    {this.renderStat("Cantidad de sesiones", "counter", this.state.sessionsAmmount, "")}
                    {this.renderStat("Tiempo consumido", "timer-outline", this.state.time, "min")}
                    {this.renderStat("Calorías consumidas", "fire", this.state.calories, "kcal")}
                    {this.renderStat("Distancia recorrida", "map-marker-distance", this.state.distance, "km")}
                    {this.renderStat("Metas completadas", "check-circle-outline", this.state.goalsAmmount, "")}

                </View>
                <Timeline
                    style={statsStyles.timeline}
                    data={this.state.sessions}
                    timeContainerStyle={{minWidth:80}}
                    titleStyle={{fontSize:16, fontWeight: 'bold', color: 'green', marginTop: -12}}
                />
            </View>
        )
    }
}

const statsStyles = StyleSheet.create({
    statContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // backgroundColor: 'green',
        marginTop: 10,
        paddingLeft: 20,
        width: '100%',
    },

    statText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },

    timeline: {
        flex: 0.5,
        backgroundColor: '#DED8E1', 
        paddingLeft: 30
    },

    slider: { 
        width: 250, 
        marginTop: 40,
    },

    sliderContainer: {
        flex: 0.2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    days: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    }
})