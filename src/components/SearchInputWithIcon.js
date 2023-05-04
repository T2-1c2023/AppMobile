import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Searchbar, IconButton } from 'react-native-paper'

import styles from '../styles/styles'

export default class SearchInputWithIcon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryText: '',
        }
    }
    
    render() {
        return (
            <View
                style={[this.props.style, searchStyles.container]}
            >
                <Searchbar
                    style={searchStyles.searchbar}
                    placeholder="Search"
                    onChangeText={(queryText) => this.setState({ queryText })}
                    onIconPress={() => this.props.onSubmit(this.state.queryText)}
                    onSubmitEditing={(param) => this.props.onSubmit(param.nativeEvent.text)}
                />
                <IconButton
                    icon="plus"
                    iconColor='white'
                    size={40}
                    onPress={this.props.onIconPress}
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
        width: '75%',
        height: 60,
        backgroundColor: '#CCC2DC',
        borderWidth: 1,
    },

    iconButton: {
        backgroundColor: '#21005D',
        borderRadius: 20,
    },
})