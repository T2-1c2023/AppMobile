import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import database from '@react-native-firebase/database';

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: []
        };
    }

    componentDidMount() {
        const userId = this.props.data.id;
        /*
            TODO: consultar por esto
            Hago dos búsquedas:
             * Chats con uid1 = userId
             * Chats con uid2 = userId
        */
        const reference1 = database()
          .ref('chats')
          .orderByChild('uid1')
          .equalTo(userId);

        reference1.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const chats = Object.entries(data).map(([chatId, chatData]) => ({
                  id: chatId,
                  uid1: chatData.uid1,
                  uid2: chatData.uid2  
                }));
                this.setState((prevState) => ({
                    chats: [...prevState.chats, ...chats]
                }));
            }
        });

        const reference2 = database()
          .ref('chats')
          .orderByChild('uid2')
          .equalTo(userId);

        reference2.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const chats = Object.entries(data).map(([chatId, chatData]) => ({
                  id: chatId,
                  uid1: chatData.uid1,
                  uid2: chatData.uid2  
                }));
                this.setState((prevState) => ({
                    chats: [...prevState.chats, ...chats]
                }));
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
                {chats.length > 0 ? (
                    <FlatList
                      data={chats}
                      renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(
                                            'ChatTest', 
                                            { chatId: item.id, 
                                              data: this.props.data }
                                    )}
                            style={styles.chatItem}
                        >
                            <Text>
                              Chat ID: {item.id}{'\n'}
                              Uid1: {item.uid1}{'\n'}
                              Uid2: {item.uid2}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />
                ) : (
                    <Text style={styles.noChatsText}>No hay chats disponibles.</Text>
                )}
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    chatItem: {
        paddingVertical: 5,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    noChatsText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})


export default ChatList;
