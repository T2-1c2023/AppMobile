import React, { Component } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'

export default class ProfileInput extends Component {
    constructor(props) {
        super(props)
        this.handleTrainerPress = this.handleTrainerPress.bind(this)
        this.handleAthletePress = this.handleAthletePress.bind(this)
        this.onChange = this.onChange.bind(this)
        this.state = {
            trainer: false,
            athlete: false,
        }
        this.multiSelect = this.props.multiSelect
    }

    onChange = () => {
        this.props.onChange(this.state)
    }

    handleTrainerPress = () => {
        let athlete = this.state.athlete
        if (this.multiSelect)
            athlete = false
        let trainer = !this.state.trainer
        this.setState({ 'trainer': trainer, 'athlete': athlete }, this.onChange)
    }

    handleAthletePress = () => {
        let trainer = this.state.trainer
        if (this.multiSelect)
            trainer = false
        let athlete = !this.state.athlete
        this.setState({ 'athlete': athlete, 'trainer': trainer }, this.onChange)
    }

    render() {
        return (
            <View style={[{ flexDirection: 'row', width: 350, height: 220 }, this.props.style]}>
                <View
                    style={
                        this.state.trainer ?
                            profileTypeStyles.profileContainerSelected
                            :
                            profileTypeStyles.profileContainerUnselected
                    }
                >
                    <TouchableOpacity onPress={this.handleTrainerPress}>
                        <Image
                            source={require('../../assets/images/trainer.png')}
                            style={{
                                aspectRatio: 544 / 668,
                                maxHeight: 140,
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={
                        this.state.athlete ?
                            profileTypeStyles.profileContainerSelected
                            :
                            profileTypeStyles.profileContainerUnselected
                    }
                >
                    <TouchableOpacity onPress={this.handleAthletePress}>
                        <Image
                            source={require('../../assets/images/athlete.png')}
                            style={{
                                aspectRatio: 424 / 636,
                                maxHeight: 140,

                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const profileTypeStyles = StyleSheet.create({
    profileContainerUnselected: {
        flex: 0.5,
        backgroundColor: '#C2C3C2',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderStyle: 'solid',
    },
    profileContainerSelected: {
        flex: 0.5,
        backgroundColor: '#7BA2DC',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderStyle: 'solid',
    },
})