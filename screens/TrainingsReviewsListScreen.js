import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import styles from '../src/styles/styles';
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../src/TokenManager';
import StarsScore from '../src/components/StarsScore';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class TrainingsReviewsListScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            trainings: [{ "blocked": false, "description": "más flexiones", "id": 55, "score": "3.00", "severity": 2, "title": "más flexiones", "trainer_id": 52, "type": "Fuerza", "type_id": 1 }, { "blocked": false, "description": "caminata larga", "id": 61, "score": "3.00", "severity": 2, "title": "Caminata", "trainer_id": 52, "type": "Resistencia", "type_id": 2 }, { "blocked": false, "description": "full body workout", "id": 76, "score": "3.00", "severity": 1, "title": "Full body", "trainer_id": 34, "type": "Fuerza", "type_id": 1 }],
            reviews: [
                /*{
                    "training_id": 55,
                    "athlete_id": 51,
                    "review": "Me gustó mucho",
                    "score": 3
                },
                {
                    "training_id": 55,
                    "athlete_id": 51,
                    "review": "",
                    "score": 4
                },
                {
                    "training_id": 55,
                    "athlete_id": 51,
                    "review": "Muy exigente",
                    "score": 4
                },
                {
                    "training_id": 55,
                    "athlete_id": 51,
                    "review": "Excelente, me sirvió para entrenar todo",
                    "score": 5
                }*/
            ]
        }
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.fetchReviews();
        });
    }

    componentDidMount() {
        this.fetchReviews();
    }

    fetchReviews() {

        let url = API_GATEWAY_URL + 'trainings/' + this.props.route.params.trainingId + '/reviews'
        axios.get(url, {
            headers: {
                Authorization: tokenManager.getAccessToken()
            },
        })
            .then(response => {
                console.log("recibí response fetchReviews"); //debug
                const reviews = response.data;
                //console.log(trainings)
                this.setState({ reviews });
            })
            .catch(function (error) {
                console.log("refreshActivities " + error);
            });
    }

    render() {
        return (
            <ScrollView
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >

                <View style={styles.container}>

                    <View style={[this.props.style, { width: '100%' }]}>
                        {this.state.reviews.map((review) => {
                            return (

                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => console.log("pressed review")}
                                >
                                    <View style={[trainingStyles.reviewContainer]}>



                                        {/* divider */}
                                        <View style={{ height: 1, backgroundColor: 'grey' }} />

                                        <View style={{ flexDirection: 'row' }}>

                                            <Text style={trainingStyles.titleText} multiline>
                                                {review.review}
                                            </Text>

                                            <View style={{ flexGrow: 1, flexDirection: 'row' }}>

                                            </View>

                                        </View>

                                        {/* end-divider */}
                                        <View style={{ height: 2, backgroundColor: 'grey' }} />
                                    </View>
                                </TouchableOpacity>


                            )
                        })}
                    </View>

                </View>

            </ScrollView>
        );
    }
}

const trainingStyles = StyleSheet.create({
    reviewContainer: {
        flex: 1,
        height: 50,
        width: "95%",
    },
    titleText: {
        fontSize: 18,
        marginLeft: 10,
        width: '70%',
    },
    profilePicContainer: {
        flex: 0.4,
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 140 / 2,
        alignSelf: 'center',
    },
})

/*
<StarsScore
                                                score={review.score}
                                                style={{
                                                    alignSelf: 'flex-start',
                                                    marginRight: 3,
                                                }}
                                            />
*/