import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import Icon from '@mdi/react';
import { mdiStarOutline } from '@mdi/js';
import { mdiStar } from '@mdi/js';


export default class StarsScore extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    
    icon(starPosition, score, key) {
        const isActive = starPosition <= score;

        return (
            <View
                style={starsStyles.starContainer}
                key={key}
            >
                <IconButton
                    key={key}
                    icon={isActive ? 'star' : 'star-outline'}
                    iconColor={isActive ? '#21005D' : 'gray'}
                    size={15}
                    style={starPosition != 5 ? starsStyles.star : starsStyles.borderStar}
                />
            </View>
        )
    }

    render() {
        const stars = [1,2,3,4,5]

        return (
            <View
                style={[this.props.style, starsStyles.container]}
            >
                {stars.map((starPosition, index) => this.icon(starPosition, this.props.score, index))}
                
                <View style={starsStyles.rightBorder}/>
            </View>
        )
    }
}

const starsStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    
    star: {
    },

    borderStar: {
    },

    starContainer: {
        width: 13,
        height: 13,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },

    rightBorder: {
        width: 3,
    }
})