import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import styles from '../src/styles/styles';
import axios from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../src/TokenManager';
import StarsScore from '../src/components/StarsScore';
import { titleManager } from '../src/TitleManager';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

export default class TrainingsReviewsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handlePressedReview = this.handlePressedReview.bind(this)
        this.state = {
            reviews: [],
            //reviewersMap: '',
        }
        this.emptyBodyWithToken = {
            headers: {
                Authorization: tokenManager.getAccessToken()
            }
        }
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.fetchReviews();
        });
    }

    componentDidMount() {
        this.fetchReviews();
        titleManager.setTitle(this.props.navigation, "Ver calificaciones", 22)
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
                this.setState({ reviews }/*, this.fetchReviewersData(reviews)*/);
            })
            .catch(function (error) {
                console.log("refreshActivities " + error);
            });
    }

    /*fetchReviewersData(reviews) {
        let map = new Map();
        const token = tokenManager.getAccessToken();
        reviews.forEach(review => {
            let url = API_GATEWAY_URL + 'users/' + review.athlete_id
            axios.get(url, {
                headers: {
                    Authorization: token
                },
            })
                .then(response => {
                    //console.log("recibí response fetchReviews"); //debug
                    //const reviews = response.data;
                    //console.log(trainings)
                    //this.setState({ reviews }, this.fetchReviewersData(reviews));
                    console.log(response.data)
                    map.set(review.athlete_id, response.data.fullname)
                    console.log(JSON.stringify(map))
                    console.log(map.get(review.athlete_id))
                })
                .catch(function (error) {
                    console.log("refreshActivities " + error);
                });
        });
        this.setState({ reviewersMap: map })
    }*/

    handlePressedReview(athleteId) {
        //console.log(JSON.stringify(this.state.reviewersMap.get(athleteId)))
        console.log('pressed review ' + athleteId)
        const url = API_GATEWAY_URL + 'users/' + athleteId
        axios.get(url, this.emptyBodyWithToken)
            .then(response => {
                console.log(response.data)
                this.props.navigation.navigate('ProfileScreen', { data: response.data, navigation: this.props.navigation, owner: false })
            })
            .catch(function (error) {
                console.error('handlePressedReview ' + error);
            });
    }

    /*renderReviewerInfo(review) {
        return (
            <Text key={review.athlete_id} style={trainingStyles.titleText} multiline>
                {this.state.reviewersMap.get(review.athlete_id)}
            </Text>
        )
    }*/

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
                                    onPress={() => this.handlePressedReview(review.athlete_id)}

                                >
                                    <View style={[trainingStyles.reviewContainer]}>



                                        {/* divider */}
                                        <View style={{ height: 1, backgroundColor: 'grey' }} />

                                        <View style={{ flexDirection: 'row' }}>

                                            <Text key={review.review} style={trainingStyles.titleText} multiline>
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