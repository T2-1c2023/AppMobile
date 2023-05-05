import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DaysInput, DividerWithLeftText, TextBox, ButtonStandard, ConfirmationButtons } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

import { Searchbar } from 'react-native-paper';

const trainingTypes = ['Fuerza','Resistencia','Flexibilidad','Velocidad','Agilidad','Equilibrio','Coordinación','Potencia','Precisión','Fuerza explosiva','Fuerza reactiva','Fuerza resistencia','Fuerza máxima','Fuerza velocidad','Resistencia aeróbica','Resistencia anaeróbica','Resistencia de fuerza','Running','Ciclismo','Natación','Triatlón','Crossfit','Calistenia','Gimnasia','Yoga','Pilates','Artes marciales','Deportes de raqueta','Deportes de equipo',]

export default class NewTrainingScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
        }
    }

    render() {

        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>
                
                <TextBox 
                    title="Título"
                    onChangeText={(metric) => this.setState({ title })}
                    maxLength={60}
                    style={{
                        marginTop: 5,
                    }}
                />
                
                <TextBox 
                    title="Descripción"
                    onChangeText={(metric) => this.setState({ description })}
                    maxLength={250}
                    style={{
                        marginTop: 5,
                    }}
                />

                <SearchWithDropdown />

                <TextBox 
                    title="Título"
                    onChangeText={(metric) => this.setState({ title })}
                    maxLength={60}
                    style={{
                        marginTop: 5,
                    }}
                />
            </View>
              
            </ScrollView>
        );
    }
}

class SearchWithDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchQuery: '',
        }
    }

    render() {
        const { searchQuery } = this.state;

        const filteredTrainingTypes = trainingTypes.filter(trainingType =>
            trainingType.toLowerCase().includes(searchQuery.toLowerCase())
          );

        return (
            <>
            
            <Searchbar
                placeholder="Tipo de entrenamiento"
                onChangeText={(searchQuery) => this.setState({ searchQuery })}
                value={searchQuery}
            />
            {filteredTrainingTypes.slice(0, 6).map(trainingType => (
                <Text key={trainingType}>{trainingType}</Text>
              ))}
            </>
        );
    }
}