import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// Google firebase / firestore
const firebase = require("firebase");
require("firebase/firestore");
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV0JNLqJK6h5OGh05E3BPwocKDAiy2WfY",
  authDomain: "chat-tack.firebaseapp.com",
  projectId: "chat-tack",
  storageBucket: "chat-tack.appspot.com",
  messagingSenderId: "402926973315",
  appId: "1:402926973315:web:187f53a1581d952c2186b6",
};

// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      uid: null,
      messages: [],
      user: {
        _id: "",
        avatar: "",
        name: "",
      },
      loggedInText: "Please standby...",
      isConnected: false,
    };
  }

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    NetInfo.fetch().then((connection) => {
      this.setState({ isConnected: connection.isConnected });
    });
    this.getMessages();
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.unsubscribe = this.referenceChatMessages.onSnapshot(
      this.onCollectionUpdate
    );

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      this.setState({
        messages: [],
        uid: user?.uid,
        user: {
          _id: user.uid,
          avatar: user.avatar,
          name: this.props.route.params.name,
        },
        loggedInText: "",
      });

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  // "unsubscribe" is to stop listening for changes from Firestore
  componentWillUnmount() {
    if (this.referenceChatMessages) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    if (!this.state.isConnected) return;
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
          avatar: data.user.avatar || "",
        },
      });
    });

    this.setState({ messages });
  };

  // add one message to firestore
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || "",
      user: message.user,
    });
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({ messages: [] });
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(messages = []) {
    // this.state.messages[] is previousState.messages PLUS the message passed to onSend()
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // callback: after saving state, add message
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  renderBubble(props) {
    // set the chat bubble colors
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: "#fff" },
          right: { backgroundColor: "#444" },
        }}
      />
    );
  }

  //render the default InputToolbar only when the user is online
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  render() {
    // chat screen background color and top title is set to the bgColor and name passed from Start.js
    let bgColor = this.props.route.params.bgColor;
    let name = this.props.route.params.name;
    let isConnected = this.state.isConnected ? " || online" : " || offline";
    this.props.navigation.setOptions({ title: name + isConnected });
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: this.state.uid,
              avatar: "https://placeimg.com/140/140/any",
            }}
          />
        {Platform.OS === "android" ? (
          // IF Platform OS is android, fixes buggy keyboard viewing
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  p20: { padding: 20 },
});
