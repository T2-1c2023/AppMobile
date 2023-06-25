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

export default class StatisticsScreen extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
    }
    componentDidMount() {

    }

    render() {
        return (
            <Text>
                Hola
            </Text>
        )
    }
}
