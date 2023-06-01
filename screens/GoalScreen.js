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
    Create: 'create',
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
    
    initializeVariables() {
        let state
        switch (this.mode) {
            case Mode.Create:
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

    async handleCreatePress() {
        this.setState({ loading: true })
        console.log(tokenManager.getAccessToken());//TO_DO quitar
        const { mediaLocalUris } = this.state;

        const data = this.data

        const uploadPromises = mediaLocalUris.map((localUri) => {
            return uploadImageFirebase(localUri);
        });

        try {
            const ids = await Promise.all(uploadPromises)

            const url = API_GATEWAY_URL + 'trainers/' + data.id + '/goals'
            const body = {
                "trainer_id": data.id,
                "title": this.state.title,
                "description": this.state.description,
                "objective": this.state.metric,
                "multimedia_ids": this.initialImageIds.concat(ids)
            }
            const header = { headers: { Authorization: tokenManager.getAccessToken() } }

            const response = await axios.post(url, body, header)

            console.log('Éxito');
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }

        // TODO: mostrar alguna ventana que indique si la creación fue exitosa o no    
        this.props.navigation.goBack();
        this.setState({ loading: false })
    }

    handleCancelPress() {
        this.props.navigation.goBack();
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

                        {(this.mode == Mode.Create || this.mode == Mode.Edit) &&
                            <ConfirmationButtons
                                confirmationText={this.mode == Mode.Create? "Crear" : "Guardar cambios"}
                                cancelText="Cancelar"
                                onConfirmPress={this.mode == Mode.Create? this.handleCreatePress : this.handleSaveChangesPress}
                                onCancelPress={this.handleCancelPress}
                                style={{
                                    marginTop: 20,
                                }}
                            />
                        }
                    </View>

                </ScrollView>
            );
        }
    }
}