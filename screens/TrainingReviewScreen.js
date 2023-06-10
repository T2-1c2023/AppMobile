import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { TextDetails } from '../src/styles/BaseComponents';
import { TextBox } from '../src/styles/BaseComponents';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { ConfirmationButtons } from '../src/styles/BaseComponents';
import Constants from 'expo-constants'
import axios from 'axios';
import { tokenManager } from '../src/TokenManager';
import jwt_decode from 'jwt-decode';
import { titleManager } from '../src/TitleManager';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class TrainingReviewScreen extends Component {
    constructor(props) {
        super(props)
        console.log("this.props: ", this.props)
        this.loadReviewInfo = this.loadReviewInfo.bind(this);
        this.handleSendReview = this.handleSendReview.bind(this);
        this.sendTextReview = this.sendTextReview.bind(this);

        this.trainingId = this.props.route.params.trainingId;
        this.state = {
            starRating: 5,
            training: {
                title: 'Título',
                description: 'Descripción',
            },
            title: '',
            description: '',
            review: '',
            initialReview: 'Define tu experiencia',
            axiosReviewMethod: axios.post,
        }
        this.starRatingOptions = [1, 2, 3, 4, 5];
        this.axiosRatingMethod = this.props.route.params.alreadyRated ? axios.patch : axios.post;
        this.token = tokenManager.getAccessToken();
    }

    componentDidMount() {
        titleManager.setTitle(this.props.navigation, "Calificar entrenamientos", 22)
        //console.log(this.props.route.params.training)
        //console.log("alreadyrated " + this.props.route.params.alreadyRated)
        if (this.props.route.params.alreadyRated)
        {
            console.log("already rated")
            this.loadRatingInfo();
            this.loadReviewInfo();
        }
        this.setState({
            title: this.props.route.params.trainingTitle,
            description: this.props.route.params.trainingDescription,
        });
        console.log(this.props.route.params.alreadyRated);
    }

    loadRatingInfo() {
        const url = API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId + '/ratings';
        console.log(url)

        const params = { athlete_id: this.props.route.params.userId }
        console.log(params)
        axios.get(url, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            },
            params: params
        })
            .then((response) => {
                //this.setState({ goals: response.data });
                console.log("response data " + response.data);
                //console.log(response.data[0].score)
                this.setState({starRating: response.data[0].score});
                
                //this.state.review = response.review;
            })
            .catch((error) => {
                console.error("loadReviewInfo " + error);
            })
    }

    loadReviewInfo() {
        const url = API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId + '/reviews';
        console.log(url)

        const params = { athlete_id: this.props.route.params.userId }
        console.log(params)
        axios.get(url, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            },
            params: params
        })
            .then((response) => {
                //this.setState({ goals: response.data });
                console.log("response data " + response.data);
                if (response.data.length > 0) {
                    this.setState({axiosReviewMethod:axios.patch});//TO_DO ver si se puede juntar review y rating, o hacer otra query
                }
                
                
                //this.state.review = response.review;
            })
            .catch((error) => {
                console.error("loadReviewInfo " + error);
            })
    }

    handleSendReview = async () => {
        

        const url = API_GATEWAY_URL + 'trainings/' + this.trainingId + '/ratings';
        const body = {athlete_id: this.props.route.params.userId, score: this.state.starRating}
        console.log("[handleSendReview] url: ", url)
        console.log("[handleSendReview] body: ", body)
        

        await this.axiosRatingMethod(url, body, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            },
        })
            .then((response) => {
                //this.setState({ goals: response.data });
                console.log("rating post " + response.data);
                this.sendTextReview();
                this.props.navigation.navigate('TrainingScreen', {userData: jwt_decode(this.token), token:this.token, trainingId: this.props.route.params.trainingId})
            })
            .catch((error) => {
                console.error("handleSendReview " + error);
            })
    }

    sendTextReview = async () => {
        if (this.state.review.length > 0)
        {
            const url = API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId + '/reviews';
            //console.log(url);
            const body = {athlete_id: this.props.route.params.userId, review: this.state.review}
            //console.log(body);
            /*console.log(url)
            console.log(body)
            console.log(tokenManager.getAccessToken())*/
            console.log("sendtextreview")
            if (this.state.axiosReviewMethod === axios.post) {console.log("es post")} else {console.log("no es post")}
            if (this.state.axiosReviewMethod === axios.patch) {console.log("es patch")} else {console.log("no es patch")}
            await this.state.axiosReviewMethod(url, body, {
                headers: {
                    Authorization: tokenManager.getAccessToken()
                },
            })
                .then((response) => {
                    //this.setState({ goals: response.data });
                    console.log("review post " + response.data);
                })
                .catch((error) => {
                    console.error("sendTextReview " + error);
                })
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <TextDetails
                    body={this.state.title}
                    style={{
                        marginTop: 15,
                        width: '90%',
                        fontSize: 25,
                        height: 20
                    }}
                    //alignLeft
                />

                <TextDetails
                    body={this.state.description}
                    style={{
                        marginTop: 5,
                        width: '90%',
                    }}
                    alignLeft
                />

                <View style={styles.container}>
                    <View style={styles.stars}>
                        {this.starRatingOptions.map((option) => (
                            <TouchableOpacity key={option} onPress={() => { /*console.log("USERID " + this.props.route.params.userId); console.log(this.state.review);*/ this.setState({ starRating: option }); }}>
                                <MaterialIcons
                                    // key={option}
                                    name={this.state.starRating >= option ? 'star' : 'star-border'}
                                    size={50}
                                    style={this.state.starRating >= option ? styles.starSelected : styles.starUnselected}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TextBox
                    title="Detalle"
                    onChangeText={(review) => this.setState({ review })}
                    maxLength={60}
                    placeholder={this.state.initialReview}
                    style={{
                        marginTop: 5,
                    }}
                />

                <ConfirmationButtons
                    confirmationText={"Enviar calificación"}
                    cancelText="Cancelar"
                    onConfirmPress={this.handleSendReview}
                    onCancelPress={() => this.props.navigation.goBack()}
                    style={{
                        marginTop: 20,
                        justifyContent: 'center',
                        marginBottom: "90%",
                    }}
                />

                

            </View>

        )
    }
}

const styles = StyleSheet.create({
    drawerIconContainer: {
        marginRight: -20
    },
    container: {
        backgroundColor: '#DED8E1',
        flex: 1,
        alignItems: 'center',
        //marginBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    stars: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40
    },
    starUnselected: {
        color: '#aaa',
    },
    starSelected: {
        color: '#ffb300',
    },
});