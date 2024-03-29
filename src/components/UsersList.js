import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Pressable } from 'react-native';
import { SmallButton } from '../styles/BaseComponents';
import { downloadImage } from '../../services/Media';
import { ActivityIndicator } from 'react-native-paper'

class User extends Component {
    constructor(props) {
        super(props)
        this.onPressUser = this.onPressUser.bind(this)
        this.onPressFollow = this.onPressFollow.bind(this)
        this.state = {
            userPic: require('../../assets/images/user_predet_image.png'),
            loadingFollowState: false,
        }
    }

    componentDidMount() {
        this.loadUserPicUriById()
    }

    onPressUser() {
        this.props.onPressUser(this.props.user.id)
    }

    followStateLoaded() {
        this.setState({ loadingFollowState: false })
    }

    onPressFollow() {
        this.setState({ loadingFollowState: true })
        const newStateLoadedSignal = () => {
            this.followStateLoaded() 
        }

        this.props.onPressFollow(this.props.user, newStateLoadedSignal)
    }


    loadUserPicUriById() {
        const image_id = this.props.user.photo_id
        if (image_id != undefined && image_id != '') {
            downloadImage(image_id).then((imageUri) => {
                if (imageUri != null)
                    this.setState({ userPic: { uri: imageUri } })
            })
        }
    }

    renderUserPic() {
        return (
            <Pressable onPress={this.onPressUser}>
                <Image
                    style={userStyles.userPic}
                    source={this.state.userPic}
                />
            </Pressable>
        )
    }

    renderRoleIcon() {
        return (
            <Image
                style={{
                    aspectRatio: 544 / 668,
                    height: 30,
                }}
                source={require('../../assets/images/trainer.png')}
            />
        )
    }

    renderRoles() {
        const isTrainer = this.props.user.is_trainer
        const isAthlete = this.props.user.is_athlete

        const rolesText = isAthlete? isTrainer? 'Entrenador y Atleta' : 'Atleta' : 'Entrenador'

        return (
            <Text style={{fontSize: 11, color: "grey"}}>{rolesText}</Text>
        )
    }

    renderUserNameAndEmail() {
        const fullname = this.props.user.fullname
        const mail = this.props.user.mail
        return (
            <React.Fragment>
                {this.renderRoles()}        
                <Text style={{fontSize: 20}}>{fullname}</Text>
                <Text style={{fontSize: 15}}>{mail}</Text>
                
            </React.Fragment>
        )
    }

    renderFollowButton() {
        const followed = this.props.user.followed
        const title = followed? 'Siguiendo' : 'Seguir'

        if (this.state.loadingFollowState)
            return (
                <ActivityIndicator size="small" color="#21005D" />
            )
        else
            return (
                <SmallButton
                    title={title}
                    onPress={this.onPressFollow}
                    greyMode={followed}
                />
        )
    }

    render() {        
        return (
            <React.Fragment>
                <View style={{ height: 1, backgroundColor: 'grey'}} />
                
                <View style={userStyles.userContainer}>
                    <View style={[{flex:0.3}, userStyles.userPicContainer]}>
                        {this.renderUserPic()}
                    </View>

                    <View style={[{flex:0.4}, userStyles.userNameAndEmailContainer]}>
                        {this.renderUserNameAndEmail()}
                    </View>

                    <View style={[{flex:0.3}, userStyles.followButtonContainer]}>
                        {this.renderFollowButton()}
                    </View>

                </View>
            </React.Fragment>
        )
    }
}

export default class UsersList extends Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <View style={[this.props.style,{ width: '100%'}]}>
                {this.props.users.map((user) => {
                    if (user.id == this.props.excludedUser)
                        return null
                    else
                        return (
                            <User
                                key={user.id}
                                user={user}
                                onPressUser={this.props.onPressUser}
                                onPressFollow={this.props.onPressFollow}
                            />
                        )
                })}
                <View style={{ height: 1, backgroundColor: 'grey'}} />
            </View>
        )
    }
}

const userStyles = StyleSheet.create({
    userContainer: {
        flex:1,
        flexDirection: "row",
    },

    userPicContainer: {
        justifyContent: "center",
        alignItems: "center",
    },

    userPic: {
        width: 80,
        height: 80,
        borderRadius: 50,
        marginVertical: 10,
    },

    userNameAndEmailContainer: {
        justifyContent: "center",
    },

    followButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 15,
    },
})
