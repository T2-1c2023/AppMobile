import React, { Component } from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import { DividerWithLeftText, TextBox } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';
import { ConfirmationButtons, ButtonStandard } from '../src/styles/BaseComponents';
import ActivityList from '../src/components/ActivityList.js'
import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import UsersList from '../src/components/UsersList';
import Modal from "react-native-modal";
import { SelectList } from 'react-native-dropdown-select-list'
import { TextDetails, TextSubheader, DividerWithMiddleText } from '../src/styles/BaseComponents';
import { IconButton, ActivityIndicator } from 'react-native-paper'
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../src/TokenManager';
import { titleManager } from '../src/TitleManager';
import { UserContext } from '../src/contexts/UserContext';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export const UsersListMode = {
    Followed: 'followed',
    Followers: 'followers',
    Search: 'search',
}

export default class UsersListScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        // this.athleteId = this.props.route !== undefined ? this.props.route.params.athleteId : this.props.athleteId
        this.onPressFollow = this.onPressFollow.bind(this)
        this.onPressUser = this.onPressUser.bind(this)
        this.onPressFilter = this.onPressFilter.bind(this)


        // TODO: verificar si se termina usando
        console.log("[UsersListScreen] props: " + JSON.stringify(this.props))
        this.params = this.props.route?.params ?? this.props
        console.log("[UsersListScreen] Params: " + JSON.stringify(this.params))

        this.state = {
            initialUsers: [],
            users: [],
            loading: true,
            visibleFilter: false,
        }

        this.mode = this.params.mode

        this.focusListener = this.props.navigation.addListener('focus', () => {
            //refresh
        })
    }

    getUrl() {
        switch (this.mode) {
            case UsersListMode.Followed:
                return API_GATEWAY_URL + 'users/' + this.context.userId + '/followed'
            case UsersListMode.Followers:
                return API_GATEWAY_URL + 'users/' + this.context.userId + '/followers'
            case UsersListMode.Search:
                return API_GATEWAY_URL + 'users'
            default:
                throw new Error("[UsersListScreen] Invalid mode: " + this.mode)
        }
    }

    async loadUsers() {
        const url = this.getUrl()
        const config = { headers: { Authorization: tokenManager.getAccessToken() } }
        try {
            let response = await axios.get(url, config)
            this.setState({ users: response.data, initialUsers: response.data }, 
                () => {
                    this.setState({ loading: false })
                })
        } catch (error) {
            console.log("[UsersListScreen] Error: " + JSON.stringify(error))
        }
    }

    async componentDidMount() {

        await this.loadUsers()

    }

    onPressSearch(searchText) {
        console.log("[onPressSearch] Search text: " + searchText)
    }

    onPressFilter() {
        this.setState({ visibleFilter: true })
    }

    onPressUser(userId) {
        console.log("[UserListScreen - onPressUser] UserId: " + userId)
    }

    updateUsersState(userIdToUpdate, followed) {
        this.setState(prevState => ({
            users: prevState.users.map(user => {
                if (user.id === userIdToUpdate) {
                    return { ...user, followed: followed };
                }
                return user;
            })
        }))
    }

    sendFollowRequest(userIdToFollow, newStateLoadedSignal) {
        const url = API_GATEWAY_URL + 'users/' + this.context.userId + '/followed'
        const config = { headers: { Authorization: tokenManager.getAccessToken() } }
        const data = {
            followed_id: userIdToFollow
        }

        console.log("Sending follow request...")
        axios.post(url, data, config)
            .then((response) => {
                console.log("follow successfull!")
                const followed = true
                this.updateUsersState(userIdToFollow, followed)
                newStateLoadedSignal.call()
            })
            .catch((error) => {
                console.log("[sendFollowRequest] Error: " + JSON.stringify(error))
            })
    }

    sendUnfollowRequest(userIdToUnfollow, newStateLoadedSignal) {
        // /users/{id}/followed
        const url = API_GATEWAY_URL + 'users/' + this.context.userId + '/followed'
        const config = {
            data: { followed_id: userIdToUnfollow },
            headers: { Authorization: tokenManager.getAccessToken() }
        }

        console.log("Sending unfollow request...")
        axios.delete(url, config)
            .then((response) => {
                console.log("unfollow successfull!")
                const followed = false
                this.updateUsersState(userIdToUnfollow, followed)
                newStateLoadedSignal.call()
            })
            .catch((error) => {
                console.log("[sendUnfollowRequest] Error: " + JSON.stringify(error))
            })
    }

    onPressFollow(user, newStateLoadedSignal) {
        user.followed ?
            this.sendUnfollowRequest(user.id, newStateLoadedSignal)
            :
            this.sendFollowRequest(user.id, newStateLoadedSignal)


    }

    filterPopUp() {
        return (

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

                        {/* <SelectList
                            setSelected={(filteredTypeKeySelected) => this.setState({ filteredTypeKeySelected })}
                            data={this.state.trainingTypes}
                            save="key"
                            defaultOption={this.getTrainingTypeKeyValue()}
                            placeholder="Tipo de entrenamiento"
                            notFoundText="No se encontraron resultados"
                            searchPlaceholder="Buscar"
                            boxStyles={{ borderRadius: 5, width: 200, marginTop: 10 }}
                            inputStyles={{ color: 'black' }}
                        /> */}


                        <View
                            style={{
                                alignItems: 'center',
                            }}
                        >
                            <ConfirmationButtons
                                onConfirmPress={() => console.log("confirm pressed")}
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
        )
    }

    renderLoadingMessage() {
        return (
            <View style={{alignItems: "center"}}>
                <ActivityIndicator size="large" color="#21005D" style={{marginTop: 100}} />
                <Text style={{marginTop: 30}}>Buscando usuarios...</Text>
            </View>
        )
    }

    renderUsersList() {
        return (
            <UsersList
                users={this.state.users}
                excludedUser={this.context.userId}
                onPressUser={this.onPressUser}
                onPressFollow={this.onPressFollow}
                style={{
                    marginTop: 15,
                }}
            />
        )
    }

    renderNoUsersFoundMessage() {
        return (
            <View style={{alignItems: "center", marginTop: 80}}>
                <Image
                    source={require('../assets/images/empty_icon.png')}
                    style={{
                        aspectRatio: 311/269, 
                        height: 100,
                    }}
                />
                <Text style={{textAlign: 'center', marginTop: 20}}>
                    No se encontraron usuarios
                </Text>
            </View>
        )
    }

    renderNameInputAndUsersList() {
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

                    {this.state.users.length == 0 ?
                        this.renderNoUsersFoundMessage()
                        :
                        this.renderUsersList()
                    }

                    {this.filterPopUp()}

                </View>
            </ScrollView>
        )
    }

    render() {
        if (this.state.loading) {
            return this.renderLoadingMessage()
        } else {
            return this.renderNameInputAndUsersList()
        }
    }
}
