import React, { Component } from 'react';
import { Avatar, Button, Card, Text, IconButton, Checkbox } from 'react-native-paper';
import Icon from 'react-native-paper/src/components/Icon'
import { View, Image, StyleSheet, TextInput, Pressable } from 'react-native';


export default class RadiusInput extends Component {
    constructor(props) {
        super(props)
        this.onPressMinus = this.onPressMinus.bind(this)
        this.onPressPlus = this.onPressPlus.bind(this)
        this.onChangeRadius = this.onChangeRadius.bind(this)

        this.state = {
            checked: false,
        }
    }

    smallerRadiusSelected() {
        return this.props.value < 1
    }

    biggerRadiusSelected() {
        return this.props.value > 998
    }

    onPressMinus() {
        const newRadius = parseInt(this.props.value)
        this.onChangeRadius(newRadius - 1)
    }

    onPressPlus() {
        const newRadius = parseInt(this.props.value)
        this.onChangeRadius(newRadius + 1)
    }

    renderCheckbox() {
        return (
            <Checkbox
                status={this.props.radiusFilterEnabled ? 'checked' : 'unchecked'}
                onPress={() => {
                    this.props.radiusFilterChange()
                }}
                disabled={this.props.disabled}
                theme={{ colors: { primary: '#21005D', onSurfaceVariant: '#21005D', onSurface: '#21005D', } }}
            />
        )
    }

    minusButtonEnabled() {
        return !this.smallerRadiusSelected() && !this.props.disabled && this.props.radiusFilterEnabled
    }

    plusButtonEnabled() {
        return !this.biggerRadiusSelected() && !this.props.disabled && this.props.radiusFilterEnabled
    }

    onChangeRadius(newRadius) {
        newRadius = parseInt(newRadius)
        if (newRadius <= 1000 && newRadius > 0) {
            this.props.onChange(newRadius)
        } else {
            this.props.onChange(0)
        }

    }

    renderRadiusInput() {
        return (
            <React.Fragment>
                <View style={[
                        {flex: 0.3, backgroundColor: 'grey', borderTopStartRadius: 10, borderBottomLeftRadius: 10}
                        , this.minusButtonEnabled()? radiusStyles.unblockedButton : radiusStyles.blockedButton
                ]}>
                    <Pressable
                        disabled={!this.minusButtonEnabled()}
                        onPress={this.onPressMinus}
                        style={{flex:1, height: 30, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon source="minus" size={15} color='white'/>

                    </Pressable>


                </View>
                <View style={{flex: 0.4}}>
                    <TextInput
                        editable={this.props.radiusFilterEnabled && !this.props.disabled}
                        maxLength={3}
                        keyboardType='numeric'
                        selectionColor="grey"
                        style={radiusStyles.textInput}
                        textAlign='center'
                        value={this.props.value.toString()}
                        onChangeText={this.onChangeRadius}
                    />
                </View>

                <View style={[
                    {flex: 0.3, height: 30, backgroundColor: '#21005D', borderTopEndRadius: 10, borderBottomRightRadius:10}
                    , this.plusButtonEnabled()? radiusStyles.unblockedButton : radiusStyles.blockedButton
                ]}>
                    <Pressable 
                        disabled={!this.plusButtonEnabled()}
                        onPress={this.onPressPlus}
                        style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon source="plus" size={15} color='white'/>

                    </Pressable>
                </View>
            </React.Fragment>
        )
    }

    render() {
        return (
            <React.Fragment>
                <View style={[this.props.style,radiusStyles.container]}>
                    
                    <View style={{flex: 0.1}} />

                    <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                        {this.renderCheckbox()}
                    </View>

                    <View style={{flex: 0.7, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color:'grey', fontSize: 12}}>
                            Filtrar por cercanica [km]
                        </Text>
                    </View>
                </View>
                
                <View style={[this.props.style,radiusStyles.container]}>
                    
                    <View style={{flex: 0.2}} />

                    <View style={{flex: 0.8, flexDirection: 'row', alignItems: 'center'}}>
                        {this.renderRadiusInput()}
                    </View>
                </View>
            </React.Fragment>
        )               
    }
}

const radiusStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: 200,
    },

    blockedButton: {
        backgroundColor: 'grey',

    },

    unblockedButton: {
        backgroundColor: '#21005D',
    },

    textInput: {
        backgroundColor: 'white',
        flex: 1,
    },


})