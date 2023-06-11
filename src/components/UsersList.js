import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Pressable } from 'react-native';
import { ButtonStandard } from '../styles/BaseComponents';
import { downloadImage } from '../../services/Media';

class User extends Component {
    constructor(props) {
        super(props)
        this.onPressUser = this.onPressUser.bind(this)
        this.onPressFollow = this.onPressFollow.bind(this)
        this.state = {
            userPic: require('../../assets/images/user_predet_image.png')
        }
    }

    componentDidMount() {
        console.log("[User] componentDidMount this.state.userPic: " + this.state.userPic)
        this.loadUserPicUriById()
    }

    onPressUser() {
        this.props.onPressUser(this.props.user.id)
    }

    onPressFollow() {
        this.props.onPressFollow(this.props.user.id)
    }

    loadUserPicUriById() {
        const image_id = this.props.user.photo_id
        if (image_id != undefined && image_id != '') {
            downloadImage(image_id).then((imageUri) => {
                console.log("[User] imageUri: " + imageUri)
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

    renderUserNameAndEmail() {
        const fullname = this.props.user.fullname
        const mail = this.props.user.mail
        return (
            <React.Fragment>
                <Text style={{fontSize: 20}}>{fullname}</Text>
                <Text style={{fontSize: 15}}>{mail}</Text>
            </React.Fragment>
        )
    }

    renderFollowButton() {
        const followed = this.props.user.followed
        const title = followed? 'Siguiendo' : 'Seguir'
            
        return (
            <ButtonStandard
                title={title}
                onPress={this.onPressFollow}
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
        this.state = {
        }
        console.log("[UsersList] props.users: " + JSON.stringify(this.props.users))
    }

    render = () => {
        return (
            <View style={[this.props.style,{ width: '100%'}]}>
                {this.props.users.map((user) => {
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
    },
})