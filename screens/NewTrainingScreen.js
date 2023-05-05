import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { SelectList } from 'react-native-dropdown-select-list'
import LevelInput from '../src/components/LevelInput';



export default class NewTrainingScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
            trainingType: '',
            level: 'basic',
        }
    }

    getTrainingsTypes() {

        // reemplazar por request de tipos de entrenamiento
        //-----------------------------------------------
        const trainingTypes = ['Fuerza','Resistencia','Flexibilidad','Velocidad','Agilidad','Equilibrio','Coordinación','Potencia','Precisión','Fuerza explosiva','Fuerza reactiva','Fuerza resistencia','Fuerza máxima','Fuerza velocidad','Resistencia aeróbica','Resistencia anaeróbica','Resistencia de fuerza','Running','Ciclismo','Natación','Triatlón','Crossfit','Calistenia','Gimnasia','Yoga','Pilates','Artes marciales','Deportes de raqueta','Deportes de equipo',]
        //-----------------------------------------------
        
        return trainingTypes
    }

    render() {

        const trainingTypes = this.getTrainingsTypes()

        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>
                
                <TextBox 
                    title="Título"
                    onChangeText={(title) => this.setState({ title })}
                    maxLength={60}
                    style={{
                        marginTop: 5,
                    }}
                />
                
                <TextBox 
                    title="Descripción"
                    onChangeText={(description) => this.setState({ description })}
                    maxLength={250}
                    style={{
                        marginTop: 5,
                    }}
                />

                <DividerWithLeftText
                    text="Tipo"
                    style={{
                        marginTop: 5,
                    }}
                />

                <SelectList
                    setSelected={(trainingType) => this.setState({ trainingType })} 
                    data={trainingTypes} 
                    save="value"
                    placeholder="Tipo de entrenamiento"
                    notFoundText="No se encontraron resultados"
                    searchPlaceholder="Buscar"
                    boxStyles={{borderRadius: 5, width: 350, marginTop: 10}}
                    inputStyles={{color: 'black'}}
                />

                <DividerWithLeftText
                    text="Nivel"
                    style={{
                        marginTop: 10,
                    }}
                />

                <LevelInput 
                    initialLevel={this.state.level}
                    setSelected={(level) => this.setState({ level })}
                    style={{
                        marginTop: 5,
                    }}
                />

                
            </View>
              
            </ScrollView>
        );
    }
}
