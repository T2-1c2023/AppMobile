import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { uploadImage, downloadImage } from '../services/Media'; 

class ImageUploadTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            imageId: null,
            imageURI: null
        }
    }

    componentDidMount() {
        const data = {
            fullname: 'Nombre',
            mail: 'un mail',
            is_athlete: true,
            is_trainer: false
        }

        this.setState({ data: data })
    }

    handleImageUpload = async () => {
        const imageId = await uploadImage();
        console.log('Id foto firebase:' + imageId);
        this.setState({ imageId: imageId});

        // Acá guardaría el id de firebase en el back end
    }

    handleImageDownload = async () => {
        console.log('Check:' + this.state.imageId);
        const uri = await downloadImage(this.state.imageId);
        console.log('Link descarga:' + uri);
        this.setState({ imageURI: uri });
    }

    getRole() {
        const { is_trainer, is_athlete } = this.state.data;
        if (is_trainer && is_athlete) {
          return 'Trainer and Athlete';
        } else if (is_trainer) {
          return 'Trainer';
        } else if (is_athlete) {
          return 'Athlete';
        } else {
          return 'N/A';
        }
    }

    // TODO: hace que todos vuelvan al homescreen al cancelar
    handleGoalScreen = async () => {
        this.props.navigation.navigate('GoalScreen');
    }

    handleGoalsListScreen = async () => {
        this.props.navigation.navigate('GoalsListScreen');
    }

    handleNewTrainingScreen = async () => {
        this.props.navigation.navigate('NewTrainingScreen');
    }

    render() {
        const { fullname, mail } = this.state.data || {};
        return (
            <View style={styles_hs.container}>
                {this.state.data && (
                    <>
                        <Text style={styles_hs.text}>Welcome {fullname}!</Text>
                        <Text style={styles_hs.text}>Email: {mail}</Text>
                        <Text style={styles_hs.text}>Role: {this.getRole()}</Text>
                    </>
                )}

                <Button 
                    title="Crear Meta (entrenador)"
                    onPress={this.handleGoalScreen}
                />

                <Button 
                    title="Listado de Metas (entrenador)"
                    onPress={this.handleGoalsListScreen}
                />

                <Button 
                    title="Nuevo Entrenamiento"
                    onPress={this.handleNewTrainingScreen}
                />

                {this.state.imageURI && <Image source={{ uri: this.state.imageURI }} style={{ width: 200, height: 200 }} />}

                <Button 
                    title="Subir imágen"
                    onPress={this.handleImageUpload}
                >
                </Button>

                <Button
                    title="Descargar imagen"
                    onPress={this.handleImageDownload}
                >
                </Button>
            </View>
        );
    }
}

export default ImageUploadTest;

const styles_hs = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
    }
});
