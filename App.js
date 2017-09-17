import React from 'react';
import { Button, Image, Text, View, StyleSheet } from 'react-native';
import { ImagePicker } from 'expo';
import vision from "react-cloud-vision-api";
vision.init({ auth: 'AIzaSyC7fk12dbsYVi7x4zBC4suE3zQpJQboIGU' })

export default class ImagePickerExample extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
     image: null,
    }

    this.captureImage();
  }

  state = {
    image: null,
    status: null,
  };

  render() {
    let { image, status } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Take Another Picture"
          onPress={this.captureImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        {status && <Text>{status}</Text>}
      </View>
    );
  }

  captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });

      const req = new vision.Request({
        image: new vision.Image({
          base64: result.base64,
        }),
        features: [
          new vision.Feature('TEXT_DETECTION', 1),
          new vision.Feature('LOGO_DETECTION', 1),
        ]
      })

      vision.annotate(req).then((res) => {
          this.setState({ status: JSON.stringify(res.responses) });
          consolelog(res.responses);
      }, (e) => {
          let errorText = 'Error: ' + e;
          console.error(errorText);
          this.setState({ status: errorText });
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
