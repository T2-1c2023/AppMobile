import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Text, Divider, Button, TextInput, IconButton } from 'react-native-paper';
import styles from './styles';

export const TextHeader = (props) => {
    return (
        <Text variant="displayLarge" style={props.style}>
            {props.body}
        </Text>
    )
}

export const DividerWithMiddleText = (props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Divider style={{ flex: 1, height: 1, maxWidth: 100 }} />
            <Text style={{ marginHorizontal: 10 }}>{props.text}</Text>
            <Divider style={{ flex: 1, height: 1, maxWidth: 100 }} />
        </View>

    )
}

export const ButtonStandard = (props) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: props.marginTop, marginBottom: props.marginBottom}}>
            <Button
                mode="contained"
                onPress={props.onPress}>
                {props.title}
            </Button>
        </View>
    )
}

export const InputData = (props) => {
    const [text, setText] = useState('');

    const handleClear = () => {
        setText('');
    }

    return (
        <View style={{marginTop: props.marginTop, marginBottom: props.marginBottom}}>
            <TextInput
                mode='outlined'
                placeholder={props.placeholder}
                onChangeText={(newText) => {
                    setText(newText);
                    props.onChangeText(newText)
                }}
                secureTextEntry={props.secureTextEntry}
                value={text}
                right={<TextInput.Icon icon="close-circle-outline" onPress={handleClear} />}
                style={{ width: 250, backgroundColor: 'transparent'}}
            />
        </View>
    )
}

export const TextWithLink = (props) => {
    return (
        <Text style={{marginTop: props.marginTop, marginBottom: props.marginBottom, position: props.position, bottom: props.bottom }}>
            {props.text + " "}
            <Text onPress={props.onPress} style={{color: '#21005D', fontWeight: 'bold'}}>
                {props.linkedText}
            </Text>
        </Text>
    )
}

export const LoginImage = (props) => {
    return (
        <Image
            style={styles.loginImage}
            source={require('../../assets/images/icon.png')}
        />
    )
}