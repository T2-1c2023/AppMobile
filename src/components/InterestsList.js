import React, { Component } from 'react';
import { Text, View, StyleSheet, Keyboard, Image, TouchableOpacity, Alert} from 'react-native';
import { TextLinked, TextProfileName } from '../styles/BaseComponents';
import { TextInput } from 'react-native-paper';
import styles from '../styles/styles';

import Modal from "react-native-modal";

export default class InterestsList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={[this.props.style, {width: '100%', backgroundColor: 'green', height: 10}]}>
                
            </View>
        )
    }
}

const interestsStyles = StyleSheet.create({
    container: {

    },
})