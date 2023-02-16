import React from "react";
import {
  StyleSheet,
  View,
  Text
} from "react-native";

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  
  componentDidMount() {
    // the screen title becomes the name passed from Start.js
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
  }

  render() {
    // the screen background becomes the color passed from Start.js
    let color = this.props.route.params.color;
    let name = this.props.route.params.name;
    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <Text>
          Hello Chat screen! Your name is {name + " "}
          and you chose the color: "{color}"
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
