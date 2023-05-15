import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { ButtonStandard } from '../styles/BaseComponents';

export class FingerprintInput extends Component {
    constructor(props) {
        super(props)
        this.handleOnPress = this.handleOnPress.bind(this)
    }
    
    handleOnPress = () => {
        // TODO: validar fingerprint
        this.props.onValidFingerprint();
    }

    render = () => {
        return (
            <View style={[{ flexDirection: 'row', width: 250, height: 60 }, this.props.style]}>
                <View style={{ flex: .8, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image
                        style={{
                            height: 50,
                            width: 50,
                            alignSelf: 'center',
                            marginRight: 10,
                        }}
                        source={require('../../assets/images/fingerprint.png')}
                    />

                </View>
                <View style={{ flexDirection: 'row', flex: 1.1, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <ButtonStandard
                        onPress={this.handleOnPress}
                        title="Usar Huella"
                    />
                </View>
                <View style={{ flex: 0.1 }}></View>
            </View>
        )
    }
}