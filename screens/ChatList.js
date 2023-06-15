import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Searchbar } from 'react-native-paper';
import database from '@react-native-firebase/database';
import Constants from 'expo-constants';
import axios from 'axios';
import { tokenManager } from '../src/TokenManager';
import { downloadImage } from '../services/Media';

const API_GATEWAY_URL = Constants.manifest?.extra?.apiGatewayUrl;

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            uid2Input: '',
            visiblePopUp: false,
            // For user search popup
            users: [],
            searchQuery: ''
        };
    }

    async componentDidMount() {
        await this.fetchChats();
        await this.loadUsers();
        this.addUserDataToChats();
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

    // Los chats solo contienen el uid, agrego el resto de información
    addUserDataToChats = async () => {
        const userId = this.props.data.id;
        const { users, chats } = this.state;
      
        const updatedChats = await Promise.all(
          chats.map(async (chat) => {
            const userData = users.find(
              (user) => user.id === chat.uid1 || user.id === chat.uid2
            );
            if (userData.id === userId) {
              return { ...chat };
            } else {
              let photo_url = null;
              if (userData.photo_id !== '') {
                console.log(userData.photo_id);
                photo_url = await downloadImage(userData.photo_id);
              }
      
              return {
                ...chat,
                fullname: userData.fullname,
                mail: userData.mail,
                photo_url: photo_url,
              };
            }
          })
        );
      
        this.setState({ chats: updatedChats });
    };

    createChatRoom = async (uid2) => {
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
            .then(async () => {
                console.log('Node created succesfully');
                this.setState({ chats: [] });
                await this.fetchChats();
                this.setState({ users: [] });
                await this.loadUsers();
                this.addUserDataToChats();
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

        const renderItem = ({ item }) => {
            let photo = require('../assets/images/user_predet_image.png');
            
            return (  
                <TouchableOpacity
                    style={styles.userItem}
                    onPress={() => this.createChatRoom(item.id)}
                >
                    <View style={styles.userItemContainer}>
                        <Image
                            source={require('../assets/images/user_predet_image.png')}
                            style={styles.userPhoto}
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{item.fullname}</Text>
                            <Text style={styles.userEmail}>{item.mail}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        };

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
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>

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

    renderChatItem = ({ item }) => {
        const photo = item.photo_url
          ? { uri: item.photo_url }
          : require('../assets/images/user_predet_image.png');

        return (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(
                'ChatTest', 
                { chatId: item.id, 
                  data: this.props.data }
              )}
              style={styles.chatItem}
            >
              <View style={styles.userItemContainer}>
                <Image
                  source={photo}
                  style={styles.userPhoto}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.fullname}</Text>
                  <Text style={styles.userEmail}>{item.mail}</Text>
                </View>
              </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { chats } = this.state;

        return (
            <View style={{ flex: 1, padding: 20 }}>
                {chats.length > 0 ? (
                    <FlatList
                      data={chats}
                      renderItem={this.renderChatItem}
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
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    }, 
    userItemContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10
    },
    userInfo: {
        justifyContent: 'center'
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    userEmail: {
        fontSize: 14,
        color: 'gray'
    }
});


export default ChatList;
