import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import database from '@react-native-firebase/database';

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: []
        };
        console.log(this.props.data.id)
    }

    componentDidMount() {
        const reference = database().ref('chats');

        reference.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log(data);
                const chats = Object.entries(data).map(([chatId, chatData]) => ({
                    id: chatId,
                    uid1: chatData.uid1,
                    uid2: chatData.uid2
                }));
                this.setState({ chats: chats });
            }
        });
    }

    componentWillUnmount() {
        const reference = database().ref('chats');
        reference.off('value');
    }

    render() {
        const { chats } = this.state;

        return (
            <View style={{ flex: 1, padding: 20 }}>
                <FlatList
                    data={chats}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(
                                            'ChatTest', 
                                            { chatId: item.id, 
                                              data: this.props.data }
                                    )}
                            style={{ paddingVertical: 5 }}
                        >
                            <Text>Chat ID: {item.id}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
        );
    }
}

export default ChatList;
