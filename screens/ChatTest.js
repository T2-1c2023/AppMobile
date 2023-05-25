import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import database from '@react-native-firebase/database';

class ChatTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatPath: '',
            chatRef: null,
            uid: 1,
            messages: [],
            inputText: ''
        }
    };

    componentDidMount() {
        // TODO: the reference should depend on the user id.
        // TODO: check what would be the best structure for storing messages
        const path = 'chat_test/users/' + this.state.uid;
        this.setState({ chatPath: path });
        const reference = database().ref(path);
        this.setState({ chatRef: reference });
        // Setup an active listener to react to any changes to the node and it's children
        reference.on('value', (snapshot) => {
            // Check if there are messages already
            if (snapshot.exists()) {
                const data = snapshot.val();
                const messagesList = Object.keys(data).map((key) => ({ id: key, text: data[key]}));
                this.setState({ messages: messagesList });
            } else {
                // Just in case
                this.setState({ messages: [] });
            }
        });
    }

    componentWillUnmount() {
        // Unsubscribe from listener
        this.state.chatRef.off('value');
    }

    sendMessage = () => {
        const { inputText } = this.state;

        if (inputText.trim() !== '') {
            console.log(this.state.chatPath);
            const newMessageRef = database().ref(this.state.chatPath).push();
            newMessageRef
                .set(inputText)
                .then(() => this.setState({ inputText: '' }))
                .catch((error) => console.log('Error sending message:', error));
        }
    }

    render() {
        const { messages, inputText } = this.state;

        return (
          <View style={{ flex: 1, padding: 20 }}>
            <FlatList 
              data={messages}
              renderItem={({item}) => (
                <View style={{paddingVertical: 5}}>
                  <Text>{item.text}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TextInput 
                    style={{ flex: 1, marginRight: 10, borderWidth: 1, padding: 5 }}
                    value={inputText}
                    onChangeText={(text) => this.setState({ inputText: text })}
                />
                <TouchableOpacity onPress={this.sendMessage} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5}}>
                    <Text style={{ color: 'white' }}>Send</Text>
                </TouchableOpacity>
            </View>
          </View>
        )
    }
}

export default ChatTest;