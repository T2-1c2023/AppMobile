import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Searchbar, IconButton } from 'react-native-paper'

import styles from '../styles/styles'

export default class SearchInputWithIcon extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <View
                style={[this.props.style, searchStyles.container]}
            >
                <Searchbar
                    style={searchStyles.searchbar}
                    placeholder="Search"
                />
                <IconButton
                    icon="plus"
                    iconColor='white'
                    size={40}
                    onPress={() => console.log('Pressed')}
                    style={searchStyles.iconButton}
                />
            </View>
        )
    }
}

const searchStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchbar: {
        width: '70%',
        height: 60,
        backgroundColor: '#CCC2DC',
        borderWidth: 1,
    },

    iconButton: {
        backgroundColor: '#21005D',
        borderRadius: 20,
    },
})