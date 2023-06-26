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
import { IconButton, ActivityIndicator, Checkbox} from 'react-native-paper'
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../src/TokenManager';
import { titleManager } from '../src/TitleManager';
import { UserContext } from '../src/contexts/UserContext';
import RadiusInput from '../src/components/RadiusInput';
import jwt_decode from 'jwt-decode';

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
        this.onChangeRadius = this.onChangeRadius.bind(this)
        this.onPressFilterSearch = this.onPressFilterSearch.bind(this)
        this.onPressSearch = this.onPressSearch.bind(this)
        this.onPressCancelFilterSearch = this.onPressCancelFilterSearch.bind(this)


        // TODO: verificar si se termina usando
        console.log("[UsersListScreen] props: " + JSON.stringify(this.props))
        this.params = this.props.route?.params ?? this.props
        console.log("[UsersListScreen] Params: " + JSON.stringify(this.params))

        this.state = {
            users: [],
            loading: true,
            visibleFilter: false,
            radiusFilterEnabled: false,
            radiusFilter: 0,
            showAthletesFilter: false,
            showTrainersFilter: false,
        }

        this.previusFilters = {
            radiusFilterEnabled: false,
            radiusFilter: 0,
            showAthletesFilter: false,
            showTrainersFilter: false,
        }

        this.mode = this.params.mode

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.loadUsers()
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

    getParams() {

        let radius = this.state.showTrainersFilter && this.state.radiusFilterEnabled? 
            this.state.radiusFilter : null

        let params = {
            fullname: this.state.fullname,
            radius: radius,
        }

        // quiero ver todos
        if (!this.state.showAthletesFilter && !this.state.showTrainersFilter)
            return params

        //Debe ser entrenador
        if (!this.state.showAthletesFilter && this.state.showTrainersFilter) {
            params['is_trainer'] = true
            return params
        }

        //Debe ser atleta
        if (this.state.showAthletesFilter && !this.state.showTrainersFilter) {
            params['is_athlete'] = true
            return params
        }

        //Debe ser mixto
        if (this.state.showAthletesFilter && this.state.showTrainersFilter) {
            params['is_athlete'] = true
            params['is_trainer'] = true
            return params
        }

        return params
    }

    async loadUsers() {
        this.setState({ loading: true })

        const url = this.getUrl()
        const params = this.getParams()

        const config = { 
            headers: { Authorization: tokenManager.getAccessToken() }, 
            params: params,
        }
        try {
            console.log("[UsersListScreen] Loading users from: " + url + " with config: " + JSON.stringify(config))
            let response = await axios.get(url, config)
            console.log("[UsersListScreen] Response: ", response.data)
            this.setState({ users: response.data }, 
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
        this.setState({ fullname: searchText }, 
            () => {
                this.loadUsers()
            }
        )
    }

    onPressFilter() {
        this.previusFilters = {
            radiusFilterEnabled: this.state.radiusFilterEnabled,
            radiusFilter: this.state.radiusFilter,
            showAthletesFilter: this.state.showAthletesFilter,
            showTrainersFilter: this.state.showTrainersFilter,
        }

        this.setState({ visibleFilter: true })

    }

    onPressUser(userId) {
        this.setState({ loading: true })
        const url = API_GATEWAY_URL + 'users/' + userId
        const token = tokenManager.getAccessToken()
        const config = { headers: { Authorization: token } }
        axios.get(url, config)
            .then(response => {
                console.log(response.data)
                this.props.navigation.navigate('ProfileScreen', { data: response.data, owner: userId === jwt_decode(token).id })
            })
            .catch(function (error) {
                console.error('onPressUser ' + error);
            });
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

    renderAthletesFilter() {
        return(
            <View style={{flexDirection: 'row', width: 200, alignItems:'center', justifyContent:'flex-start'}}>
                <Checkbox
                    status={this.state.showAthletesFilter ? 'checked' : 'unchecked'}
                    onPress={() => {
                        this.setState( { showAthletesFilter: !this.state.showAthletesFilter} );
                    }}
                    theme={{ colors: { primary: '#21005D', onSurfaceVariant: '#21005D', onSurface: '#21005D', } }}
                />

                <Text style={{color:'grey'}}>
                    Deben ser atletas
                </Text>
            </View>
        )
    }

    renderTrainersFilter() {
        return(
            <View style={{flexDirection: 'row', width: 200, alignItems:'center', justifyContent:'flex-start'}}>
                <Checkbox
                    status={this.state.showTrainersFilter ? 'checked' : 'unchecked'}
                    onPress={() => {
                        this.setState( { showTrainersFilter: !this.state.showTrainersFilter} );
                    }}
                    theme={{ colors: { primary: '#21005D', onSurfaceVariant: '#21005D', onSurface: '#21005D', } }}
                />

                <Text style={{color:'grey'}}>
                    Deben ser entrenadores
                </Text>
            </View>
        )
    }

    onChangeRadius(radius) {
        console.log("Radius changed: " + radius)
        this.setState({ radiusFilter: radius })
    }

    renderRadiusFilter() {
        return (
            <RadiusInput
                radiusFilterEnabled={this.state.radiusFilterEnabled}
                radiusFilterChange={() => this.setState({ radiusFilterEnabled: !this.state.radiusFilterEnabled })}
                onChange={this.onChangeRadius}
                value={this.state.radiusFilter}
                disabled={!this.state.showTrainersFilter}
            />
        )
    }

    onPressFilterSearch() {
        this.setState({ visibleFilter: false })
        this.loadUsers()
    }

    onPressCancelFilterSearch() {
        this.setState({ visibleFilter: false })
        this.setState(this.previusFilters)
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

                        {this.renderAthletesFilter()}

                        {this.renderTrainersFilter()}

                        {this.renderRadiusFilter()}

                        <ConfirmationButtons
                            confirmationText={"Buscar"}
                            cancelText="Cancelar"
                            onConfirmPress={this.onPressFilterSearch}
                            onCancelPress={this.onPressCancelFilterSearch}
                            style={{
                                marginTop: 40,
                                alignSelf: 'center',
                            }}
                        />
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
                        placeholder={this.state.fullname?? "Buscar por nombre"}
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
