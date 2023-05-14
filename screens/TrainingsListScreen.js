import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import TrainingsList from '../src/components/TrainingsList';
import Modal from "react-native-modal";
import { SelectList } from 'react-native-dropdown-select-list'
import { TextDetails, TextSubheader, DividerWithMiddleText}  from '../src/styles/BaseComponents';

import axios from 'axios';

export default class TrainingsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handleTrainingPress = this.handleTrainingPress.bind(this)
        this.handleFilterPress = this.handleFilterPress.bind(this)
        this.state = {
            trainings: [],
            filteredTypeKeySelected: 0,
            filteredLevelKeySelected: 0,
            filteredTypeKeyApplied: 0,
            filteredLevelKeyApplied: 0,
            trainingTypes: [],
            visibleFilter: false,
        }
        this.levels=[
            {"key": 0, "value": "Todos"}, 
            {"key": 1, "value": "Básico"},
            {"key": 2, "value": "Intermedio"},
            {"key": 3, "value": "Avanzado"},
        ]
    }

    componentDidMount() {
        this.refreshActivities();
        this.refreshTrainingsTypes();
    }

    handleTrainingPress(id) {
        alert('training with id ' + id + ' pressed')
    }

    handleFilterPress() {
        // agregar logica de pedido de filtrado a usuario
        this.setState({ visibleFilter: true })


        // reemplazar por request con query params
        axios.get('https://trainings-g6-1c-2023.onrender.com/trainings/')
            .then(response => {
                const trainings = response.data;
                this.setState({ trainings });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    refreshActivities() {
        axios.get('https://trainings-g6-1c-2023.onrender.com/trainings/')
            .then(response => {
                const trainings = response.data;
                this.setState({ trainings });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    refreshTrainingsTypes() {
        axios.get('https://trainings-g6-1c-2023.onrender.com/training-types')
            .then(response => {
                const trainingTypes = response.data.map((trainingType) => {
                    return {"key": trainingType.id, "value": trainingType.description}
                })
                trainingTypes.unshift({"key": 0, "value": "Todos"})
                this.setState({ trainingTypes });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    handleSearch() {

    }

    render() {
        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>
                <SearchInputWithIcon
                    filter
                    onIconPress={this.handleFilterPress}
                    onSubmit={this.handleSearch}
                    placeholder="Buscar por título"
                    style={{
                        marginTop: 20,
                    }}
                />

                <TrainingsList
                    trainings={this.state.trainings}
                    onTrainingPress={this.handleTrainingPress}
                    style={{
                        marginTop: 15,
                    }}
                />

                <Modal 
                    isVisible={this.state.visibleFilter}
                >
                    <ScrollView
                        >
                    <View 
                        style={{ 
                            alignSelf: 'center',
                            alignItems: 'center', 
                            justifyContent: 'flex-start', 
                            marginTop: 50, 
                            backgroundColor: '#CCC2DC',
                            borderRadius: 10, 
                            width: 300,
                            height: 600,
                        }}
                    >
                        <TextSubheader 
                            body="Filtros de busqueda"
                        />

                        <TextDetails 
                            body="Tipo de entrenamiento"
                            style={{
                                marginTop: 20,
                            }}
                        />

                        <SelectList
                            setSelected={(trainingTypeId) => this.setState({ trainingTypeId })} 
                            data={this.state.trainingTypes}
                            save="key"
                            defaultOption={{"key": 0, "value": "Todos"}}
                            placeholder="Tipo de entrenamiento"
                            notFoundText="No se encontraron resultados"
                            searchPlaceholder="Buscar"
                            boxStyles={{borderRadius: 5, width: 200, marginTop: 10}}
                            inputStyles={{color: 'black'}}
                        />

                        <TextDetails 
                            body="Nivel de entrenamiento"
                            style={{
                                marginTop: 20,
                            }}
                        />

                        <SelectList
                            setSelected={(trainingTypeId) => this.setState({ trainingTypeId })} 
                            data={this.levels}
                            defaultOption={{"key": 0, "value": "Todos"}}
                            save="key"
                            placeholder="Nivel de entrenamiento"
                            notFoundText="No se encontraron resultados"
                            searchPlaceholder="Buscar"
                            boxStyles={{borderRadius: 5, width: 200, marginTop: 10}}
                            inputStyles={{color: 'black'}}
                            maxHeight={170}
                        />

                        <View
                            style={{
                                alignItems: 'center',
                            }}
                        >
                            <ConfirmationButtons
                                onConfirm={() => this.setState({ visibleFilter: false })}
                                onCancel={() => this.setState({ visibleFilter: false })}
                                confirmationText="Aplicar"
                                cancelText="Cancelar"
                                style={{
                                    marginTop: 20,
                                }}
                            />
                        </View>
                    </View>
                    </ScrollView>
                </Modal>

            </View>
              
            </ScrollView>
        );
    }
}
