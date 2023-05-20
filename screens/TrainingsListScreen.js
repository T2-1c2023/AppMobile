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
import { IconButton } from 'react-native-paper'
import axios from 'axios';
import Constants from 'expo-constants'
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class TrainingsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handleTrainingPress = this.handleTrainingPress.bind(this)
        this.handleFilterPress = this.handleFilterPress.bind(this)
        this.handleSetFilters = this.handleSetFilters.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
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
        this.token = tokenManager.getAccessToken()
    }

    componentDidMount() {
        this.refreshActivities();
        this.refreshTrainingsTypes();

        
        // reemplazar true por consulta al token o al contexto sobre si el usuario es trainer y sobre si 
        trainingCreationAvailable = jwt_decode(this.token).is_trainer;


        this.props.navigation.setOptions({
            headerRight: () => (
                <IconButton
                icon={'plus'}
                iconColor='black'
                size={30}
                onPress={() => this.props.navigation.navigate('NewTrainingScreen', { trainerData: tokenManager.getAccessToken() })} //debug
              />
            ),
          });
    }

    handleSetFilters() {
        this.setState({
            filteredTypeKeyApplied: this.state.filteredTypeKeySelected,
            filteredLevelKeyApplied: this.state.filteredLevelKeySelected,
            visibleFilter: false,
        }, () => {
            const decodedToken = jwt_decode(this.token);
            const params = decodedToken.is_trainer ? {trainer_id: decodedToken.id} : {blocked: false}
            if (this.state.filteredTypeKeyApplied !== 0) { params.type_id = this.state.filteredTypeKeyApplied }
            if (this.state.filteredLevelKeyApplied !== 0) { params.severity = this.state.filteredLevelKeyApplied }  
            axios.get(API_GATEWAY_URL + 'trainings/', {
                    headers: {
                        Authorization: tokenManager.getAccessToken()
                    },
                    params: params
                })
                .then(response => {
                    console.log("recibí response"); //debug
                    console.log("response.data: " + response.data);//debug
                    const trainings = response.data;
                    this.setState({ trainings });
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        )

        
    }

    handleTrainingPress(id) {
        this.props.navigation.navigate('TrainingScreen', { userData: jwt_decode(this.token), token:this.token, trainingId: id });
    }

    handleFilterPress() {
        console.log("filter press");
        // agregar logica de pedido de filtrado a usuario
        this.setState({ visibleFilter: true })

        
    }


    refreshActivities() {
        console.log("refresh activities");
        const decodedToken = jwt_decode(this.token);
        const params = decodedToken.is_trainer ? {trainer_id: decodedToken.id} : {blocked: false}
        axios.get(API_GATEWAY_URL + 'trainings/', {
            headers: {
                Authorization: tokenManager.getAccessToken()
            },             
            params: params 
            })
            .then(response => {
                console.log("recibí response activities"); //debug
                const trainings = response.data;
                this.setState({ trainings });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    refreshTrainingsTypes() {
        axios.get(API_GATEWAY_URL + 'training-types', {
                headers: {
                    Authorization: tokenManager.getAccessToken()
                }
            })
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

    handleSearch(searchText) {

        console.log("searching for: ")
        console.log(searchText)

        console.log("for training type: ") 
        console.log(this.state.filteredTypeKeySelected)
        console.log(this.state.filteredTypeKeyApplied)
        
        console.log("for training level: ")
        console.log(this.state.filteredLevelKeySelected)
        console.log(this.state.filteredLevelKeyApplied)
        
    }

    getTrainingTypeKeyValue() {
        return this.state.trainingTypes.find((trainingType) => {
            return trainingType.key == this.state.filteredTypeKeyApplied
        })
    }

    getTrainingLevelKeyValue() {
        return this.levels.find((level) => {
            return level.key == this.state.filteredLevelKeyApplied
        })
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
                    animationIn="slideInDown"
                    animationOut="slideOutUp"
                    animationInTiming={100}
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
                            body="Filtros de búsqueda"
                        />

                        <TextDetails 
                            body="Tipo de entrenamiento"
                            style={{
                                marginTop: 20,
                            }}
                        />

                        <SelectList
                            //setSelected={(filteredTypeKeySelected) => this.setState({ filteredTypeKeySelected })}
                            setSelected={(filteredTypeKeySelected) => { this.setState({ filteredTypeKeySelected });console.log("filteredTypeKeySelected: " + filteredTypeKeySelected) } }//debug
                            data={this.state.trainingTypes}
                            save="key"
                            defaultOption={this.getTrainingTypeKeyValue()}
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
                            setSelected={(filteredLevelKeySelected) => this.setState({ filteredLevelKeySelected })} 
                            data={this.levels}
                            defaultOption={this.getTrainingLevelKeyValue()}
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
                                onConfirmPress={this.handleSetFilters}
                                onCancelPress={() => this.setState({ visibleFilter: false })}
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
