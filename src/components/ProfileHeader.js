import React, { Component } from 'react';
import { Text, View, StyleSheet, Keyboard, Image, TouchableOpacity, Alert} from 'react-native';
import { TextLinked, TextProfileName } from '../styles/BaseComponents';
import { TextInput } from 'react-native-paper';
import styles from '../styles/styles';

import Modal from "react-native-modal";

export default class ProfileHeader extends Component {
    constructor(props) {
        super(props)
        this.handleCertifiedTrainerPress = this.handleCertifiedTrainerPress.bind(this)
        this.p1Ref = React.createRef()
        this.state = {
            modalVisible: false,
        }
    }

    handleCertifiedTrainerPress() {
        this.setState({ modalVisible: true })
    }

    renderProfilePic() {
        return (
            <View style={profileStyles.profilePicContainer}>    
                <Image
                    source={this.props.profilePic}
                    style={profileStyles.profilePic}
                />
            </View>
        )
    }

    // Callback for ProfileScreen
    handleTrainerLogoPress = () => {
        const { onPressTrainerLogo } = this.props;
        if (onPressTrainerLogo) {
            onPressTrainerLogo();
        }
    }

    renderRoles() {
        return (
            <View style={profileStyles.rolesContainer}>
                {this.props.isAthlete && (
                    <Image
                        source={require('../../assets/images/athlete.png')}
                        style={profileStyles.athletePic}
                    />
                )}
                {this.props.isTrainer && (
                    <View style={{position: 'relative'}}>
                        <TouchableOpacity
                          onPress={this.handleTrainerLogoPress}
                        >
                            <Image
                                source={require('../../assets/images/trainer.png')}
                                style={profileStyles.trainerPic}
                            />
                        </TouchableOpacity>
                        {this.props.certifiedTrainer && (
                            <View style={{position: 'absolute', top: 0, right: -10}}>
                                <TouchableOpacity
                                    onPress={this.handleCertifiedTrainerPress}
                                >
                                    <Image
                                        source={require('../../assets/images/certificate.png')}
                                        style={profileStyles.certifiedTrainerPic}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>
        )
    }

    renderNameAndRoles() {
        return (
            <View style={profileStyles.nameAndRolesContainer}>
                <View style={{ flex:0.2 }}>
                    <TextProfileName 
                        body={this.props.name}
                    />
                </View>
                <View style={{ flex:0.8 }}>
                    {this.renderRoles()}
                </View>
            </View>
        )
    }
    
    renderBottomButtons() {
        return <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 0.4, alignItems: 'center' }}>
                {this.props.bottomLeft}
            </View>

            <View style={{ flex: 0.2 }}/>
            
            <View style={{ flex: 0.4, alignItems: 'center' }}>
                {this.props.bottomRight}
            </View>
        </View>
    }

    renderModal(){
        return (
            
            <Modal
                isVisible={this.state.modalVisible}
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationInTiming={400}
                animationOutTiming={400}
                onBackdropPress={() => this.setState({ modalVisible: false })}
            >
                <Image
                    source={require('../../assets/images/certificateDetails.png')}
                    style={profileStyles.certificateDetails}
                />
            </Modal>
        )
    }

    render() {
        return (
            <View style={[this.props.style, profileStyles.container]}>
                <View style={profileStyles.firstRowContainer}>
                    
                    {this.renderProfilePic()}
                    
                    {this.renderNameAndRoles()}

                </View>

                <View style={profileStyles.secondRowContainer}>
                    {this.renderBottomButtons()}
                </View>

                {this.renderModal()}
            </View>
        )
    }
}

const profileStyles = StyleSheet.create({
    container: {
        width: '100%'
    },

    firstRowContainer: {
        width: '100%', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    secondRowContainer: {
        marginTop: 10,
    },

    profilePicContainer: {
        flex:0.4,
    },

    nameAndRolesContainer: {
        flex:0.6,
    },

    profilePic: {
        width: 120, 
        height: 120,
        borderRadius: 140/2,
        alignSelf: 'center',
    },

    rolesContainer: {
        flexDirection: 'row',
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },

    athletePic: {
        height: 70,
        width: undefined,
        aspectRatio: 422/636,
        marginHorizontal: 10,
    },

    trainerPic: {
        height: 75,
        width: undefined,
        aspectRatio: 544/668,
        marginHorizontal: 10,
    },

    certifiedTrainerPic: {
        height: 30,
        width: undefined,
        aspectRatio: 512/512,
    },

    certificateDetails: {
        height: undefined,
        width: 200,
        aspectRatio: 512/512,
        alignSelf: 'center',
    },
})