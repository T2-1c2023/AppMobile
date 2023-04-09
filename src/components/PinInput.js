import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';


export class PinInput extends Component {
    constructor(props) {
        super(props)
        this.p1Ref = React.createRef()
        this.p2Ref = React.createRef()
        this.p3Ref = React.createRef()
        this.p4Ref = React.createRef()
        this.state = {
            pin1: '',
            pin2: '',
            pin3: '',
            pin4: '',
            p1Editable: true,
            p2Editable: true,
            p3Editable: true,
            p4Editable: true,
        }
    }

    handleInput() {
        let input = this.state.pin1 + this.state.pin2 + this.state.pin3 + this.state.pin4
        this.props.callback(input)
    }

    render() {
        return (
            <View style={this.props.style}>
                <View style={{ flexDirection: 'row', width: 300, height: 80, backgroundColor: 'green' }}>
                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            style={pinStyles.digitInput}
                            ref={this.p1Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onChangeText={(input) => {
                                if (input === '') {
                                    this.p1Ref.current.focus()
                                } else {
                                    this.setState({ pin1: input, p1Editable: false }, () => {
                                        this.p2Ref.current.focus()
                                    })
                                }
                            }}
                            disabled={!this.state.p1Editable}
                        />
                    </View>
                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            style={pinStyles.digitInput}
                            ref={this.p2Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onChangeText={(input) => {
                                this.setState({ pin2: input, p2Editable: false }, () => {
                                    this.p3Ref.current.focus()
                                })
                            }}
                            disabled={!this.state.p2Editable}
                        />
                    </View>
                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            style={pinStyles.digitInput}
                            ref={this.p3Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onChangeText={(input) => {
                                this.setState({ pin3: input, p3Editable: false }, () =>
                                    this.p4Ref.current.focus()
                                )
                            }}
                            disabled={!this.state.p3Editable}
                        />
                    </View>
                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            style={pinStyles.digitInput}
                            ref={this.p4Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onChangeText={(input) => {
                                this.setState({ pin4: input, p4Editable: false }, () => {
                                    this.handleInput()
                                })
                            }}
                            disabled={!this.state.p4Editable}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const pinStyles = StyleSheet.create({
    digitContainer: {
        flex: .25,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    digitInput: {
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: 'transparent'
    }
})