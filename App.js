import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from "react-native";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tabs = createBottomTabNavigator();

// CREATED COMPONENTS //////////
import Start from './components/Start';
import Chat from './components/Chat';

const styles = StyleSheet.create({
  flexColumnContainer: {
    flex: 1,
    flexDirection: "column"
  },
  flexItem20: {
    backgroundColor: '#abf',
    flex: 8
  },
  flexItem50: {
    backgroundColor: '#fed',
    flex: 62
  },
  flexItem30: {
    backgroundColor: '#afb',
    flex: 30
  },

});

export default class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Start">
          <Tab.Screen
            name="Start"
            component={Start}
          />
          <Tab.Screen
            name="Chat"
            component={Chat}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
