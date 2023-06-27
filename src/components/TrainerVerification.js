import React, { Component } from 'react';
// Visuals
import { View, Text, StyleSheet, Button } from 'react-native';
import { ButtonStandard } from '../styles/BaseComponents';
// Requests
import axios from 'axios';
import Constants from 'expo-constants';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

// Pop up that lets a trainer request to be verified with a video
export default class TrainerVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
    
        }
    }

    render() {
        const { onClose } = this.props;
        console.log(this.props.data)
        const fullname = this.props.data;
        return (
          <View style={styles.popupContainer}>
            <Text style={styles.title}>Solicitud de Verificación de Entrenador</Text>
            <Text style={styles.description}>Hola {fullname}!{'\n'} Por favor, seleccione un video para solicitar la verificación como entrenador:</Text>
            
            <View style={styles.stepContainer}>
              <Text style={styles.stepDescription}>Una vez enviado espere la confirmación de verificación por parte del equipo de administración.</Text>
            </View>
            <View style={styles.buttonContainer}>
              <ButtonStandard title='Cerrar' onPress={onClose} />
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    popupContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    step: {
        fontWeight: 'bold',
        marginRight: 10
    },
    stepDescription: {
        flex: 1
    },
    buttonContainer: {
        marginTop: 10,
        width: '50%',
        alignItems: 'center'
    }
})