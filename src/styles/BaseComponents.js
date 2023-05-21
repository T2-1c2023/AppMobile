import React, { useState, useEffect } from 'react';
import { View, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as reactNative from 'react-native';
import { Text, Divider, Button, TextInput, IconButton, DefaultTheme } from 'react-native-paper';
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

export const TextProfileName = (props) => {
    return (
        <Text variant="titleLarge" style={[styles.textProfileName, props.style]}>
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
                style={props.warning ? styles.textWarning : 
                    props.alignLeft ? styles.textDetailsLeft : styles.textDetails 
                }
            >
                {props.body}
            </Text>
        </View>
    )
}

export const DividerWithMultipleTexts = (props) => {
    const renderDividersAndTexts = () => {
      return props.texts.map((text, index) => (
        <React.Fragment key={index}>
          <Divider style={{ flex: 1, height: 1, backgroundColor: '#9D9D9D' }} />
          <Text style={{ marginHorizontal: 10, color: 'black'}}>{text}</Text>
        </React.Fragment>
      ));
    };
  
    return (
      <View style={[{ flexDirection: 'row', alignItems: 'center' }, props.style]}>
        {renderDividersAndTexts()}
        <Divider style={{ flex: 1, height: 1, backgroundColor: '#9D9D9D' }} />
      </View>
    );
  };
    

export const DividerWithMiddleText = (props) => {
    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center' }, props.style]}>
            <Divider style={{ flex: 1, height: 1, maxWidth: 100 }} />
            <Text style={{ color: 'black', marginHorizontal: 10 }}>{props.text}</Text>
            <Divider style={{ flex: 1, height: 1, maxWidth: 100 }} />
        </View>

    )
}

export const DividerWithLeftText = (props) => {
    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center' }, props.style]}>
            <Divider style={{ flex: 1, height: 1, maxWidth: 20, backgroundColor: '#9D9D9D' }} />
            <Text style={{ color: 'black', marginHorizontal: 10 }}>{props.text}</Text>
            <Divider style={{ flex: 1, height: 1, backgroundColor: '#9D9D9D' }} />
            { ( props.maxCounter != undefined && props.counter != undefined ) &&
                <>
                <Text style={{ color: 'black', marginHorizontal: 10 }}>{props.counter + '/' + props.maxCounter}</Text>
                <Divider style={{ flex: 1, height: 1, maxWidth: 20, backgroundColor: '#9D9D9D' }} />
                </>
            }

            {props.editButtonPress &&
                <IconButton
                    icon="pencil"
                    color="#000000"
                    size={20}
                    onPress={() => props.editButtonPress()}
                />
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
                    buttonColor={props.warningTheme? '#8A1919' :
                        props.disabled? 'green' : '#21005D'
                    }
                    onPress={props.onPress}
                    
                    style={{
                        borderColor: 'black',
                        borderWidth : 1,
                        backgroundColor:
                            props.whiteMode? 'white' : 
                                props.warningTheme? '#8A1919' :
                                    props.disabled? 'grey' : '#21005D'
                    }}
                    disabled={props.disabled}
                    icon={props.icon}
                    textColor={props.whiteMode? 'black' : 'white'}
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
                textColor='white'
            >
                {props.confirmationText}
            </Button>
            <Button
                mode="contained"
                onPress={props.onCancelPress}
                disabled={props.disabled}
                style={[{ marginLeft: 10 }, styles.cancelButton]}
                textColor='white'
            >
                {props.cancelText}
            </Button>
        </View>
    )
}

export const InputData = React.forwardRef((props, ref) => {
    const [text, setText] = useState('');
    const [textHidden, setTextHidden] = useState(true);

    const handleClear = () => {
        setText('');
        props.onChangeText('')
    }

    const handleEyePress = () => {
        setTextHidden(!textHidden);
    }

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: '#21005D',
        },
    }

    const warningTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: 'red',
        },
    }

    return (
        <View style={props.style}>
            <TextInput
                ref={ref}
                theme={props.warningMode? warningTheme : theme}
                fontStyle={text.length == 0 ? 'italic' : 'normal'}
                mode='outlined'
                placeholder={props.placeholder}
                placeholderTextColor='grey'
                onChangeText={(newText) => {
                    setText(newText);
                    props.onChangeText(newText)
                }}
                onSubmitEditing={props.onSubmitEditing}
                secureTextEntry={props.secureTextEntry && textHidden}
                value={text}
                selectionColor="grey"
                autoCapitalize="none"
                right={
                    <TextInput.Icon 
                        icon={props.secureTextEntry? 
                            textHidden? "eye-outline" : "eye-off-outline"
                            :
                            "close-circle-outline"} 
                        iconColor="black" 
                        onPress={props.secureTextEntry? handleEyePress : handleClear}
                    />
                    // </TouchableWithoutFeedback>
                }
                style={styles.inputData}
            />
        </View>
    )
})

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

    const textDetailsStyle = props.notFixedWidth? styles.textDetailsNotFixedWidth : styles.textDetails;

    return (
        <Text style={[textDetailsStyle, props.style]}>
            {props.text + " "}
            <Text onPress={props.onPress} style={styles.textLinked}>
                {props.linkedText}
            </Text>
        </Text>

    )
}

export const TextWithLinkFlexible = (props) => {
    return (
        <Text style={[styles.textDetailsFlexible, props.style]}>
            {props.text + " "}
            <Text onPress={props.onPress} style={styles.textLinked}>
                {props.linkedText}
            </Text>
        </Text>

    )
}

export const TextLinked = (props) => {
    return (
        <Text onPress={props.onPress} style={[styles.textLinked, props.style]}>
            {props.linkedText}
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


