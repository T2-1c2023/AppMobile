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
            trainingTypeId: '',
            level: 'basic',
            trainerData: {},
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
        const encoded_jwt = tokenManager.getAccessToken();
        const trainerData = jwt_decode(encoded_jwt);
        this.setState({ trainerData });
        
        const data = await this.getTrainingsTypes()

        const trainingTypes = data.map((trainingType) => {
            return {"key": trainingType.id, "value": trainingType.description}
        })

        this.setState({ trainingTypes  })
    }

    async handleCreatePress() {
        const body = {
            "trainer_id": this.state.trainerData.id,
            "title": this.state.title,
            "description": this.state.description,
            "type_id": this.state.trainingTypeId,
            "level": this.state.level,
        }

        await axios.post(API_GATEWAY_URL + 'trainings', body, {
                headers: {
                    Authorization: tokenManager.getAccessToken()
                }
            })
            .then(async (response) => {
                if (response.status === 201) {
                    this.props.navigation.navigate('TrainingActivitiesScreen', { trainingData: response.data, data:{id:this.state.trainerData.id } });
                }
            })
            .catch((error) => {
                this.handleNewTrainingError(error);
            }
        );
    }

    handleCancelPress = async () => {
        this.props.navigation.goBack();
    }

    handleNewTrainingError(error) {
        console.log(error);//TO_DO
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
