import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AppRegistry,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { Camera } from 'react-native-camera';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          /*<Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}>
            <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
          </Camera>*/
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
