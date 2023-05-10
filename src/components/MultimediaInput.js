import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { selectImage } from '../../services/Media';

export default class MultimediaInput extends Component {
    constructor(props) {
        super(props)
        this.handleUploadPress = this.handleUploadPress.bind(this)
        this.handleImagePress = this.handleImagePress.bind(this)

        {/* ---------------------------------------- */ }
        this.colors = ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink', 'black', 'white', 'gray', 'brown', 'cyan', 'magenta', 'lime', 'olive', 'maroon', 'navy', 'teal', 'silver']
        {/* ---------------------------------------- */ }
        {/* TODO: sacar esto */}
        this.state = {
            localImagesUris: [] 
        }
    }

    getImageById(id) {

        {/* Reemplazar por lógica de muestreo de imagen por id */ }
        {/* ---------------------------------------- */ }
        const index = parseInt(id);
        return this.colors[index];
        {/* ---------------------------------------- */ }
    }

    item(id) {
        return (
            <View style={multimediaStyles.item}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => this.handleImagePress(id)}
                >
                    {/* Reemplazar por lógica de muestreo de imagen por id */}
                    {/* ---------------------------------------- */}

                    <View style={{
                        flex: 1,
                        backgroundColor: this.getImageById(id),
                        borderBottomEndRadius: 10,
                        borderTopEndRadius: 10,
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                    }}
                    >
                    </View>

                    {/* ---------------------------------------- */}
                </TouchableOpacity>
            </View>
        )
    }

    // TODO: mostrar la imagen en grande.
    handleImagePress = (localPath) => {
        alert('Image Pressed with id: ' + localPath)
    }

    // TODO: esto no debería subir la imagen a firebase. Es temporal. El usuario debería poder borrarlo fácil
    handleUploadPress = async () => {
        const localImageUri = await selectImage();
        console.log('Cargando imagen:' + localImageUri);
        // TODO: cargar en un array que sea accedido tanto desde acá como desde GoalScreen
        this.setState((prevState) => ({
            localImagesUris: [...prevState.localImagesUris, localImageUri]
        }), () => {
            console.log('Imagenes locales cargadas:', this.state.localImagesUris);
        });
    };

    uploadItem() {
        return (
            <TouchableOpacity onPress={this.handleUploadPress}>
                <View style={multimediaStyles.uploadItem}>
                    <Icon name="upload" size={30} color="grey" />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <ScrollView horizontal style={multimediaStyles.container}>
                <View style={multimediaStyles.itemContainer}>
                    {this.uploadItem()}
                </View>
                {
                    // TODO: acá tendría que mostrar las fotos con uri local y subirlas todas
                    // cuando se cree la meta (tengo que retornar un array de uris a GoalScreen)
                    this.state.localImagesUris.map((localUri) => 
                        <View key={localUri} style={multimediaStyles.itemContainer}>
                            <TouchableOpacity onPress={() => this.handleImagePress(localUri)}>
                                <Image 
                                    source={{ uri: localUri }} 
                                    style={multimediaStyles.containedImage}
                                />
                            </TouchableOpacity>
                        </View>
                    )
                }
            </ScrollView>
        )
    }
}

const multimediaStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 130,
    },

    itemContainer: {
        height: 130,
        width: 130,
        alignItems: 'center',
        justifyContent: 'center',
    },

    uploadItem: {
        backgroundColor: 'transparent',
        height: 100,
        width: 100,
        borderBottomEndRadius: 10,
        borderTopEndRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
    },

    item: {
        height: 100,
        width: 100,
        borderBottomEndRadius: 10,
        borderTopEndRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        borderWidth: 1,
    },

    containedImage: {
        width: 100, 
        height: 100, 
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    }
})