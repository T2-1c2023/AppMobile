import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { SelectList } from 'react-native-dropdown-select-list'
import LevelInput from '../src/components/LevelInput';
import { ConfirmationButtons } from '../src/styles/BaseComponents';

import axios from 'axios';


export default class NewTrainingScreen extends Component {
    constructor(props) {
        super(props)
        this.handleCreatePress = this.handleCreatePress.bind(this)
        this.handleCancelPress = this.handleCancelPress.bind(this)
        this.state = {
            trainingTypes: {},
            title: '',
            description: '',
            trainingTypeId: '',
            level: 'basic',
        }
    }

    async getTrainingsTypes() {
        const response = await axios.get('https://trainings-g6-1c-2023.onrender.com/training-types')       
        return response.data
    }

    async componentDidMount() {
        const data = await this.getTrainingsTypes()

        const trainingTypes = data.map((trainingType) => {
            return {"key": trainingType.id, "value": trainingType.description}
        })

        this.setState({ trainingTypes  })
    }

    handleCreatePress() {
        const body = {
            "trainer_id": 1,
            "title": this.state.title,
            "description": this.state.description,
            "type_id": this.state.trainingTypeId,
            "level": this.state.level,
        }
        console.log(body)
    }

    handleCancelPress() {
        alert('Cancel pressed')
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
                    setSelected={(trainingTypeId) => this.setState({ trainingTypeId })} 
                    data={this.state.trainingTypes} 
                    save="key"
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
                        marginTop: 10,
                    }}
                />

                <DividerWithLeftText
                    text="Ubicación"
                    style={{
                        marginTop: 10,
                    }}
                />

                {/* TODO: reemplazar por componente de input de ubicación
                -------------------- */}
                <Text>To be implemented </Text>
                {/* -------------------- */}

                <ConfirmationButtons 
                    confirmationText="Crear entrenamiento "
                    cancelText="Cancelar"
                    onConfirmPress={this.handleCreatePress}
                    onCancelPress={this.handleCancelPress}
                    style={{
                        marginTop: 20,
                    }}
                />
            </View>
              
            </ScrollView>
        );
    }
}
