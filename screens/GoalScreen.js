import React, { Component } from 'react';
import { View, Button, ScrollView } from 'react-native';
import { DaysInput, DividerWithLeftText, TextBox, ButtonStandard, ConfirmationButtons } from '../src/styles/BaseComponents';
import MultimediaInput from '../src/components/MultimediaInput';
import styles from '../src/styles/styles';
import axios from 'axios';
import { uploadImageFirebase } from '../services/Media';

export default class GoalScreen extends Component {
    constructor(props) {
        super(props)
        this.handleCreatePress = this.handleCreatePress.bind(this)
        this.handleCancelPress = this.handleCancelPress.bind(this)
        this.state = {
            title: '',
            description: '',
            metric: '',
            mediaLocalUris: []
        }
    }

    updateMediaUris = (uris) => {
        this.setState((prevState) => ({
            mediaLocalUris: uris
        }), () => {
            console.log('Imágenes locales cargadas (goalScreen):', this.state.mediaLocalUris);
        });
    }

    handleCreatePress() {
        // TODO: cargar datos a firebase storage y obtener ids
        const { mediaLocalUris } = this.state;

        console.log('Quiero subir: ' + mediaLocalUris);

        const uploadPromises = mediaLocalUris.map((localUri) => {
            return uploadImageFirebase(localUri);
        });

        Promise.all(uploadPromises)
            .then((ids) => {
                console.log('IDs cargadas en firebase:', ids);

                // TODO: agregar los ids cuando se actualize el back
                const body = {
                    "trainer_id": 1,
                    "title": "TEST2",
                    "description": "TEST2",
                    "objective": "TEST2",
                    "images": ids
                }
        
                axios.post(API_GATEWAY_URL + 'trainers/1/goals', body)
                    .then(function (response) {
                        console.log(response.data);
                    }).catch(function (error) {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.error('Error al cargar imágenes:' + error);
            })
    }

    handleCancelPress() {
        this.props.navigation.goBack();
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
                    text="Fotos y videos"
                    style={{
                        marginTop: 5,
                    }}
                />
                
                <MultimediaInput
                    onUpload={this.updateMediaUris}
                />

                <TextBox 
                    title="Métrica objetivo"
                    onChangeText={(metric) => this.setState({ metric })}
                    maxLength={100}
                    style={{
                        marginTop: 5,
                    }}
                />
                
                <ConfirmationButtons 
                    confirmationText="Crear "
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