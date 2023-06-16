import React, { Component } from 'react';
import { Text, View, StyleSheet, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import styles from '../styles/styles';


export class PinInput extends Component {
    constructor(props) {
        super(props)
        this.p1Ref = React.createRef()
        this.p2Ref = React.createRef()
        this.p3Ref = React.createRef()
        this.p4Ref = React.createRef()
        this.p5Ref = React.createRef()
        this.p6Ref = React.createRef()
        this.state = {
            pin1: '',
            pin2: '',
            pin3: '',
            pin4: '',
            pin5: '',
            pin6: '',
        }
    }

    handleChange() {
        let input = this.state.pin1 + this.state.pin2 + this.state.pin3 + this.state.pin4 + this.state.pin5 + this.state.pin6
        this.props.onChange(input)
    }

    render() {
        return (
            <View style={this.props.style}>
                <View style={{ flexDirection: 'row', width: 300, height: 80 }}>
                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            underlineColor="transparent"
                            placeholder='-'
                            caretHidden={true}
                            style={[pinStyles.digitInput, styles.pinInput]}
                            ref={this.p1Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onChangeText={(input) => {
                                if (input !== '') {
                                    this.setState({ pin1: input }, () => {
                                        this.handleChange()
                                        this.p2Ref.current.clear()
                                        this.p2Ref.current.focus()
                                    })
                                }
                            }}
                            onFocus={() => {
                                this.p1Ref.current.clear()
                                this.setState({ pin1: '' }, () => {
                                    this.handleChange()
                                })
                            }}
                        />
                    </View>
                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            underlineColor="transparent"
                            placeholder='-'
                            caretHidden={true}
                            style={[pinStyles.digitInput, styles.pinInput]}
                            ref={this.p2Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onKeyPress={(e) => {
                                if (e.nativeEvent.key === 'Backspace') {
                                    this.p1Ref.current.focus()
                                }
                            }}
                            onChangeText={(input) => {
                                if (input !== '') {                    
                                    this.setState({ pin2: input }, () => {
                                        this.handleChange()
                                        this.p3Ref.current.clear()
                                        this.p3Ref.current.focus()
                                    })
                                }
                            }}
                            onFocus={() => {
                                this.p2Ref.current.clear()
                                this.setState({ pin2: '' }, () => {
                                    this.handleChange()
                                })
                            }}
                        />
                    </View>
                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            underlineColor="transparent"
                            placeholder='-'
                            caretHidden={true}
                            style={[pinStyles.digitInput, styles.pinInput]}
                            ref={this.p3Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onKeyPress={(e) => {
                                if (e.nativeEvent.key === 'Backspace') {
                                    this.handleChange()
                                    this.p2Ref.current.clear()
                                    this.p2Ref.current.focus()
                                }
                            }}
                            onChangeText={(input) => {
                                if (input !== '') {
                                    this.setState({ pin3: input }, () => {
                                        this.handleChange()
                                        this.p4Ref.current.clear()
                                        this.p4Ref.current.focus()
                                    })
                                }
                            }}
                            onFocus={() => {
                                this.p3Ref.current.clear()
                                this.setState({ pin3: '' }, () => {
                                    this.handleChange()
                                })
                            }}
                        />
                    </View>
                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            underlineColor="transparent"
                            placeholder='-'
                            caretHidden={true}
                            style={[pinStyles.digitInput, styles.pinInput]}
                            ref={this.p4Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onKeyPress={(e) => {
                                if (e.nativeEvent.key === 'Backspace') {
                                    this.handleChange()
                                    this.p3Ref.current.clear()
                                    this.p3Ref.current.focus()
                                }
                            }}
                            onChangeText={(input) => {
                                if (input !== '') {
                                    this.setState({ pin4: input }, () => {
                                        this.handleChange()
                                        this.p5Ref.current.clear()
                                        this.p5Ref.current.focus()
                                    })
                                }
                            }}
                            onFocus={() => {
                                this.p4Ref.current.clear()
                                this.setState({ pin4: '' }, () => {
                                    this.handleChange()
                                })
                            }}
                        />
                    </View>
                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            underlineColor="transparent"
                            placeholder='-'
                            caretHidden={true}
                            style={[pinStyles.digitInput, styles.pinInput]}
                            ref={this.p5Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onKeyPress={(e) => {
                                if (e.nativeEvent.key === 'Backspace') {
                                    this.handleChange()
                                    this.p4Ref.current.clear()
                                    this.p4Ref.current.focus()
                                }
                            }}
                            onChangeText={(input) => {
                                if (input !== '') {
                                    this.setState({ pin5: input }, () => {
                                        this.handleChange()
                                        this.p6Ref.current.clear()
                                        this.p6Ref.current.focus()
                                    })
                                }
                            }}
                            onFocus={() => {
                                this.p5Ref.current.clear()
                                this.setState({ pin5: '' }, () => {
                                    this.handleChange()
                                })
                            }}
                        />
                    </View>

                    <View style={pinStyles.digitContainer}>
                        <TextInput
                            underlineColor="transparent"
                            placeholder='-'
                            caretHidden={true}
                            style={[pinStyles.digitInput, styles.pinInput]}
                            ref={this.p6Ref}
                            keyboardType='numeric'
                            maxLength={1}
                            onKeyPress={(e) => {
                                if (e.nativeEvent.key === 'Backspace') {
                                    this.handleChange()
                                    this.p6Ref.current.clear()
                                    this.p6Ref.current.focus()
                                }
                            }}
                            onChangeText={(input) => {
                                if (input !== '') {
                                    this.setState({ pin6: input }, () => {
                                        this.handleChange()
                                        Keyboard.dismiss()
                                    })
                                }
                            }}
                            onFocus={() => {
                                this.p6Ref.current.clear()
                                this.setState({ pin6: '' }, () => {
                                    this.handleChange()
                                })
                            }}
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
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    digitInput: {
        textAlign: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    }
})