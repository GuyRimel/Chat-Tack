import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system generated message.',
          createdAt: new Date(),
          system: true,
        }
      ],
    })
  }

  onSend(messages = []) {
    // this.state.messages[] is previousState.messages PLUS the message passed to onSend()
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
            _id: 1,
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
