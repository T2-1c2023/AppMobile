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
import { TextHeader, TextDetails, TextSubheader, DividerWithMiddleText } from '../src/styles/BaseComponents';
import { IconButton, ActivityIndicator, Checkbox} from 'react-native-paper'
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../src/TokenManager';
import { titleManager } from '../src/TitleManager';
import { UserContext } from '../src/contexts/UserContext';
import RadiusInput from '../src/components/RadiusInput';
import jwt_decode from 'jwt-decode';

// import Icon from 'react-native-paper/src/components/Icon'
import { Slider, Icon } from '@rneui/themed';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class TrainingSessionScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.onValueChange = this.onValueChange.bind(this)
        this.onPressRegister = this.onPressRegister.bind(this)
        this.onPressCancel = this.onPressCancel.bind(this)

        this.trainingId = this.props.route.params.trainingId

        this.state = {
            loading: true,
            time: 60,
        }
    }

    renderSlider() {
        return (
            <Slider
                value={this.state.time}
                maximumValue={240}
                minimumValue={10}
                step={10}
                style={sessionStyles.slider}
                allowTouchTrack
                onValueChange={this.onValueChange}
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                children: (
                    <Icon
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
        )
    }

    onValueChange(value) {
        this.setState({
            time: value,
        })
    }

    onPressRegister() {
        const athleteId = this.context.userId
        const url = API_GATEWAY_URL + 
            "athletes/" + athleteId + "/subscriptions/" + this.trainingId + "/sessions"
        const data = {
            "time_spent_mins": this.state.time,
        }
        const config = { headers: { Authorization: "Bearer " + tokenManager.getAccessToken() } }

        axios.post(url, data, config)
            .then(response => {
                console.log("Session registered successfully")
                this.props.navigation.goBack()
            })
            .catch(error => {
                console.log("Error registering session")
                console.log(error)
            })
    }

    onPressCancel() {
        console.log("Canceling session")
    }

    renderConfirmationButtons() {
        return (
            <ConfirmationButtons
                confirmationText={"Registrar"}
                cancelText="Cancelar"
                onConfirmPress={this.onPressRegister}
                onCancelPress={this.onPressCancel}
                style={{
                    marginTop: 70,
                    alignSelf: 'center',
                }}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <TextHeader
                    body="Registra tu sesión"
                    style={[styles.textHeader, {marginTop: 20}]}
                />

                <Text style={sessionStyles.timeTitle}>
                    Duración de la sesión
                </Text>

                <Text style={sessionStyles.timeValue}>
                    {this.state.time} minutos
                </Text>

                {this.renderSlider()}

                {this.renderConfirmationButtons()}
            </View>
        )
    }
}

const sessionStyles = StyleSheet.create({
    timeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: 'black',
    },

    timeValue: {
        fontSize: 20,
        color: 'black',
    },

    slider: { 
        width: 250, 
        marginTop: 40
    },
})