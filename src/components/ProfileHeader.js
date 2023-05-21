import React, { Component } from 'react';
import { Text, View, StyleSheet, Keyboard, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import styles from '../styles/styles';


export default class ProfileHeader extends Component {
    constructor(props) {
        super(props)
        this.p1Ref = React.createRef()
        this.state = {
            pin1: '',
        }
    }

    render() {
        return (
            <View style={[this.props.style, {width: '100%'}]}>
                <View style={profileStyles.firstRowContainer}>
                    
                    {/* Profile picture */}
                    <View style={{flex:0.4, backgroundColor: 'yellow'}}>    
                        <Image
                            source={this.props.profilePic}
                            style={profileStyles.profilePic}
                        />
                    </View>
                    
                    
                    <View style={{flex:0.6, backgroundColor:'blue'}}>

                    </View>
                </View>
            </View>
        )
    }
}

const profileStyles = StyleSheet.create({
    container: {

    },

    firstRowContainer: {
        width: '100%', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
    },

    profilePic: {
        width: 120, 
        height: 120,
        borderRadius: 140/2,
        alignSelf: 'center',
    },
})