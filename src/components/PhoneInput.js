import React, { Component } from 'react';
import { View } from 'react-native';
import PhoneInput from "react-native-phone-number-input";

export class PhoneNumberInput extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={this.props.style}>
                <PhoneInput
                    defaultCode="AR"
                    autoFocus
                    withShadow
                    placeholder='Número de teléfono'
                    onChangeFormattedText={(number) => {
                        this.props.onChange(number)
                    }}
                    layout="second"
                    textInputStyle={{
                        backgroundColor: 'transparent',

                    }}
                    codeTextStyle={{
                        backgroundColor: 'transparent',

                    }}
                    flagButtonStyle={{
                        backgroundColor: 'transparent',

                    }}
                    textContainerStyle={{
                        backgroundColor: 'transparent',

                    }}
                    containerStyle={{
                        backgroundColor: '#CCC2DC',
                        borderWidth: 1,
                        borderRadius: 40,
                    }}
                />
            </View>
        )
    }
}