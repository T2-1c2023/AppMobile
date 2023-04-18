import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Text, Divider, Button, TextInput, IconButton } from 'react-native-paper';
import styles from './styles';

export const TextHeader = (props) => {
    return (
        <Text variant="displayLarge" style={[styles.textHeader,props.style]}>
            {props.body}
        </Text>
    )
}

export const TextDetails = (props) => {
    return (
        <View style={props.style}>
            <Text
                numberOfLines={props.numberOfLines}
                variant="labelMedium"
                style={props.warning ? styles.textWarning : styles.textDetails}>
                {props.body}
            </Text>
        </View>
    )
}

export const DividerWithMiddleText = (props) => {
    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center' }, props.style]}>
            <Divider style={{ flex: 1, height: 1, maxWidth: 100 }} />
            <Text style={{ marginHorizontal: 10 }}>{props.text}</Text>
            <Divider style={{ flex: 1, height: 1, maxWidth: 100 }} />
        </View>

    )
}

export const ButtonStandard = (props) => {
    return (
        <View style={props.style}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                    mode="contained"
                    onPress={props.onPress}
                    disabled={props.disabled}
                >
                    {props.title}
                </Button>
            </View>
        </View>
    )
}

export const InputData = (props) => {
    const [text, setText] = useState('');

    const handleClear = () => {
        setText('');
        props.onChangeText('')
    }

    return (
        <View style={props.style}>
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
                style={styles.inputData}
            />
        </View>
    )
}

export const TextWithLink = (props) => {
    return (
        <Text style={[styles.textDetails, props.style]}>
            {props.text + " "}
            <Text onPress={props.onPress} style={styles.textLinked}>
                {props.linkedText}
            </Text>
        </Text>

    )
}

export const LoginImage = (props) => {
    return (
        <Image
            style={[styles.loginImage, props.style]}
            source={require('../../assets/images/icon.png')}
        />
    )
}

export const FingerprintImage = (props) => {
    return (
        <Image
            style={[styles.fingerprintImage, props.style]}
            source={require('../../assets/images/fingerprint.png')}
        />
    )
}
