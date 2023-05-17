import React, { Component } from 'react';
import { Avatar, Button, Card, Text, IconButton, Divider } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';
import { DividerWithMultipleTexts, TextLinked, TextWithLinkFlexible, TextWithLink } from '../styles/BaseComponents';
import StarsScore from './StarsScore';


export default class TrainingData extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }   
    }

    getLevelIcon() {
        switch (this.props.training.severity) {
            case 1:
                return require('../../assets/images/level-basic.png')
            case 2:
                return require('../../assets/images/level-intermediate.png')
            case 3:
                return require('../../assets/images/level-advanced.png')
            default:
                return require('../../assets/images/level-basic.png')
        }
    }

    getLevelName() {
        switch (this.props.training.severity) {
            case 1:
                return 'Básico'
            case 2:
                return 'Intermedio'
            case 3:
                return 'Avanzado'
            default:
                return 'Nivel desconocido'
        }
    }

    alredyRated() {

        //cambiar por logica de verificacion sobre si el usuario ya calificó 
        return false
    }

    renderStarsWithText(flex, text) {
        return (
            <View style={{ flexDirection: 'row', flex: flex}}>
                <View style={{ backgroundColor: 'transparent', flex: 0.5}}>
                    <StarsScore 
                        score={2}
                        style={{
                        }}
                    />
                </View>
                <View style={{ flex: 0.5, backgroundColor: 'transparent', paddingTop: 2 }}>
                    <TextLinked
                        onPress={() => console.log('pressed')}
                        linkedText={text}
                    />
                </View>
            </View>
        )
    }

    renderCalificationsData() {
        const canRate = this.props.canRate;
    
        let calificationsData = (
            <View style={{marginTop: 10}}>
                <DividerWithMultipleTexts
                    texts={['Calificación general']}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 8,
                    }}
                >
                    <View style={{  flex: 0.15}} />
                    {this.renderStarsWithText(0.35, "ver todas")}
                    <View style={{  flex: 0.1}} />
                </View>
            </View>
        );
    
        if (canRate) {
            const alreadyRated = this.alredyRated();
            const calificationText = alreadyRated ? 'Deja tu opinión' : 'editar';
    
            calificationsData = (
                <View style={{marginTop: 15}}>
                    <DividerWithMultipleTexts
                        texts={['Calificación general', 'Tu calificación']}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 8,
                        }}
                    >
                        <View style={{  flex: 0.15}} />
    
                        {this.renderStarsWithText(0.35, "ver todas")}
    
                        {alreadyRated && (
                            <View style={{ flex: 0.50, backgroundColor: 'transparent', paddingTop: 4 }}>
                                <TextWithLink
                                    text={calificationText}
                                    linkedText={'aqui'}
                                    onPress={() => console.log('pressed')}
                                    notFixedWidth
                                />
                            </View>
                        )}
    
                        {!alreadyRated && (
                            <React.Fragment>
                                <View style={{  flex: 0.1}} />
                                {this.renderStarsWithText(0.35, calificationText)}
                                <View style={{  flex: 0.05}} />
                            </React.Fragment>
                        )}
                    </View>
                </View>
            );
        }
    
        return calificationsData;
    }

    render() {
        return (
            <View style={[this.props.style,{ width: '100%' }]}>

                <DividerWithMultipleTexts
                    texts={['Nivel', 'Tipo', 'Ubicación']}
                />

                <View style={dataStyles.dataBox}>
                    <View style={dataStyles.severityBox}>
                        <Image
                            source={this.getLevelIcon()}
                            style={dataStyles.severityIcon}
                        />
                        <Text>{this.getLevelName()}</Text>
                    </View>
                    <Text
                        style={dataStyles.typeText}
                    >
                        {this.props.training.type}
                    </Text>
                    <Text 
                        style={dataStyles.locationText}
                    >
                        {'to be implemented'}
                    </Text>

                </View>

                {this.renderCalificationsData()}

            </View>
        )               
    }
}

const dataStyles = StyleSheet.create({
    dataBox: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between',
        marginTop: 10,
    },

    severityIcon: {
        height: 40,
        aspectRatio: 479/239, 
    },

    severityBox: {
        alignItems: 'center',
        marginLeft: 40,
    },

    typeText: {
        width: 100,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },

    locationText: {
        width: 100, 
        textAlign: 'center',
        color: 'grey',
        marginRight: 40,
    },
})