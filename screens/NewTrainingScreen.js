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
import { HelperText } from 'react-native-paper';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

const MIN_TRAINING_TITLE = 2;       //TODO a definir
const MIN_TRAINING_DESCRIPTION = 2; //TODO a definir

export default class NewTrainingScreen extends Component {
    constructor(props) {
        super(props)
        this.handleCreatePress = this.handleCreatePress.bind(this)
        this.handleCancelPress = this.handleCancelPress.bind(this)
        this.isNew = this.props.route.params.isNew
        this.emptyBodyWithToken = {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        }
        this.state = {
            trainingTypes: {},
            title: '',
            description: '',
            trainingTypeId: 0,
            level: 'basic',
            trainerId: jwt_decode(this.props.route.params.trainerData).id,
            initialTitle: '',
            initialDescription: '',
            initialLevel: 'basic',
            //initialTrainingType: 1,
        }
    }

    async getTrainingsTypes() {
        const response = await axios.get(API_GATEWAY_URL + 'training-types', this.emptyBodyWithToken)
        //console.log(response.data);     
        return response.data
    }

    async componentDidMount() {
        if (!this.isNew) {
            //this.getTrainingData();
            this.loadTrainingInfo();
        }
        const data = await this.getTrainingsTypes()

        const trainingTypes = data.map((trainingType) => {
            return { "key": trainingType.id, "value": trainingType.description }
        })
        console.log(trainingTypes)

        this.setState({ trainingTypes })
    }

    loadTrainingInfo() {
        axios.get(API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId, this.emptyBodyWithToken)
            .then(response => {
                const training = response.data;
                console.log(training);//debug
                this.setState({
                    initialTitle: training.title,
                    initialDescription: training.description,
                    initialLevel: this.levelStrToInt(training.severity),
                    //TO_DO trainingTypeId: 
                });
            })
            .catch(function (error) {
                console.log('loadTrainingInfo ' + error);
            });
    }

    async handleCreatePress() {
        const body = {
            "trainer_id": this.state.trainerId,
            "title": this.state.title,
            "description": this.state.description,
            "type_id": this.state.trainingTypeId,
            "severity": this.levelStrToInt(this.state.level),
        }
        //console.log(body);
        //console.log(API_GATEWAY_URL + 'trainings')

        try {
            let response;
            if (this.isNew) {
                response = await axios.post(API_GATEWAY_URL + 'trainings', body, this.emptyBodyWithToken)
            } else {
                response = await axios.patch(API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId, body, this.emptyBodyWithToken)
            }
            console.log(response.status)
            if (response.status === 200 || response.status === 201) {
                if (this.isNew) {
                    this.props.navigation.replace('TrainingActivitiesScreen', { trainingData: response.data, data: { id: this.state.trainerId, from: 'NewTrainingScreen' } });
                } else {
                    this.props.navigation.navigate('TrainingsListScreen', { data: jwt_decode(tokenManager.getAccessToken()), type: 'created' })
                }
            }
        } catch (error) {
            this.handleNewTrainingError(error);
        }
    }

    handleCancelPress = async () => {
        this.props.navigation.goBack();
    }

    handleNewTrainingError(error) {
        console.error(error);
    }

    levelStrToInt(levelStr) {
        switch (levelStr) {
            case 'basic':
                return 1
            case 'intermediate':
                return 2
            case 'advanced':
                return 3
        }
    }

    allFieldsAreValid() {
        const { title, description, trainingTypeId } = this.state;

        const titleIsValid = title.length >= MIN_TRAINING_TITLE
        const descriptionIsValid = description.length >= MIN_TRAINING_DESCRIPTION
        const trainingTypeIdIsValid = trainingTypeId > 0

        return titleIsValid && descriptionIsValid && trainingTypeIdIsValid
    }

    titleWarningMode() {
        return this.state.title.length > 0 && this.state.title.length < MIN_TRAINING_TITLE
    }

    descriptionWarningMode() {
        return this.state.description.length > 0 && this.state.description.length < MIN_TRAINING_DESCRIPTION
    }

    trainingTypeWarningMode() {
        return this.state.title.length >= MIN_TRAINING_TITLE && this.state.description.length >= MIN_TRAINING_DESCRIPTION && this.state.trainingTypeId == 0
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
                        placeholder={this.state.initialTitle}
                        warningMode={true}
                        style={{
                            marginTop: 5,
                        }}
                    />

                    {this.titleWarningMode() &&
                        <HelperText
                            type="error"
                            style={{
                                color: 'red',
                                width: 250,
                            }}
                        >
                            El título debe ser más largo
                        </HelperText>
                    }

                    <TextBox
                        title="Descripción"
                        onChangeText={(description) => this.setState({ description })}
                        maxLength={250}
                        placeholder={this.state.initialDescription}
                        style={{
                            marginTop: 5,
                        }}
                    />

                    {this.descriptionWarningMode() &&
                        <HelperText
                            type="error"
                            style={{
                                color: 'red',
                                width: 250,
                            }}
                        >
                            La descripción debe ser más larga
                        </HelperText>
                    }

                    <DividerWithLeftText
                        text="Tipo"
                        style={{
                            marginTop: 5,
                        }}
                    />

                    {this.trainingTypeWarningMode() &&
                        <HelperText
                            type="error"
                            style={{
                                color: 'red',
                                width: 250,
                            }}
                        >
                            Debe seleccionar un tipo
                        </HelperText>
                    }

                    <SelectList
                        setSelected={(trainingTypeId) => this.setState({ trainingTypeId })}
                        data={this.state.trainingTypes}
                        save="key"
                        placeholder="Tipo de entrenamiento"
                        notFoundText="No se encontraron resultados"
                        searchPlaceholder="Buscar"
                        boxStyles={{ borderRadius: 5, width: 350, marginTop: 10 }}
                        inputStyles={{ color: 'black' }}
                    />

                    <DividerWithLeftText
                        text="Nivel"
                        style={{
                            marginTop: 10,
                        }}
                    />

                    <LevelInput
                        initialLevel={this.state.initialLevel}
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
                        confirmationText={this.isNew ? "Crear entrenamiento" : "Editar entrenamiento"}
                        cancelText="Cancelar"
                        onConfirmPress={this.handleCreatePress}
                        onCancelPress={this.handleCancelPress}
                        disabled={!this.allFieldsAreValid()}
                        style={{
                            marginTop: 20,
                        }}
                    />
                </View>

            </ScrollView>
        );
    }
}
