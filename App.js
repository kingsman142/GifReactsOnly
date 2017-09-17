import React from 'react';
import { Button, Image, View } from 'react-native';
import { ImagePicker } from 'expo';

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
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Take Another Picture"
          onPress={this.captureImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }

  captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
  }, function(){
      ajax({
          url: "https://gif-reacts-only.herokuapp.com/upload_files",
          type: "POST",
          body: {
              image: new File(["foo"], "foo.txt", {}),
          },
          success: function(output){
              console.log("submitted image to server; output: " + output);
          }
      });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
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
