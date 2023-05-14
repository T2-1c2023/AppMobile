import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import * as reactNative from 'react-native';
import { Text, Divider, Button, TextInput, IconButton } from 'react-native-paper';
import styles from './styles';

export const TextHeader = (props) => {
    return (
        <Text variant="displayLarge" style={[styles.textHeader, props.style]}>
            {props.body}
        </Text>
    )
}

export const TextSubheader = (props) => {
    return (
        <Text variant="displaySmall" style={[styles.textHeader, props.style]}>
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

export const DividerWithLeftText = (props) => {
    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center' }, props.style]}>
            <Divider style={{ flex: 1, height: 1, maxWidth: 20, backgroundColor: '#9D9D9D' }} />
            <Text style={{ marginHorizontal: 10 }}>{props.text}</Text>
            <Divider style={{ flex: 1, height: 1, backgroundColor: '#9D9D9D' }} />
            { ( props.maxCounter != undefined && props.counter != undefined ) &&
                <>
                <Text style={{ marginHorizontal: 10 }}>{props.counter + '/' + props.maxCounter}</Text>
                <Divider style={{ flex: 1, height: 1, maxWidth: 20, backgroundColor: '#9D9D9D' }} />
                </>
            }
        </View>
    )
}


export const ButtonStandard = (props) => {
    return (
        <View style={props.style}>
            <View style={[{ display: 'flex', flexDirection: 'row' }, styles.buttonStandard]}>
                <Button
                    mode="contained"
                    buttonColor='#21005D'
                    onPress={props.onPress}
                    disabled={props.disabled}
                >
                    {props.title}
                </Button>
            </View>
        </View>
    )
}

export const ConfirmationButtons = (props) => {
    return (
        <View style={[{ flexDirection: 'row' , alignSelf: 'flex-start'}, props.style]}>
            <Button
                mode="contained"
                onPress={props.onConfirmPress}
                disabled={props.disabled}
                style={[{marginLeft: 10}, styles.confirmationButton]}
                
            >
                {props.confirmationText}
            </Button>
            <Button
                mode="contained"
                onPress={props.onCancelPress}
                disabled={props.disabled}
                style={[{ marginLeft: 10 }, styles.cancelButton]}
            >
                {props.cancelText}
            </Button>
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

export const DaysInput = (props) => {
    return (
        <View style={[{ flexDirection: 'row', width: '100%' }, props.style]}>
            <reactNative.TextInput 
                maxLength={4}
                keyboardType='numeric'
                selectionColor="grey"
                style={styles.daysBox}
            />
            <Text style={styles.daysWord}>
                días
            </Text>
        </View>
    )
}

export const TextBox = (props) => {
    const [text, setText] = useState('');

    const handleChange = (newText) => {
        setText(newText)
        props.onChangeText(newText)
    }

    useEffect(() => {
        setText(props.value || '');
      }, [props.value]);

    const textStyle = props.flexible? styles.flexibleTextBox : styles.textBox;

    const counterStyle = props.flexible? styles.flexibleTextBoxCounter : styles.texBoxCounter;

    return (
        <View style={[{ width: '100%', alignItems: 'center'}, props.style]}>
            { props.title &&    
                <DividerWithLeftText
                    text={props.title}
                />
            }
            <reactNative.TextInput
                multiline = {props.singleline? false : true}
                onChangeText={(newText) => handleChange(newText)}
                value={props.value}
                maxLength={props.maxLength}
                placeholder={props.placeholder? props.placeholder : "Escribe aquí..."}
                selectionColor="grey"
                style={[textStyle, 
                    { marginTop: 10 }
                ]}
            />
            <Text style={counterStyle}>
                {text.length}/{props.maxLength}
            </Text>
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


