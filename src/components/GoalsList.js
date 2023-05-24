import React, { Component } from 'react';
import { Avatar, Button, Card, Text, IconButton } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';
import { downloadImage } from '../../services/Media';

class Goal extends Component {
    constructor(props) {
        super(props)
        this.handleLongPress = this.handleLongPress.bind(this)
        this.handlePress = this.handlePress.bind(this)
        this.state = {
            selected: this.props.selected,
            uri: null
        }
    }

    componentDidMount() {
        this.loadImage();
    }

    async loadImage() {
        const multimedia_ids = this.props.goal.multimedia_ids;

        if (multimedia_ids != null && multimedia_ids.length > 0) {
            const image_id = parseInt(multimedia_ids[0]);
            if (!isNaN(image_id)) {
                try {
                    const uri = await downloadImage(image_id);
                    this.setState({ uri: uri });
                } catch (error) {
                    console.error('Error downloading image:', error);
                }
            }
        }
    }

    handleLongPress() {
        if (this.props.canEdit) {
            const selected = !this.state.selected
            this.setState({ selected })

            if (selected) {
                this.props.onSelection(this.props.goal.id)
            } else {
                this.props.onDeselection(this.props.goal.id)
            }
        }
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
                onPress={this.props.selectionMode? this.handleLongPress : this.handlePress}
            >
                <View style={{ position: 'relative' }}>
                    {this.state.uri ? (
                        <Image
                            source={{ uri: this.state.uri }}
                            style={goalsStyles.cardImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <Image
                            source={require('./fiufit.png')}
                            style={[goalsStyles.cardWithoutImage, {alignSelf: 'center'}]}
                            resizeMode= 'contain'
                        />
                    )
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
                        <Goal 
                            goal={goal} 
                            key={goal.id} 
                            onPress={this.props.onPress} 
                            onSelection={this.props.onSelection}
                            onDeselection={this.props.onDeselection}
                            selectionMode = {this.props.selectedGoalsIds != 0}
                            selected = {this.props.selectedGoalsIds.includes(goal.id)}
                            canEdit = {this.props.canEdit}
                        />
                    )}
                </View>
                <View style={{
                    width: '50%',
                }}>
                    {goals_right.map((goal) => 
                        <Goal 
                            goal={goal} 
                            key={goal.id} 
                            onPress={this.props.onPress}
                            onSelection={this.props.onSelection}
                            onDeselection={this.props.onDeselection}
                            selectionMode = {this.props.selectedGoalsIds != 0}
                            selected = {this.props.selectedGoalsIds.includes(goal.id)}
                            canEdit = {this.props.canEdit}
                        />
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
