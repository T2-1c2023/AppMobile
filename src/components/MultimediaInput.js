import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

export default class MultimediaInput extends Component {
    constructor(props) {
        super(props)
        this.colors = ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink', 'black', 'white', 'gray', 'brown', 'cyan', 'magenta', 'lime', 'olive', 'maroon', 'navy', 'teal', 'silver']
    }

    getImageById(id) {
        const index = parseInt(id);
        return this.colors[index];
    }

    item(id) {
        return (
            <View style={{
                backgroundColor: this.getImageById(id),
                height: 100,
                width: 100
            }}>
                
            </View>
        )
    }

    uploadItem() {
        return (
            <View style={{
                backgroundColor: 'transparent',
                height: 100,
                width: 100, 
                borderBottomEndRadius: 10,
                borderTopEndRadius: 10,
                borderBottomLeftRadius: 10,
                borderTopLeftRadius: 10,
                borderWidth: 1,
                borderStyle: 'dashed',
            }}>
                
            </View>
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
})