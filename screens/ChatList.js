import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import database from '@react-native-firebase/database';

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            uid2Input: '' // TODO: elegir uid2 buscandolo por nombre
        };
    }

    componentDidMount() {
        this.fetchChats();
    }

    componentWillUnmount() {
        const reference = database().ref('chats');
        reference.off('value');
    }

    fetchChats = async () => {
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

    createChatRoom = (uid2) => {
        const userId = this.props.data.id;
        const reference = database().ref('chats');
        // Create new node where the new chat will be stored
        const newChatRef = reference.push();
        const chatId = newChatRef.key;

        const chatData = {
            messages: [],
            uid1: userId,
            uid2: uid2
        };

        reference.child(chatId).set(chatData)
            .then(() => {
                console.log('Node created succesfully');
                this.setState({ chats: []});
                this.fetchChats();
            })
            .catch((error) => {
                console.log('Error creating node:', error);
            })
    }

    handleNewChatPress = () => {
        const { uid2Input } = this.state;

        if (uid2Input.trim().length === 0) {
            Alert.alert('Error', 'Por favor, ingresa un valor para uid2');
            return;
        }

        const uid2 = parseInt(uid2Input, 10);

        if (isNaN(uid2)) {
            Alert.alert('Error', 'Por favor, ingresa un valor numérico válido para uid2');
            return;
        }

        this.createChatRoom(uid2);
        this.setState({ uid2Input: '' });
    }

    render() {
        const { chats, uid2Input } = this.state;

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
                <View style={styles.newChatContainer}>
                    <TextInput
                      style={styles.uid2Input}
                      placeholder="Ingresa uid2"
                      value={uid2Input}
                      onChangeText={(text) => this.setState({ uid2Input: text})}  
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={styles.newChatButton}
                      onPress={this.handleNewChatPress}
                    >
                        <Text style={styles.newChatButtonText}>Nuevo Chat (para test)</Text>
                    </TouchableOpacity>
                </View>
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
    },
    newChatButton: {
        backgroundColor: '#21005D',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'center'
    },
    newChatButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    newChatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    uid2Input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'grey',
        marginRight: 10,
        paddingHorizontal: 10,
        borderRadius: 5        
    }
});


export default ChatList;
