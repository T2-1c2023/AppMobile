import React, { Component } from 'react';
import { Avatar, Button, Card, Text, IconButton } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';

class Goal extends Component {
    constructor(props) {
        super(props)
        this.handleLongPress = this.handleLongPress.bind(this)
        this.handlePress = this.handlePress.bind(this)
        this.state = {
            selected: false,
        }
    }

    getUriById(image_id) {

        //reemplazar por logica de obtener imagen a partir de id
        //----------------
        return 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg'
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/220px-Cat_November_2010-1a.jpg'
        //----------------
    }

    handleLongPress() {
        this.setState({selected: !this.state.selected})
    }

    handlePress() {
        this.props.onPress(this.props.goal)
    }

    render() {
        return (
            <Card
                elevation={3}
                style={this.state.selected? goalsStyles.cardSelected : goalsStyles.card}
                onLongPress={this.handleLongPress}
                onPress={this.handlePress}
            >
                <View style={{ position: 'relative' }}>
                    {this.props.goal.image_ids.length > 0 ?
                        (<Image
                            source={{ uri: this.getUriById(this.props.goal.image_ids[0]) }}
                            style={ goalsStyles.cardImage }
                            resizeMode= 'contain'
                        />)
                        :
                        (<Image
                            source={require('./fiufit.png')}
                            style={[goalsStyles.cardWithoutImage, {alignSelf: 'center'}]}
                            resizeMode= 'contain'
                        />)
                    }
                    {this.state.selected &&
                        <View style={goalsStyles.cardSelectedIcon}>
                            <IconButton
                                icon="check"
                                iconColor='white'
                                size={15}
                            />
                        </View>
                    }
                </View>
                <Card.Content>
                <Text 
                    variant="titleMedium"
                    numberOfLines={2}
                >
                    {this.props.goal.title}
                </Text>
                <Text 
                    variant="bodySmall"
                    numberOfLines={4}
                >
                    {this.props.goal.description}
                </Text>
                </Card.Content>
            </Card>
        )
    }
}

export default class GoalsList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const goals_left = this.props.goals.filter((goal, index) => index % 2 === 0);
        const goals_right = this.props.goals.filter((goal, index) => index % 2 === 1);
        return (
            <View style={[this.props.style,{flexDirection: 'row'}]}>
                <View style={{
                    width: '50%',
                }}>
                    {goals_left.map((goal) => 
                        <Goal goal={goal} key={goal.goal_id} onPress={this.props.onGoalPress}/>
                    )}
                </View>
                <View style={{
                    width: '50%',
                }}>
                    {goals_right.map((goal) => 
                        <Goal goal={goal} key={goal.goal_id} onPress={this.props.onGoalPress}/>
                    )}
                </View>
            </View>
        )               
    }
}

const goalsStyles = StyleSheet.create({
    card: {
        height: 250,
        margin: 5,
        borderWidth: 1,
        backgroundColor: '#CCC2DC',
    },
    
    cardSelected: {
        height: 250,
        margin: 5,
        borderWidth: 4,
        backgroundColor: '#CCC2DC',
        borderColor: '#21005D',
        elevation: 15,
    },

    cardSelectedIcon: {
        position: 'absolute', 
        top: 1, 
        right: 1, 
        backgroundColor: '#21005D', 
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40, 
        borderBottomLeftRadius: 40, 
        borderBottomRightRadius: 40, 
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