import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { selectImage, downloadImage } from '../../services/Media';

export default class MultimediaInput extends Component {
    constructor(props) {
        super(props)
        this.handleUploadPress = this.handleUploadPress.bind(this)
        this.handleImagePress = this.handleImagePress.bind(this)

        this.initialImageIds = this.props.initialImageIds,
        this.state = {
            uploadedImagesUris: [],
            localImagesUris: []
        }
    }

    async componentDidMount() {
        const imageIds = this.initialImageIds
        console.log("array de ids inicial: ", imageIds)
        const imagesUris = await Promise.all(imageIds.map(async (imageId) => {
            return await downloadImage(imageId)
        }))

        console.log(imagesUris)

        this.setState({
            uploadedImagesUris: imagesUris
        })
    }

    // TODO: mostrar la imagen en grande y opción de eliminarla.
    handleImagePress = (localPath) => {
        // alert('Local Image Pressed: ' + localPath);
    }

    // TODO: mostrar la imagen en grande y opción de eliminarla.
    handleImageAlredyUploadPress = (uploadUri) => {
        // alert('Uploaded Image Pressed: ' + uploadUri);
    }

    handleUploadPress = async () => {
        const localImageUri = await selectImage();
        
        if (localImageUri != null) {
            this.setState((prevState) => ({
                localImagesUris: [...prevState.localImagesUris, localImageUri]
            }));
            this.props.onUpload(this.state.localImagesUris);
        }
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
                {!this.props.readOnly &&
                    <View style={multimediaStyles.itemContainer}>
                        {this.uploadItem()}
                    </View>
                }
                
                {this.props.readOnly && this.state.uploadedImagesUris.length == 0 &&
                    <Text style={{color: 'grey', marginTop: 50}}>No se han cargado imagenes o videos</Text>
                }

                {this.state.uploadedImagesUris.map((uploadUri) => 
                    <View key={uploadUri} style={multimediaStyles.itemContainer}>
                        <TouchableOpacity onPress={() => this.handleImageAlredyUploadPress(uploadUri)}>
                            <Image 
                                source={{ uri: uploadUri }}
                                style={multimediaStyles.containedImage}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {this.state.localImagesUris.map((localUri) => 
                    <View key={localUri} style={multimediaStyles.itemContainer}>
                        <TouchableOpacity onPress={() => this.handleImagePress(localUri)}>
                            <Image 
                                source={{ uri: localUri }}
                                style={multimediaStyles.containedImage}
                            />
                        </TouchableOpacity>
                    </View>
                )}
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