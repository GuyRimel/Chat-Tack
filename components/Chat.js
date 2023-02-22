import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  FlatList
} from "react-native";
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

// Google firebase / firestore
const firebase = require('firebase');
require('firebase/firestore');
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV0JNLqJK6h5OGh05E3BPwocKDAiy2WfY",
  authDomain: "chat-tack.firebaseapp.com",
  projectId: "chat-tack",
  storageBucket: "chat-tack.appspot.com",
  messagingSenderId: "402926973315",
  appId: "1:402926973315:web:187f53a1581d952c2186b6"
};

// Initialize Firebase
if(!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        avatar: '',
        name: '',
      },
      loggedInText: 'Please standby...',
      image: null,
      location: null,
      isConnected: false,
    };
  }

  componentDidMount() {
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(
      user => {
        if (!user) {
          firebase.auth().signInAnonymously();
        }
        this.setState({
          uid: user.uid,
          messages: [],
          user: {
            _id: user.uid,
            name: name,
          },
          loggedInText: '',
        });

        this.unsubscribe = this.referenceChatMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot(this.onCollectionUpdate);
      }
    );
  }

  // "unsubscribe" is to stop listening for changes from Firestore
  componentWillUnmount() {
    if(this.referenceChatMessages) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || '',
        }
      });
    });

    this.setState({ messages });
  };

  // add one message to firestore
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  onSend(messages = []) {
    // this.state.messages[] is previousState.messages PLUS the message passed to onSend()
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // callback: after saving state, add message
        this.addMessage(messages);
      }
    );
  }

  renderBubble(props) {
    // set the chat bubble colors
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#000' }
        }}
      />
    )
  }

  render() {
    // chat screen background color and top title is set to the bgColor and name passed from Start.js
    let bgColor = this.props.route.params.bgColor;
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            avatar: 'https://placeimg.com/140/140/any'
          }}
        />
        { Platform.OS === 'android' ?
          // IF Platform OS is android, fixes buggy keyboard viewing
          <KeyboardAvoidingView behavior="height" /> :
          null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  p20: { padding: 20 }
});
