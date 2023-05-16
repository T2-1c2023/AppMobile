import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { TextBox } from '../styles/BaseComponents';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const MIN_TITLE_LENGTH = 5

class Activity extends Component {
    constructor(props) {
        super(props)
        this.handleTrashPress = this.handleTrashPress.bind(this)
    }

    getUriById(image_id) {

        //reemplazar por logica de obtener imagen a partir de id
        //----------------
        return 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg'
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/220px-Cat_November_2010-1a.jpg'
        return 'https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3=w240-h480-rw'
        //----------------
    }

    handleImagePress(id) {
        alert('Image Pressed with id: ' + id)
    }

    activityImage(id) {
        return (
            <View style={activityStyles.imageContainer}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => this.handleImagePress(id)}
                >
                    {/* Reemplazar por lógica de muestreo de imagen por id */}
                    {/* ---------------------------------------- */}
                    

                    <Image
                        source={{ uri: this.getUriById(id) }}
                        style={ activityStyles.image }
                        resizeMode= 'contain'
                    />

                    {/* ---------------------------------------- */}
                </TouchableOpacity>
            </View>
        )
    }

    activityWithoutImage() {
        return (
        <View style={activityStyles.imageContainer}>
            <Image
                source={require('./fiufit.png')}
                style={[activityStyles.activityWithoutImage, { alignSelf: 'center' }]}
                resizeMode='contain'
            />
        </View>
        )
    }

    handleTrashPress() {
        const activityId = this.props.activity.id
        axios.delete('https://trainings-g6-1c-2023.onrender.com/activities/' + activityId)
            .then(response => {
                this.props.onChange()
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render = () => {
        return (
            <View style={[{ flexDirection: 'row', width: '100%', marginTop: 5 }, this.props.style]}>
                
                {/* image */}
                <View style = {{flex: 0.3}}>
                    {(this.props.activity.image_id != undefined) ?
                        this.activityImage(this.props.activity.multimedia_id)
                        :
                        this.activityWithoutImage()
                    }
                </View>

                {/* title */}
                <View style = {{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                    <Text 
                        style={activityStyles.activityTitle}
                        numberOfLines={3}
                    >
                        {this.props.activity.title}
                    </Text>
                </View>

                {/* trash button */}
                <View style = {{flex: 0.2, justifyContent: 'center'}}>
                    {
                    this.props.editionMode &&
                        <IconButton
                            icon="trash-can-outline"
                            iconColor='red'
                            size={40}
                            onPress={this.handleTrashPress}
                            style={ activityStyles.trashButton }
                        />
                    }
                </View>

            </View>
        )
    }
}

export default class ActivityList extends Component {
    constructor(props) {
        super(props)
        this.handleUploadPress = this.handleUploadImagePress.bind(this)
        this.handleSubmitPress = this.handleSubmitPress.bind(this)
        this.state = {
            newActivityTitle: '',
            newActivityImageId: '',
        }
    }

    handleUploadImagePress() {
        alert('TO BE IMPLEMENTED')
    }

    handleSubmitPress() {
        if (this.state.newActivityTitle.length >= MIN_TITLE_LENGTH) {
            
            const body = {
                title: this.state.newActivityTitle,
                multimedia_id: this.state.newActivityImageId,
            }

            axios.post('https://trainings-g6-1c-2023.onrender.com/trainings/1/activities', body)
                .then(response => {
                    // reset title
                    this.setState({ newActivityTitle: '' })

                    // execute callback from parent component to update activity list
                    this.props.onChange()
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            alert('El título debe tener al menos ' + MIN_TITLE_LENGTH + ' caracteres')
        }
    }

    uploadImage() {
        return (
            <TouchableOpacity onPress={this.handleUploadImagePress}>
                <View style={activityStyles.uploadImage}>
                    <Icon name="upload" size={30} color="grey" />
                </View>
            </TouchableOpacity>
        )
    }

    uploadActivity() {
        return (
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 5 }}>
                
                {/* image */}
                <View style = {{flex: 0.3}}>
                    {this.uploadImage()}
                </View>

                {/* title */}
                <View style = {{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                    <TextBox
                        onChangeText={(newActivityTitle) => this.setState({ newActivityTitle })}
                        maxLength={25}
                        value={this.state.newActivityTitle}
                        style={{
                            marginTop: 5,
                        }}
                        flexible
                        singleline
                    />
                </View>

                {/* submit button */}
                <View style = {{flex: 0.2, justifyContent: 'center'}}>
                    <IconButton
                        icon="check-circle"
                        iconColor='#21005D'
                        size={40}
                        onPress={this.handleSubmitPress}
                        style={ activityStyles.trashButton }
                    />
                </View>

            </View>
        )
    }

    render = () => {
        return (
            <View style={this.props.style}>
                {this.props.activities.map((activity) =>
                    <Activity 
                        key={activity.id} 
                        activity={activity} 
                        onChange={this.props.onChange}
                        editionMode={this.props.editionMode}
                        />
                )}
            {
            this.props.editionMode && this.props.activities.length < this.props.maxActivities && 
                this.uploadActivity()
            }
            </View>
        )
    }
}

const activityStyles = StyleSheet.create({
    imageContainer: {
        height: 100,
        width: 100,
        borderBottomEndRadius: 10,
        borderTopEndRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        borderWidth: 2,
        marginLeft: 10,
    },

    image: {
        height: 98,
        overflow: 'hidden',
        borderRadius: 8,
    },

    uploadImage: {
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
        marginLeft: 10,
    },

    activityWithoutImage: {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 8,
    },

    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'baseline',
        marginLeft: 10,
    },

    trashButton: {
        alignSelf: 'center',
        
    },
})