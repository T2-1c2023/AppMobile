import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Searchbar } from 'react-native-paper';
import database from '@react-native-firebase/database';
import Constants from 'expo-constants';
import axios from 'axios';
import { tokenManager } from '../src/TokenManager';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            uid2Input: '', // TODO: elegir uid2 buscandolo por nombre
            visiblePopUp: false,
            // For user search popup
            users: [],
            searchQuery: ''
        };
    }

    componentDidMount() {
        this.fetchChats();
        this.loadUsers();
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

    // Cargo usuarios para cuando se quiere crear un nuevo chat
    loadUsers = async () => {
        const url = API_GATEWAY_URL + 'users';
        const config = {
            headers: { Authorization: tokenManager.getAccessToken() }
        }
        try {
            let response = await axios.get(url, config)
            this.setState({ users: response.data });
        } catch (error) {
            console.error("Error: " + JSON.stringify(error))
        }
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

    renderUserSearchBarPopUp = () => {
        const { visiblePopUp, users, chats, searchQuery } = this.state;
        const userId = this.props.data.id;

        // TODO: (no urgente). Esto no hay chance que escale bien
        // Filtro chats ya existentes
        const filteredUsers = users.filter(
            (user) =>
              user.id !== userId &&
              !chats.find((chat) => chat.uid1 === user.id || chat.uid2 === user.id) &&
              user.fullname.toLowerCase().includes(searchQuery.toLowerCase())   
        );

        return (
            <Modal
              isVisible={visiblePopUp}
              animationIn="slideInDown"
              animationOut="slideOutUp"
              animationInTiming={100}
            >
              <View style={styles.popupContainer}>
                <Searchbar 
                    placeholder={'Buscar usuario'}
                    value={searchQuery}
                    onChangeText={this.handleSearch}
                />
                <View style={styles.userListContainer}>
                  <FlatList
                    data={filteredUsers}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.userItem}
                        onPress={() => this.createChatRoom(item.id)}
                      >
                        <Text>{item.fullname}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>

                {/*this.state.users.length == 0 ?
                    this.renderNoUsersFoundMessage()
                    :
                    this.renderUsersList()
                */}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => this.setState({ visiblePopUp: false })}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
        );
    };

    handleSearch = (query) => {
        this.setState({ searchQuery: query });
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
                
                <TouchableOpacity
                  style={styles.newChatButton}
                  onPress={() => this.setState({ visiblePopUp: true })}
                >
                  <Text style={styles.newChatButtonText}>Nuevo Chat</Text>
                </TouchableOpacity>
                
                {this.renderUserSearchBarPopUp()}
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
    uid2Input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,       
    },
    popupContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    },
    closeButton: {
        marginTop: 30,
        alignSelf: 'center'
    },
    closeButtonText: {
        color: '#21005D',
        fontSize: 16 
    },
    userListContainer: {
        height: '70%',
        marginTop: 30
    }
});


export default ChatList;
