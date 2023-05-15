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
            console.log('Imagenes locales cargadas (goalScreen):', this.state.mediaLocalUris);
        });
    }

    async handleCreatePress() {
        const { mediaLocalUris } = this.state;
        const data = this.props.route.params.data;

        const uploadPromises = mediaLocalUris.map((localUri) => {
            return uploadImageFirebase(localUri);
        });

        await Promise.all(uploadPromises)
            .then((ids) => {
                console.log('IDs cargadas en firebase:', ids);

                const body = {
                    "trainer_id": data.id,
                    "title": this.state.title,
                    "description": this.state.description,
                    "objective": this.state.metric,
                    "multimedia_ids": ids
                }

                console.log('Cargando Meta con: ');
                console.log(body);

                const url = "https://trainings-g6-1c-2023.onrender.com/trainers/" + data.id + "/goals";
        
                axios.post(url, body)
                    .then(function (response) {
                        console.log('Éxito');
                        console.log(response.data);
                    }).catch(function (error) {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.error('Error al cargar imágenes:' + error);
            })

        // TODO: mostrar alguna ventana que indique si la creación fue exitosa o no    
        this.props.navigation.goBack();
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