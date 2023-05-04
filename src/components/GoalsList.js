import React, { Component } from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';

export default class GoalsList extends Component {
    constructor(props) {
        super(props)
    }

    getUriById(image_id) {

        //reemplazar por logica de obtener imagen a partir de id
        //----------------
        return 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg'

        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/220px-Cat_November_2010-1a.jpg'
        //----------------
    }

    goal(goal, index) {
        return (
            <Card 
                key={`${goal.goal_id}-${index}`} 
                style={goalsStyle.card}
            >
                {goal.image_ids.length > 0 ?
                    (<Image
                        source={{ uri: this.getUriById(goal.image_ids[0]) }}
                        style={ goalsStyle.cardImage }
                        resizeMode= 'contain'
                    />)
                    :
                    (<Image
                        source={require('./fiufit.png')}
                        style={[goalsStyle.cardWithoutImage, {alignSelf: 'center'}]}
                        resizeMode= 'contain'
                    />)
                }
                <Card.Content>
                <Text 
                    variant="titleMedium"
                    numberOfLines={2}
                >
                    {goal.title}
                </Text>
                <Text 
                    variant="bodySmall"
                    numberOfLines={4}
                >
                    {goal.description}
                </Text>
                </Card.Content>
            </Card>
        )
    }

    render() {
        goals_right = this.props.goals.slice(0, this.props.goals.length/2)
        goals_left = this.props.goals.slice(this.props.goals.length/2, this.props.goals.length)
        return (
            <View style={[this.props.style,{flexDirection: 'row'}]}>
                <View style={{
                    width: '50%',
                }}>
                    {goals_left.map((goal, index) => this.goal(goal, index))}
                </View>
                <View style={{
                    width: '50%',
                }}>
                    {goals_right.map((goal, index) => this.goal(goal, index))}
                </View>
            </View>
        )               
    }
}

const goalsStyle = StyleSheet.create({
    card: {
        height: 250,
        margin: 5,
        borderWidth: 1,
        backgroundColor: '#CCC2DC',
    },
    cardImage: {
        height: 125,
        margin: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    cardWithoutImage: {
        height: 125,
        width: '99%',
        margin: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
})