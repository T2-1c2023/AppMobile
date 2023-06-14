import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import database from '@react-native-firebase/database';

class ChatTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatId: props.route.params.chatId, 
            messages: [],
            inputText: '',
            uid1: props.route.params.data.id,
            uid2: 0 // TODO: probar con otro usuario
        }
    };

    // TODO: Mejorar formato de mensajes: mostrar fecha abajo del mensaje 

    componentDidMount() {
        const { chatId } = this.state;

        const reference = database().ref('chats/' + chatId);

        // Setup an active listener to react to any changes to the node and it's children
        reference.on('value', (snapshot) => {
            if (snapshot.exists()) {
                // If the chat room exists, load messages.
                const data = snapshot.val();
                if (data.messages !== undefined) {
                    const messages = Object.values(data.messages);
                    messages.sort((a, b) => b.timestamp - a.timestamp)
                    this.setState({ messages: messages });
                }
            } else {
                Alert.alert('Error: No se encontró el chat room, volver a intentar');
            }
        });
    }

    componentWillUnmount() {
        // Unsubscribe from listener
        const { chatId } = this.state;
        const reference = database().ref('chats/' + chatId);
        reference.off('value');
    }

    sendMessage = () => {
        const { inputText, chatId, uid1 } = this.state;
        // Check if its not only white space
        if (inputText.trim() !== '') {
            const newMessageRef = database().ref('chats/' + chatId + '/messages').push();
            const timestamp = Date.now();
            const newMessageData = {
                message: inputText,
                uid: uid1,
                timestamp: timestamp
            };

            newMessageRef
                .set(newMessageData)
                .then(() => this.setState({ inputText: ''}))
                .catch((error) => console.error('Error sending message:', error));
        }
    }

    render() {
        const { messages, inputText } = this.state;

        return (
          <View style={{ flex: 1, padding: 20 }}>
            <FlatList 
              data={messages}
              renderItem={({ item }) => (
                <View style={{ paddingVertical: 5, 
                               alignSelf: item.uid === this.state.uid1 ? 'flex-end' : 'flex-start' 
                }}>
                    <Text style={{ backgroundColor: item.uid === this.state.uid1 ? '#5da64e' : '#494f48', 
                                   padding: 10, borderRadius: 10, color: 'white' 
                    }}>
                        {item.message}
                    </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              inverted
            />

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TextInput 
                    style={{ flex: 1, marginRight: 10, borderWidth: 1, padding: 5 }}
                    value={inputText}
                    onChangeText={(text) => this.setState({ inputText: text })}
                />
                <TouchableOpacity onPress={this.sendMessage} style={{ padding: 10, backgroundColor: '#21005D', borderRadius: 5}}>
                    <Text style={{ color: 'white' }}>Send</Text>
                </TouchableOpacity>
            </View>
          </View>
        )
    }
}

export default ChatTest;