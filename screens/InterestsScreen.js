import React, { Component } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
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
import InterestsList from '../src/components/InterestsList';
import { titleManager } from '../src/TitleManager';

import { StyleSheet, Keyboard, Image } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { PinInput } from '../src/components/PinInput'
import { TextHeader, TextDetails, DividerWithMiddleText, InputData, TextWithLink, LoginImage } from '../src/styles/BaseComponents';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export const Mode = {
    AthleteCreate: 'athleteCreate',
    TrainerCreate: 'trainerCreate',
    Edit: 'edit',
    ReadOnly: 'readOnly'
}

export default class InterestsScreen extends Component {
    constructor(props) {
        super(props)
        this.handleSelection = this.handleSelection.bind(this)
        this.handleDeselection = this.handleDeselection.bind(this)
        this.handleContinuePress = this.handleContinuePress.bind(this)
        this.emptyBodyWithToken = {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        }

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.componentDidMount()
        })
        this.state = {
            loading: true,
            interests: [],
            selectedInterestsIds: [],
        }
    }

    handleSelection(interestId) {
        const ids = [...this.state.selectedInterestsIds, interestId]
        const url = API_GATEWAY_URL + 'users/' + this.props.route.params.userId + '/interests';
        const config = {
            headers: { Authorization: tokenManager.getAccessToken() },
        }
        const body = { "interest_id": interestId }

        axios.post(url, body, config)
            .then((response) => {
                console.log('handleSelection ok')
                this.setState({ selectedInterestsIds: ids })
            })
            .catch((error) => {
                console.error("handleSelection error " + error);
            })
    }

    handleDeselection(interestId) {
        const ids = this.state.selectedInterestsIds.filter(id => id !== interestId)
        const url = API_GATEWAY_URL + 'users/' + this.props.route.params.userId + '/interests';
        const body = { interest_id: interestId }
        axios.delete(url, {
            data: body,
            headers: {
                Authorization: tokenManager.getAccessToken()
            },
        })
            .then(response => {
                console.log('handleDeselection ok')
                this.setState({ selectedInterestsIds: ids })
            })
            .catch(error => {
                console.log('handleDeselection ' + error)
            })


    }

    loadInterestsTypes() {
        const url = API_GATEWAY_URL + 'training-types';
        axios.get(url, this.emptyBodyWithToken)
            .then((response) => {
                console.log('loadInterestsTypes ' + JSON.stringify(response.data));
                this.loadInterests(response.data)
            })
            .catch((error) => {
                console.error('loadInterestsTypes ' + error)
            })

    }

    loadInterests(interests) {
        const url = API_GATEWAY_URL + 'users/' + this.props.route.params.userId + '/interests';
        console.log(url)
        const config = {
            headers: { Authorization: tokenManager.getAccessToken() },
        }
        console.log(config)

        axios.get(url, config)
            .then((response) => {
                const selectedInterestsIds = response.data.map(interest => interest.id);
                console.log('selectedInterestsIds ' + selectedInterestsIds)
                this.setState({ interests: interests, selectedInterestsIds: selectedInterestsIds });
            })
            .catch((error) => {
                console.error("loadInterests error " + error);
            })
    }

    handleContinuePress() {
        if (this.state.selectedInterestsIds.length < 2)
            Alert.alert('', '¡Debés seleccionar al menos dos intereses!')
        else
            if (this.props.route.params.from == 'edit') {
                this.props.navigation.goBack();
            } else {
                this.props.navigation.replace('HomeScreen');
            } 
        
    }

    componentDidMount() {
        this.loadInterestsTypes();
        this.setState({ loading: false });
        titleManager.setTitle(this.props.navigation, "Elegir intereses", 22)
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

                        <InterestsPressableList
                            interests={this.state.interests}
                            style={{
                                marginTop: 20,
                            }}
                            onPress={this.handlePress}
                            selectedInterestsIds={this.state.selectedInterestsIds}
                            onSelection={this.handleSelection}
                            onDeselection={this.handleDeselection}
                            canEdit={true}
                        />

                        <ButtonStandard
                            title="Continuar"
                            onPress={this.handleContinuePress}
                            style={{ marginTop: 20 }}
                        />

                    </View>
                </ScrollView>
            );
        }
    }

}

class Interest extends Component {
    constructor(props) {
        super(props)
        this.handleLongPress = this.handleLongPress.bind(this)
        this.state = {
            selected: this.props.selected,
            uri: null
        }

    }

    handleLongPress() {
        if (this.props.canEdit) {
            const selected = !this.state.selected
            this.setState({ selected })

            if (selected) {
                this.props.onSelection(this.props.interest.id)
            } else {
                this.props.onDeselection(this.props.interest.id)
            }
        }
    }

    render() {
        return (
            <Card
                elevation={3}
                style={this.state.selected ? goalsStyles.cardSelected : goalsStyles.card}
                onLongPress={this.handleLongPress}
            >
                <View style={{ position: 'relative' }}>
                    {this.state.selected &&
                        <View style={goalsStyles.cardSelectedIcon}>
                            <IconButton
                                icon="check"
                                iconColor='white'
                                size={15}
                            />
                        </View>
                    }
                </View>
                <Card.Content>
                    <Text
                        variant="bodySmall"
                        numberOfLines={4}
                        style={{ color: 'white' }}
                    >
                        {this.props.interest.description}
                    </Text>
                </Card.Content>
            </Card>
        )
    }
}

class InterestsPressableList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const interests_left = this.props.interests.filter((goal, index) => index % 2 === 0);
        const interests_right = this.props.interests.filter((goal, index) => index % 2 === 1);

        return (
            <View style={[this.props.style, { flexDirection: 'row' }]}>
                <View style={{
                    width: '50%',
                    alignItems: 'center'
                }}>
                    {interests_left.map((interest) =>
                        <Interest
                            interest={interest}
                            key={interest.id}
                            selectable={true}//{this.props.selectable}
                            onSelection={this.props.onSelection}
                            onDeselection={this.props.onDeselection}
                            selectionMode={this.props.selectedInterestsIds != 0}
                            selected={this.props.selectedInterestsIds ? this.props.selectedInterestsIds.includes(interest.id) : false}
                            canEdit={true}//{this.props.canEdit}
                        />
                    )}
                </View>
                <View style={{
                    width: '50%',
                }}>
                    {interests_right.map((interest) =>
                        <Interest
                            interest={interest}
                            key={interest.id}
                            selectable={true}//{this.props.selectable}
                            onSelection={this.props.onSelection}
                            onDeselection={this.props.onDeselection}
                            selectionMode={this.props.selectedInterestsIds != 0}
                            selected={this.props.selectedInterestsIds ? this.props.selectedInterestsIds.includes(interest.id) : false}
                            canEdit={true}//{this.props.canEdit}
                        />
                    )}
                </View>
            </View>
        )
    }
}

const goalsStyles = StyleSheet.create({
    card: {
        height: 75,
        width: 150,
        margin: 15,
        borderWidth: 1,
        backgroundColor: '#21005D',
        alignItems: 'center',
        justifyContent: 'center'
    },

    cardSelected: {
        height: 75,
        width: 150,
        margin: 15,
        borderWidth: 4,
        backgroundColor: '#21005D',
        borderColor: 'white',
        elevation: 15,
    },

    cardSelectedIcon: {
        position: 'absolute',
        top: 1,
        right: 1,
        backgroundColor: '#21005D',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },

})