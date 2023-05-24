import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { TextBox } from '../styles/BaseComponents';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../TokenManager';
// Image handling
import { selectImage, uploadImageFirebase, downloadImage } from '../../services/Media';

const MIN_TITLE_LENGTH = 5

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;


class Activity extends Component {
    constructor(props) {
        super(props)
        this.handleTrashPress = this.handleTrashPress.bind(this)
        this.state = {
            imageUri: require('./fiufit.png')
        }
    }

    async componentDidMount() {
        const imageId = this.props.activity.multimedia_id;
        if (imageId != '') {
            this.getUriById(this.props.activity.multimedia_id);
        }
    }

    async getUriById(image_id) {
        const imageUri = await downloadImage(image_id);
        if (imageUri != null) 
            this.setState({ imageUri: {uri: imageUri}});
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
                    <Image
                        source={this.state.imageUri}
                        style={ activityStyles.image }
                        resizeMode= 'contain'
                    />
                </TouchableOpacity>
            </View>
        )
    }

    activityWithoutImage() {
        return (
        <View style={activityStyles.imageContainer}>
            <Image
                source={this.state.imageUri}
                style={[activityStyles.activityWithoutImage, { alignSelf: 'center' }]}
                resizeMode='contain'
            />
        </View>
        )
    }

    handleTrashPress() {
        const activityId = this.props.activity.id
        axios.delete(API_GATEWAY_URL + 'activities/' + activityId, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
            })
            .then(response => {
                this.props.onChange()
            })
            .catch(function (error) {
                console.log(error);
            })

        // TODO: eliminar la foto de firebase
    }

    render = () => {
        return (
            <View style={[{ flexDirection: 'row', width: '100%', marginTop: 5 }, this.props.style]}>
                
                {/* image */}
                <View style = {{flex: 0.3}}>
                    {(this.props.activity.multimedia_id != '') ?
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
            newActivityImageUri: ''
        }
    }

    handleUploadImagePress = async () => {
        const imageLocalUri = await selectImage();
        if (imageLocalUri != null) {
            // For local rendering of the image without download from firebase
            this.setState({newActivityImageUri: imageLocalUri});
        }
    }

    async handleSubmitPress() {
        if (this.state.newActivityTitle.length >= MIN_TITLE_LENGTH) {
            let imageId = '';
            if (this.state.newActivityImageUri != '')
                imageId = await uploadImageFirebase(this.state.newActivityImageUri);
            
            const body = {
                title: this.state.newActivityTitle,
                multimedia_id: imageId,
            }

            axios.post(API_GATEWAY_URL + 'trainings/' + this.props.trainingId + '/activities', body, {
                headers: {
                    Authorization: tokenManager.getAccessToken()
                }
            })
                .then(response => {
                    // reset title
                    this.setState({ newActivityTitle: '' });
                    // Update uploadImage button to show upload icon again
                    this.setState({ newActivityImageUri: '' });

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
                    {this.state.newActivityImageUri === '' ? 
                        <Icon name="upload" size={30} color="grey" />
                        :
                        <Image 
                            source={{ uri: this.state.newActivityImageUri }} 
                            style={activityStyles.image}    
                        />
                    }
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
        width: 98,
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