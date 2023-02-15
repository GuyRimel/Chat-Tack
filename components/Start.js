import React from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

const backgroundColors = {
  gray: { backgroundColor: "hsl(0, 0%, 60%)" },
  red: { backgroundColor: "hsl(6, 40%, 60%)" },
  green: { backgroundColor: "hsl(86, 40%, 60%)" },
  blue: { backgroundColor: "hsl(206, 40%, 60%)" },
  violet: { backgroundColor: "hsl(246, 40%, 60%)" },
};

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', color: '' };
  }
  
  render() {
    const { red, green, blue, violet } = backgroundColors;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/stone-wall.jpg")}
          style={[styles.container, styles.flexColumnCentered]}
        >
          <Text style={styles.title}>Chat-Tack</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.nameInput, {borderColor: this.state.color}]}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Enter your Name"
            />

            <View>
              <Text style={styles.textDarkCenter}>Choose your Background:</Text>
              <View style={styles.flexRow}>
                <Text
                  style={[
                    styles.colorDot,
                    red,
                    this.state.color === red.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    this.setState({ color: red.backgroundColor })
                  }
                />

                <Text
                  style={[
                    styles.colorDot,
                    green,
                    this.state.color === green.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() => this.setState({ color: green.backgroundColor })}
                />

                <Text
                  style={[
                    styles.colorDot,
                    blue,
                    this.state.color === blue.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    this.setState({ color: blue.backgroundColor })
                  }
                />

                <Text
                  style={[
                    styles.colorDot,
                    violet,
                    this.state.color === violet.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    this.setState({ color: violet.backgroundColor })
                  }
                />
              </View>
            </View>
            <TouchableOpacity
              style={[styles.bigButton, styles.w90, {backgroundColor: this.state.color}]}
              // title='Go to Chat'
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
            >
              <Text>
                Chat it Up!
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flexColumnCentered: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "600",
    marginBottom: 30,
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10
  },

  inputContainer: {
    backgroundColor: "#fff",
    marginBottom: 15,
    height: "44%",
    width: "90%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },

  nameInput: {
    borderColor: "#777",
    borderWidth: 1,
    width: "90%",
    height: 40
  },

  textDarkCenter: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#555",
    opacity: 100,
  },

  flexRow: {
    display: "flex",
    flexDirection: "row"
  },

  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },

  colorSelected: {
    borderWidth: 2,
    borderColor: "#333",
  },

  bigButton: {
    padding: 20,
    color: "#fff"
  },

  w90: { width: '90%' }
});
