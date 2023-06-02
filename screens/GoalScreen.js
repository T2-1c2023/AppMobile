import React, { Component } from 'react';
import { View, Button, ScrollView, ActivityIndicator, Text } from 'react-native';
import { DaysInput, DividerWithLeftText, TextBox, ButtonStandard, ConfirmationButtons } from '../src/styles/BaseComponents';
import MultimediaInput from '../src/components/MultimediaInput';
import styles from '../src/styles/styles';
import axios from 'axios';
import { uploadImageFirebase } from '../services/Media';
import Constants from 'expo-constants'
import { tokenManager } from '../src/TokenManager';
import { IconButton } from 'react-native-paper';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export const Mode = {
    AthleteCreate: 'athleteCreate',
    TrainerCreate: 'trainerCreate',
    Edit: 'edit',
    ReadOnly: 'readOnly'
}

// endpoint athlete create
// const postUrl = API_GATEWAY_URL + "athletes/" + this.id + "/personal-goals"

export default class GoalScreen extends Component {
    setTitle(title, subtitle) {
        this.props.navigation.setOptions({headerTitle: () => (
            <Text numberOfLines={2} style={{ fontSize: 16, textAlign: 'center' }}>
              {title} 
              {'\n'}
              {subtitle}
            </Text>
          )})
    }
    
    initializeVariables() {
        let state
        switch (this.mode) {
            case Mode.AthleteCreate:
            case Mode.TrainerCreate:
                state = {
                    title: '',
                    description: '',
                    metric: '',
                    mediaLocalUris: [],
                    loading: true,
                }
                this.initialImageIds = []
                break;
            case Mode.ReadOnly:
                let goalInfo = this.data;
                state = {
                    loading: true,
                    goalId: goalInfo.id,
                    title: goalInfo.title,
                    description: goalInfo.description,
                    metric: goalInfo.objective,
                    mediaLocalUris: [],
                }
                this.initialImageIds = goalInfo.multimedia_ids
                this.setTitle("Meta", goalInfo.title)
                break;
            case Mode.Edit:
                let goalInfo2 = this.data;
                state = {
                    loading: true,
                    goalId: goalInfo2.id,
                    title: goalInfo2.title,
                    description: goalInfo2.description,
                    metric: goalInfo2.objective,
                    mediaLocalUris: [],
                }
                this.initialImageIds = goalInfo2.multimedia_ids
                this.setTitle("Editar meta", goalInfo2.title)
                break;
            default:
                throw new Error('Invalid mode');
                break;
        }
        this.state = state
    }

    constructor(props) {
        super(props)

        this.props = props
        this.data = props.route.params.data
        this.mode = props.route.params.mode
        this.postUrl = this.props.postUrl

        console.log('GoalScreen mode:', this.mode);
        console.log('GoalScreen data:', this.data);

        this.handleCreatePress = this.handleCreatePress.bind(this)
        this.handleCancelPress = this.handleCancelPress.bind(this)
        this.initializeVariables()
    }

    isOwner() {
        // console.log('trainer_id:', this.data.trainer_id);
        // console.log('tokenManager.getUserId():', tokenManager.getUserId());
        // return this.data.trainer_id === tokenManager.getUserId()
        return true
    }

    componentDidMount() {
        this.setState({ loading: false })
        if ((this.mode === Mode.ReadOnly) && this.isOwner()) {
            this.props.navigation.setOptions({
                headerRight: () => (
                    <IconButton
                        icon={'pencil'}
                        iconColor='#21005D'
                        size={30}
                        onPress={() => this.props.navigation.push('GoalScreen', { data: this.data, mode: Mode.Edit })}
                    />
                ),
            })
        }
    }

    updateMediaUris = (uris) => {
        this.setState((prevState) => ({
            mediaLocalUris: uris
        }), () => {
            console.log('Imágenes locales cargadas (goalScreen):', this.state.mediaLocalUris);
        });
    }

    async handleSaveChangesPress() {
        alert('to be implemented')
    }

    getPostUrl() {
        switch (this.mode) {
            case Mode.TrainerCreate:
                return API_GATEWAY_URL + "trainers/" + this.data.id + "/goals"
            
            case Mode.AthleteCreate:
                return API_GATEWAY_URL + "athletes/" + this.data.id + "/personal-goals"

            default:
                throw new Error('Should not need a post url for this mode');
        }
    }

    async sendPostRequest(multimediaIds) {
        const url = this.getPostUrl()
        const body = {
            "title": this.state.title,
            "description": this.state.description,
            "objective": this.state.metric,
            "multimedia_ids": multimediaIds
        }
        const header = { headers: { Authorization: tokenManager.getAccessToken() } }
        const response = await axios.post(url, body, header)

        console.log('Éxito');
        console.log(response.data);
    }

    async getMultimediaIds() {
        const uploadPromises = this.state.mediaLocalUris.map((localUri) => {
            return uploadImageFirebase(localUri);
        });
        return Promise.all(uploadPromises)
    }

    async handleCreatePress() {
        this.setState({ loading: true })

        try {
            const multimediaIds = await this.getMultimediaIds()
            await this.sendPostRequest(multimediaIds)
        } catch (error) {
            console.log(error);
        }
   
        this.props.navigation.goBack();
        this.setState({ loading: false })
    }

    handleCancelPress() {
        this.props.navigation.goBack();
    }

    shouldRenderConfirmationButtons() {
        return this.mode === Mode.AthleteCreate || this.mode === Mode.TrainerCreate || this.mode === Mode.Edit
    }

    renderConfirmationButtons() {
        const creationMode = this.mode === Mode.AthleteCreate || this.mode === Mode.TrainerCreate

        return (
            <ConfirmationButtons
                confirmationText={creationMode? "Crear" : "Guardar cambios"}
                cancelText="Cancelar"
                onConfirmPress={creationMode? this.handleCreatePress : this.handleSaveChangesPress}
                onCancelPress={this.handleCancelPress}
                style={{
                    marginTop: 20,
                }}
            />
        )
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#21005D" />
                    <Text style={{ marginTop: 30 }}>Cargando ...</Text>
                </View>
            )
        } else {
            return (
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    style={styles.scrollView}
                >

                    <View style={styles.container}>
                        <TextBox
                            title="Título"
                            onChangeText={(title) => this.setState({ title })}
                            value={this.state.title}
                            nonEditable={this.mode === Mode.ReadOnly || this.mode === Mode.Edit}
                            maxLength={60}
                            style={{
                                marginTop: 5,
                            }}
                        />

                        <TextBox
                            title="Descripción"
                            onChangeText={(description) => this.setState({ description })}
                            value={this.state.description}
                            nonEditable={this.mode === Mode.ReadOnly}
                            maxLength={250}
                            style={{
                                marginTop: 5,
                            }}
                        />

                        <DividerWithLeftText
                            text="Fotos y videos"
                            style={{
                                marginTop: 5,
                            }}
                        />

                        <MultimediaInput
                            onUpload={this.updateMediaUris}
                            initialImageIds={this.initialImageIds}
                            readOnly={this.mode === Mode.ReadOnly}
                        />

                        <TextBox
                            title="Métrica objetivo"
                            onChangeText={(metric) => this.setState({ metric })}
                            value={this.state.metric}
                            nonEditable={this.mode === Mode.ReadOnly || this.mode === Mode.Edit}
                            maxLength={100}
                            style={{
                                marginTop: 5,
                            }}
                        />

                        {this.shouldRenderConfirmationButtons() && 
                            this.renderConfirmationButtons()
                        }
                    </View>

                </ScrollView>
            );
        }
    }
}