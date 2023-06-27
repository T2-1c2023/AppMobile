import React, { Component } from 'react';
// Visuals
import { View, Text, StyleSheet, Button } from 'react-native';
// Requests
import axios from 'axios';
import Constants from 'expo-constants';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

// Pop up that lets a trainer request to be verified with a video
export default class TrainerVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testData: props.data
        }
    }

    render() {
        const { onClose } = this.props;
        return (
          <View style={styles.popupContainer}>
            <Text>{this.state.testData}</Text>
            <Button title='Cerrar' onPress={onClose} />
          </View>
        )
    }
}

const styles = StyleSheet.create({
    popupContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    }
})