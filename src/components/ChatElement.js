import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { downloadImage } from '../../services/Media';

export default class ChatElement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userPic: require('../../assets/images/user_predet_image.png'),
        }
    }

    componentDidMount() {
        this.loadUserPic();
    }

    loadUserPic = async () => {
        const image_id = this.props.data.photo_id;
        if (image_id != undefined && image_id != '') {
            const imageUri = await downloadImage(image_id);
            if (imageUri != undefined) {
                this.setState({ userPic: { uri: imageUri } });
            }
        }
    }

    render() {
        const { fullname, mail } = this.props.data;
        return (
          <View style={styles.userItemContainer}>
            <Image
              source={this.state.userPic}
              style={styles.userPhoto}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{fullname}</Text>
              <Text style={styles.userEmail}>{mail}</Text>    
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  userInfo: {
    justifyContent: 'center'
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: 14,
    color: 'gray'
  }
});