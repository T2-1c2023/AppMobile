import React, { Component } from 'react';
import { View } from 'react-native';
import { TextHeader, TextDetails, ButtonStandard, LoginImage } from '../src/styles/BaseComponents';
import styles from '../src/styles/styles';

export default class GoalScreen extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        this.props.navigation.navigate('GoalScreen',  { title: 'asdf' })
    }

    render() {
        return (
            <View style={styles.container}>

                <ButtonStandard
                    title="Button"
                    style={{
                        marginTop: 70,
                    }}
                    onPress={() => {
                        this.props.navigation.navigate('GoalScreen',  { title: 'asdf' })
                    }}
                />

            </View>
        );
    }
}
