import React, { Component } from 'react';
import { Text, View, StyleSheet, Keyboard, Image, TouchableOpacity, Alert } from 'react-native';
import { TextLinked, TextProfileName } from '../styles/BaseComponents';
import { TextInput, Chip } from 'react-native-paper';
import styles from '../styles/styles';

import Modal from "react-native-modal";

const INTERESTS_PER_ROW = 3;

export default class InterestsList extends Component {
    constructor(props) {
        super(props)
    }

    renderInterest(interest, key) {
        return (
            <Chip 
                key={key}
                mode='flat'
                style={interestsStyles.interestChip}
                textStyle={interestsStyles.interestChipText}
            >
                {interest.description}
            </Chip>

        )
    }

    renderInterestSet(interestSet, key) {
        return (
            <View key={key} style={{ flexDirection: 'row' }}>
                {interestSet.map((interest, key) =>
                    this.renderInterest(interest, key)
                )}
            </View>
        )
    }

    getInterestsSets(interests) {
        const interestSets = []
        let i = 0

        while (i < interests.length) {
            interestSets.push(interests.slice(i, i + INTERESTS_PER_ROW))
            i += INTERESTS_PER_ROW
        }

        return interestSets
    }

    render() {
        const { interests } = this.props;
        const interestSets = this.getInterestsSets(interests)
        return (
            <View style={[this.props.style, interestsStyles.container]}>
                {interestSets.map((interestSet, index) =>
                    this.renderInterestSet(interestSet, index)
                )}
            </View>
        )
    }
}

const interestsStyles = StyleSheet.create({
    container: { 
        width: '100%',
        alignItems: 'center' 
    },

    interestChip: {
        margin: 5,
        backgroundColor: '#21005D',
    },

    interestChipText: {
        color: 'white',
        fontSize: 12,
    },
})