import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { DividerWithMiddleText } from '../styles/BaseComponents';
import { IconButton, Divider } from 'react-native-paper';
import { TextBox } from '../styles/BaseComponents';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarsScore from './StarsScore';


class Training extends Component {
    constructor(props) {
        super(props)
        this.handleTrainingPress = this.handleTrainingPress.bind(this)
    }

    handleTrainingPress() {
        this.props.onTrainingPress(this.props.training.id)
    }

    getSeverityIcon(severity) {
        switch (severity) {
            case 'basic':
                return require('../../assets/images/level-basic.png')
            case 'intermediate':
                return require('../../assets/images/level-intermediate.png')
            case 'advanced':
                return require('../../assets/images/level-advanced.png')
            default:
                return require('../../assets/images/level-basic.png')
        }
    }

    render = () => {
        const training = this.props.training
        return (
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={this.handleTrainingPress}
            >
            <View style={trainingStyles.trainingContainer}>
                
                {/* type and severity */}
                <View style={{ flexDirection: 'row' }}>
                    <Text 
                        style={trainingStyles.typeText}
                    >
                        {training.type}
                    </Text>
                    <Image 
                        source={this.getSeverityIcon(training.severity)}
                        style={trainingStyles.severityIcon}
                    />
                </View>

                {/* divider */}
                <View style={{ height: 1, backgroundColor: 'grey'}} />

                {/* title and score */}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={trainingStyles.titleText} multiline>
                        {training.title}
                    </Text>

                    <View style={{flexGrow: 1,flexDirection: 'row'}}>
                    
                    </View>
                    <StarsScore
                        score={training.score}
                        style={{
                            alignSelf: 'flex-start',
                            marginRight: 3,
                        }}
                    />
                </View>

                {/* description */}
                <Text style={trainingStyles.descriptionText} multiline>
                    {training.description}
                </Text>

                {/* end-divider */}
                <View style={{ height: 2, backgroundColor: 'grey'}} />
            </View>
            </TouchableOpacity>
        )
    }
}

export default class TrainingsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render = () => {
        return (
            <View style={[this.props.style,{ width: '100%'}]}>
                {this.props.trainings.map((training) => {
                    return (
                        <Training
                            key={training.id}
                            training={training}
                            onTrainingPress={(training_id) => this.props.onTrainingPress(training_id)}
                        />
                    )
                })}
            </View>
        )
    }
}

const trainingStyles = StyleSheet.create({
    trainingContainer: {
        flex:1,
        height: 100,
    },

    typeText: {
        flexGrow: 1,
        alignSelf: 'flex-end',
        fontSize: 14,
        marginLeft: 5,
    },

    severityIcon: {
        maxWidth: 50,
        aspectRatio: 479/239,
        marginRight: 8,
        marginBottom: 1,
        justifyContent: 'flex-end',
    },

    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        width: '70%',
    },

    descriptionText: {
        fontSize: 16,
        // color: 'grey',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 15,
    },
})