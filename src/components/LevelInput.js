import React, { Component } from 'react';
import { Avatar, Button, Card, Text, IconButton } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';


export default class LevelInput extends Component {
    constructor(props) {
        super(props)
        this.handleMinusPress = this.handleMinusPress.bind(this)
        this.handlePlusPress = this.handlePlusPress.bind(this)
        this.state = {
            level: this.props.initialLevel,
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

    smallerLevelSelected() {
        return this.state.level === 'basic'
    }

    biggerLevelSelected() {
        return this.state.level === 'advanced'
    }

    handleMinusPress() {
        const DescendTransitions = {
            basic: 'basic',
            intermediate: 'basic',
            advanced: 'intermediate',
        }

        const newLevel = DescendTransitions[this.state.level]

        this.setState({
            level: newLevel
        })

        this.props.setSelected(newLevel)
    }

    handlePlusPress() {
        const AscendTransitions = {
            basic: 'intermediate',
            intermediate: 'advanced',
            advanced: 'advanced',
        }

        const newLevel = AscendTransitions[this.state.level]

        this.setState({
            level: newLevel
        })

        this.props.setSelected(newLevel)
    }

    render() {

        const levelNames = {
            basic: 'Básico',
            intermediate: 'Intermedio',
            advanced: 'Avanzado',
        }

        return (
            <View style={[this.props.style,{flexDirection: 'row', width: '100%' }]}>
                <Image 
                    source={this.getLevelIcon()}
                    style={levelStyles.levelIcon}
                />
                
                <Text style={levelStyles.levelName}>
                    {levelNames[this.state.level]}
                </Text>
                
                <IconButton
                    icon="minus"
                    iconColor='white'
                    size={25}
                    style={[
                        {marginRight: 10},
                        this.smallerLevelSelected()? levelStyles.blockedButton : levelStyles.unblockedButton
                    ]}
                    disabled = {this.smallerLevelSelected()}
                    onPress={this.handleMinusPress}
                />
                
                <IconButton
                    icon="plus"
                    iconColor='white'
                    size={25}
                    style={[
                        {marginRight: 20},
                        this.biggerLevelSelected()? levelStyles.blockedButton : levelStyles.unblockedButton
                    ]}
                    disabled = {this.biggerLevelSelected()}
                    onPress={this.handlePlusPress}
                />
            </View>
        )               
    }
}

const levelStyles = StyleSheet.create({
    levelIcon: {
        maxWidth: 80,
        aspectRatio: 479/239,
        alignSelf: 'center',
        marginLeft: 20,
    },

    levelName: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginLeft: 20,
        justifyContent: 'flex-end',
        flexGrow: 1, 
        color: 'black',

    },

    blockedButton: {
        backgroundColor: 'grey',
        justifyContent: 'flex-end',
    },

    unblockedButton: {
        backgroundColor: '#21005D',
    }
})