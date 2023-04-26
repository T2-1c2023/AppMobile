import React, { Component } from 'react';
import { View, Button, ScrollView } from 'react-native';
import { DaysInput, DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

export default class GoalScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            description: '',
            metric: '',
            days: 0,
        }
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
                <TextBox 
                    title="Métrica objetivo"
                    onChangeText={(metric) => this.setState({ metric })}
                    maxLength={100}
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



                <DividerWithLeftText 
                    text="Límite de tiempo"
                    style={{
                        marginTop: 5,
                    }}
                />
                <DaysInput 
                    onChange={(days) => this.state({ days })}
                    style={{
                        marginTop: 10,
                    }}
                />

            </View>
              
            </ScrollView>
        );
    }
}