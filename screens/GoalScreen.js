import React, { Component } from 'react';
import { View, Button, ScrollView } from 'react-native';
import { DaysInput, DividerWithLeftText, TextBox, ButtonStandard, ConfirmationButtons } from '../src/styles/BaseComponents';
import MultimediaInput from '../src/components/MultimediaInput';
import styles from '../src/styles/styles';
import axios from 'axios';

export default class GoalScreen extends Component {
    constructor(props) {
        super(props)
        this.handleCreatePress = this.handleCreatePress.bind(this)
        this.handleCancelPress = this.handleCancelPress.bind(this)
        this.state = {
            title: '',
            description: '',
            metric: '',
        }
    }

    handleCreatePress() {
        const body = {
            "trainer_id": 1,
            "title": "TEST2",
            "description": "TEST2",
            "objective": "TEST2"
        }

        axios.post('https://trainings-g6-1c-2023.onrender.com/trainers/1/goals', body)
            .then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
                console.log(error);
            });
    }

    handleCancelPress() {
        alert('Cancel pressed')
    }

    render() {

        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>
                <TextBox 
                    title="Título"
                    onChangeText={(title) => this.setState({ title })}
                    maxLength={60}
                    style={{
                        marginTop: 5,
                    }}
                />

                <TextBox 
                    title="Descripción"
                    onChangeText={(description) => this.setState({ description })}
                    maxLength={250}
                    style={{
                        marginTop: 5,
                    }}
                />

                <DividerWithLeftText 
                    text="Fotos y videos"
                    style={{
                        marginTop: 5,
                    }}
                />

                <MultimediaInput
                    ids={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
                />

                <TextBox 
                    title="Métrica objetivo"
                    onChangeText={(metric) => this.setState({ metric })}
                    maxLength={100}
                    style={{
                        marginTop: 5,
                    }}
                />

                {/* <DividerWithLeftText 
                    text="Límite de tiempo"
                    style={{
                        marginTop: 5,
                    }}
                /> */}

                {/* <DaysInput 
                    onChange={(days) => this.state({ days })}
                    style={{
                        marginTop: 10,
                    }}
                /> */}
                
                <ConfirmationButtons 
                    confirmationText="Crear "
                    cancelText="Cancelar"
                    onConfirmPress={this.handleCreatePress}
                    onCancelPress={this.handleCancelPress}
                    style={{
                        marginTop: 20,
                    }}
                />
            </View>
              
            </ScrollView>
        );
    }
}