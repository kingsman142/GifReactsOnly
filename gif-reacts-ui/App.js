'use strict';
import React, { Component } from 'react';
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import {
  AppRegistry,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { ImagePicker } from 'expo';

export default class App extends Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
  }, function(){
      ajax({
          url: "https://gif-reacts-only.herokuapp.com",
          type: "POST",
          body: {
              image: new File(["foo"], "foo.txt", {
              }),
          },
          success: function(){
              console.log("submitted image to server");
          }
      })
  });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
  /*render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
    }*/
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
