import React, { Component } from 'react';
import { View } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

export default class GoalScreen extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        // this.props.navigation.navigate('GoalScreen',  { title: 'Nueva meta' })
    }

    render() {
        return (
            <View style={styles.container}>

                <ButtonStandard
                    title="Nueva meta"
                    style={{
                        marginTop: 10,
                    }}
                    onPress={() => {
                        this.props.navigation.push('GoalScreen',  { title: 'Nueva meta' })
                    }}
                />

                <ButtonStandard
                    title="Lista de metas"
                    style={{
                        marginTop: 10,
                    }}
                    onPress={() => {
                        this.props.navigation.push('GoalsListScreen',  { title: 'Nueva meta' })
                    }}
                />

                <ButtonStandard
                    title="Nuevo entrenamiento"
                    style={{
                        marginTop: 10,
                    }}
                    onPress={() => {
                        this.props.navigation.push('NewTrainingScreen',  { title: 'Nueva meta' })
                    }}
                />

                <ButtonStandard
                    title="Actividades"
                    style={{
                        marginTop: 10,
                    }}
                    onPress={() => {
                        this.props.navigation.push('TrainingActivitiesScreen',  { title: 'Nueva meta' })
                    }}
                />

                <ButtonStandard
                    title="Lista de entrenamientos"
                    style={{
                        marginTop: 10,
                    }}
                    onPress={() => {
                        this.props.navigation.push('TrainingsListScreen',  { title: 'Nueva meta' })
                    }}
                />

            </View>
        );
    }
}
