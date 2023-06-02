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
    
    loadExistingGoalInfo() {
        this.goalId = this.props.route.params.goalData.id
        
        let url

        if (this.userData.is_trainer)
            url = API_GATEWAY_URL + "goals/" + this.goalId
        if (this.userData.is_athlete)
            url = API_GATEWAY_URL + "athletes/" + this.userData.id + "/personal-goals/" + this.goalId

        console.log('url:', url);

        axios.get(url, { headers: { Authorization: tokenManager.getAccessToken() } })
            .then((response) => {
                console.log('Éxito');
                console.log(response.data);

                const goalData = response.data
                this.setExistingGoalState(goalData)
            })
            .catch((error) => {
                console.log(error);
            }
        )
    }

    setExistingGoalState(goalData) {
        if (this.mode != Mode.ReadOnly && this.mode != Mode.Edit)
            throw new Error('Should not need to set existing goal state for this mode');


        const creatorId = goalData.trainer_id? goalData.trainer_id : goalData.creator_id
        this.setState({
            creatorId: creatorId,
            goalId: goalData.id,
            title: goalData.title,
            description: goalData.description,
            objective: goalData.objective,
        }, 
            this.validateAndSetEditHeader(creatorId)
        )

        if (this.mode === Mode.Edit)
            this.setTitle("Editar meta", goalData.title)
        if (this.mode === Mode.ReadOnly)
            this.setTitle("Meta", goalData.title)
    }

    constructor(props) {
        super(props)
        this.handleCreatePress = this.handleCreatePress.bind(this)
        this.handleCancelPress = this.handleCancelPress.bind(this)
        this.onPressSaveChanges = this.onPressSaveChanges.bind(this)

        this.props = props

        this.userData = props.route.params.userData
        this.goalData = props.route.params.goalData
        this.goalCompleted = props.route.params.goalCompleted
        console.log("goalData: " + JSON.stringify(this.goalData))
        console.log("userData: " + JSON.stringify(this.userData))

        this.mode = props.route.params.mode
        console.log('GoalScreen mode:', this.mode);

        this.state = {
            loading: true,
            creatorId:"",
            title: "",
            description: "",
            objective: "",
            mediaLocalUris: [],
        }
        this.initialImageIds = this.goalData? 
            (this.goalData.multimedia_ids? this.goalData.multimedia_ids : [])
            : 
            []

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.componentDidMount()
        })
    }

    isOwner(creatorId) {

        console.log('this.userData.id:', this.userData.id);
        console.log('this.state.creatorId:', creatorId);

        return this.userData.id == creatorId
    }

    componentDidMount() {
        
        if (this.mode === Mode.Edit || this.mode === Mode.ReadOnly)
            this.loadExistingGoalInfo()
        
        this.setState({ loading: false })
    }

    updateMediaUris = (uris) => {
        this.setState((prevState) => ({
            mediaLocalUris: uris
        }), () => {
            console.log('Imágenes locales cargadas (goalScreen):', this.state.mediaLocalUris);
        });
    }

    validateAndSetEditHeader(creatorId) {
        if ((this.mode === Mode.ReadOnly) && this.isOwner(creatorId) && !this.goalCompleted) {
            this.props.navigation.setOptions({
                headerRight: () => (
                    <IconButton
                        icon={'pencil'}
                        iconColor='#21005D'
                        size={30}
                        onPress={() => this.props.navigation.replace('GoalScreen', { userData: this.userData, goalData: this.goalData, mode: Mode.Edit })} />
                ),
            });
        }
    }

    getPatchUrl() {
        const urlTrainer = API_GATEWAY_URL + "goals/" + this.goalId
        const urlAthlete = API_GATEWAY_URL + "athletes/" + this.userData.id + "/personal-goals/" + this.goalId
        if (this.mode === Mode.Edit) 
            return this.userData.is_trainer? urlTrainer : urlAthlete
        else
            throw new Error('Should not need a put url for this mode')
    }

    getPostUrl() {
        switch (this.mode) {
            case Mode.TrainerCreate:
                return API_GATEWAY_URL + "trainers/" + this.userData.id + "/goals"
            
            case Mode.AthleteCreate:
                return API_GATEWAY_URL + "athletes/" + this.userData.id + "/personal-goals"

            default:
                throw new Error('Should not need a post url for this mode');
        }
    }

    async sendPutRequest(newMultimediaIds) {
        const url = this.getPatchUrl()
        const body = {
            "title": this.state.title,
            "description": this.state.description,
            "objective": this.state.objective,
            "multimedia_ids": this.initialImageIds.concat(newMultimediaIds)
        }
        console.log('body del put:', body)
        const header = { headers: { Authorization: tokenManager.getAccessToken() } }
        console.log('putting in url: ', url);

        await axios.patch(url, body, header)
    }

    async sendPostRequest(multimediaIds) {
        const url = this.getPostUrl()
        const body = {
            "title": this.state.title,
            "description": this.state.description,
            "objective": this.state.objective,
            "multimedia_ids": multimediaIds
        }
        const header = { headers: { Authorization: tokenManager.getAccessToken() } }
        console.log('posting in url: ', url);
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

    async onPressSaveChanges() {
        this.setState({ loading: true })

        try {
            console.log('this.initialImageIds:', this.initialImageIds);
            console.log('this.state.mediaLocalUris:', this.state.mediaLocalUris);
            console.log('this.state' + this.state)
            const multimediaIds = await this.getMultimediaIds()
            console.log('new multimediaIds:', multimediaIds);
            await this.sendPutRequest(multimediaIds)
        } catch (error) {
            console.log(error);
        }

        this.props.navigation.goBack();
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
                onConfirmPress={creationMode? this.handleCreatePress : this.onPressSaveChanges}
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
                            onChangeText={(objective) => this.setState({ objective })}
                            value={this.state.objective}
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