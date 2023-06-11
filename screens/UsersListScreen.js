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
import { TextDetails, TextSubheader, DividerWithMiddleText } from '../src/styles/BaseComponents';
import { IconButton } from 'react-native-paper'
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import { titleManager } from '../src/TitleManager';
import { UserContext } from '../src/contexts/UserContext';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class UsersListScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        // this.athleteId = this.props.route !== undefined ? this.props.route.params.athleteId : this.props.athleteId

        // TODO: verificar si se termina usando
        console.log("[UsersListScreen] props: " + JSON.stringify(this.props))
        this.params = this.props.route?.params?? this.props
        console.log("[UsersListScreen] Params: " + JSON.stringify(this.params))

        this.state = {
            users: [
                {
                    "id": 82,
                    "fullname": "juan pérez 5",
                    "mail": "probando5@mail.com",
                    "phone_number": "0123456789",
                    "blocked": false,
                    "is_trainer": false,
                    "is_athlete": true,
                    "photo_id": "",
                    "is_verified": true,
                    "expo_push_token": "",
                    "latitude": null,
                    "longitude": null,
                    "weight": 0,
                    "followed": false
                },
                {
                    "id": 26,
                    "fullname": "nom ape",
                    "mail": "mimail@mail.com",
                    "phone_number": "08001234",
                    "blocked": false,
                    "is_trainer": false,
                    "is_athlete": false,
                    "photo_id": "",
                    "is_verified": true,
                    "expo_push_token": "",
                    "latitude": "0",
                    "longitude": "0",
                    "weight": 0,
                    "followed": false
                },
                {
                    "id": 93,
                    "fullname": "Juan Pérez 17",
                    "mail": "probando17@mail.com",
                    "phone_number": "33333333",
                    "blocked": false,
                    "is_trainer": false,
                    "is_athlete": true,
                    "photo_id": "",
                    "is_verified": true,
                    "expo_push_token": "4356",
                    "latitude": null,
                    "longitude": null,
                    "weight": 0,
                    "followed": false
                },
            ]
        }

        this.focusListener = this.props.navigation.addListener('focus', () => {
            //refresh
        })
    }

    onPressSearch(searchText) {
        console.log("[onPressSearch] Search text: " + searchText)
    }

    onPressFilter() {
        console.log("[onPressFilter]")
        // this.setState({ visibleFilter: true })
    }

    onPressUser(userId) {
        console.log("[onPressUser] UserId: " + userId)
    }

    onPressFollow(userId) {
        console.log("[onPressFollow] UserId: " + userId)
    }

    filterPopUp() {
        return
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
                        setSelected={(filteredTypeKeySelected) => this.setState({ filteredTypeKeySelected })}
                        data={this.state.trainingTypes}
                        save="key"
                        defaultOption={this.getTrainingTypeKeyValue()}
                        placeholder="Tipo de entrenamiento"
                        notFoundText="No se encontraron resultados"
                        searchPlaceholder="Buscar"
                        boxStyles={{ borderRadius: 5, width: 200, marginTop: 10 }}
                        inputStyles={{ color: 'black' }}
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
                        boxStyles={{ borderRadius: 5, width: 200, marginTop: 10 }}
                        inputStyles={{ color: 'black' }}
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
                        onSubmit={this.onPressSearch}
                        onIconPress={this.onPressFilter}
                        placeholder="Buscar por nombre"
                        style={{
                            marginTop: 20,
                        }}
                    />

                    {/* <UsersList
                        onPressUser={this.onPressUser}
                        onPressFollow={this.onPressFollow}
                        style={{
                            marginTop: 15,
                        }}
                    /> */}

                    {false && this.filterPopUp()}

                </View>

            </ScrollView>
        );
    }
}
