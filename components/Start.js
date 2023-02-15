import React from 'react';
import { View, Text, TextInput, StyleSheet, Button} from 'react-native';


export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello {this.state.name}!</Text>
        <TextInput 
          style={{height: 40, borderColor: '#dbdbdb', borderWidth: 1 }}
          onChangeText={(name) => this.setState({ name })}
          value={this.state.name}
          placeholder="Type text here..."
        />
        <Button
          title="Go to Chat"
          onPress={() => {
            this.props.navigation.navigate("Chat", { name: this.state.name })
          }}
        />
      </View>
    )
  }
}