import React, { Component } from 'react';
import { View, Button, ScrollView } from 'react-native';
import { DaysInput, DividerWithLeftText, TextBox, ButtonStandard, ConfirmationButtons } from '../src/styles/BaseComponents';
import MultimediaInput from '../src/components/MultimediaInput';
import styles from '../src/styles/styles';

import { Searchbar, IconButton } from 'react-native-paper';
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';

export default class GoalsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handleCreatePress = this.handleCreatePress.bind(this)
        this.handleCancelPress = this.handleCancelPress.bind(this)
        this.state = {
            title: '',
            description: '',
            metric: '',
            days: 0,
        }
    }

    handleCreatePress() {
        console.log('Create pressed')
    }

    handleCancelPress() {
        console.log('Cancel pressed')
    }

    render() {

        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>
                
                <SearchInputWithIcon
                    style={{
                        marginTop: 20,
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