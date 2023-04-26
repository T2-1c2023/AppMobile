import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MultimediaInput extends Component {
    constructor(props) {
        super(props)
        this.handleUploadPress = this.handleUploadPress.bind(this)
        this.handleImagePress = this.handleImagePress.bind(this)

        {/* ---------------------------------------- */ }
        this.colors = ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink', 'black', 'white', 'gray', 'brown', 'cyan', 'magenta', 'lime', 'olive', 'maroon', 'navy', 'teal', 'silver']
        {/* ---------------------------------------- */ }
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

    handleImagePress(id) {
        alert('Image Pressed with id: ' + id)
    }

    handleUploadPress() {
        alert('Upload Pressed')
    }

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
                {this.props.ids.map((id) => (
                    <View key={id} style={multimediaStyles.itemContainer}>
                        {this.item(id)}
                    </View>
                ))}
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

    }
})