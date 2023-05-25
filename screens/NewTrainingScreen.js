import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { SelectList } from 'react-native-dropdown-select-list'
import LevelInput from '../src/components/LevelInput';
import { ConfirmationButtons } from '../src/styles/BaseComponents';
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Constants from 'expo-constants'

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class NewTrainingScreen extends Component {
    constructor(props) {
        super(props)
        this.handleCreatePress = this.handleCreatePress.bind(this)
        this.handleCancelPress = this.handleCancelPress.bind(this)
        this.state = {
            trainingTypes: {},
            title: '',
            description: '',
            trainingTypeId: 0,
            level: 'basic',
            trainerId: jwt_decode(this.props.route.params.trainerData).id
        }
    }

    async getTrainingsTypes() {
        const response = await axios.get(API_GATEWAY_URL + 'training-types', {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        })
        console.log(response.data);     
        return response.data
    }

    async componentDidMount() {
        console.log("navigation state " + JSON.stringify(this.props.navigation.getState()));
        const data = await this.getTrainingsTypes()

        const trainingTypes = data.map((trainingType) => {
            return {"key": trainingType.id, "value": trainingType.description}
        })

        this.setState({ trainingTypes  })
    }

    async handleCreatePress() {
        const body = {
            "trainer_id": this.state.trainerId,
            "title": this.state.title,
            "description": this.state.description,
            "type_id": this.state.trainingTypeId,
            "severity": this.levelStrToInt(this.state.level),
        }
        console.log(body);
        console.log(API_GATEWAY_URL + 'trainings')
        
        try {
            const response = await axios.post(API_GATEWAY_URL + 'trainings', body, {
                headers: {
                    Authorization: tokenManager.getAccessToken()
                }
            })    
            if (response.status === 201) {
                this.props.navigation.replace('TrainingActivitiesScreen', { trainingData: response.data, data:{id:this.state.trainerId } });
            }
        } catch (error) {
            this.handleNewTrainingError(error);
        }
    }

    handleCancelPress = async () => {
        this.props.navigation.goBack();
    }

    handleNewTrainingError(error) {
        console.log(error);//TO_DO
    }

    levelStrToInt (levelStr) {
        switch (levelStr) {
            case 'basic':
              return 1
            case 'intermediate':
              return 2
            case 'advanced':
              return 3
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

                <DividerWithLeftText
                    text="Tipo"
                    style={{
                        marginTop: 5,
                    }}
                />

                <SelectList
                    setSelected={(trainingTypeId) => this.setState({ trainingTypeId })} 
                    data={this.state.trainingTypes} 
                    save="key"
                    placeholder="Tipo de entrenamiento"
                    notFoundText="No se encontraron resultados"
                    searchPlaceholder="Buscar"
                    boxStyles={{borderRadius: 5, width: 350, marginTop: 10}}
                    inputStyles={{color: 'black'}}
                />

                <DividerWithLeftText
                    text="Nivel"
                    style={{
                        marginTop: 10,
                    }}
                />

                <LevelInput 
                    initialLevel={this.state.level}
                    setSelected={(level) => this.setState({ level })}
                    style={{
                        marginTop: 10,
                    }}
                />

                <DividerWithLeftText
                    text="Ubicación"
                    style={{
                        marginTop: 10,
                    }}
                />

                {/* TODO: reemplazar por componente de input de ubicación
                -------------------- */}
                <Text>To be implemented </Text>
                {/* -------------------- */}

                <ConfirmationButtons 
                    confirmationText="Crear entrenamiento "
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
