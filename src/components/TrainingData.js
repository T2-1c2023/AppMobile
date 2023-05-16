import React, { Component } from 'react';
import { Avatar, Button, Card, Text, IconButton } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';


export default class TrainingData extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }   
    }

    getLevelIcon() {
        switch (this.state.level) {
            case 'basic':
                return require('../../assets/images/level-basic.png')
            case 'intermediate':
                return require('../../assets/images/level-intermediate.png')
            case 'advanced':
                return require('../../assets/images/level-advanced.png')
            default:
                return require('../../assets/images/login-header.png')
        }
    }

    render() {

        const levelNames = {
            basic: 'Básico',
            intermediate: 'Intermedio',
            advanced: 'Avanzado',
        }

        return (
            <View style={[this.props.style,{flexDirection: 'row', width: '100%' }]}>
                <Text>To be implemented</Text>
            </View>
        )               
    }
}

const dataStyles = StyleSheet.create({
    
})