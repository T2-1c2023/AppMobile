import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'


export default class StarsScore extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    
    icon(starPosition, score, key) {
        const isActive = starPosition <= score;

        return (
            <IconButton
                key={key}
                icon={isActive ? 'star' : 'star-outline'}
                iconColor={isActive ? '#21005D' : 'gray'}
                size={15}
                style={starPosition != 5 ? starsStyles.star : starsStyles.borderStar}
            />
        )
    }

    render() {
        const stars = [1,2,3,4,5]

        return (
            <View
                style={[this.props.style, starsStyles.container]}
            >
                {stars.map((starPosition, index) => this.icon(starPosition, this.props.score, index))}
                
            </View>
        )
    }
}

const starsStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex:1,
    },
    
    star: {
        // backgroundColor: '#CCC2DC',
        marginRight: -25,
        marginTop: -5,
    },

    borderStar: {
        marginRight: -5,
        marginTop: -5,
    }
})