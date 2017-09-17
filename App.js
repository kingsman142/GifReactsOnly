import React from 'react';
import { ScrollView, Button, Image, Text, View, StyleSheet } from 'react-native';
import { ImagePicker } from 'expo';
import vision from 'react-cloud-vision-api';
import Swiper from 'react-native-swiper';
//import { Button } from 'react-native-button';

vision.init({ auth: 'AIzaSyC7fk12dbsYVi7x4zBC4suE3zQpJQboIGU' })

export default class ImagePickerExample extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
     image: null,
     dates: null,
     gifs: null,
     symbol: null
    }

    this.captureImage();
  }

  state = {
    image: null,
    status: null,
    dates: null,
    gifs: null,
    symbol: null
  };

  render() {
    let { image, status, dates, gifs } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0088cc' }}>
        <Button
          title="Take Another Picture"
          onPress={this.captureImage}
          color="#e6b800"
        />
        {image && !gifs &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        {status && <Text>{status}</Text>}
        { dates &&
          dates.map((date) => (
              <Button title={date} onPress={() => this.findGiphyNews(date)} key={date} color="#e6b800" />
          ))
        }
        { gifs &&
           <ScrollView horizontal={true} >
               { gifs.map((gifInfo) => (
                   <View key={gifInfo[0]+gifInfo[1]} style={{ width: 200 }}>
                       <Image
                          style={{width: 200, height: 200}}
                          source={{uri: gifInfo[1]}}
                          key={gifInfo[1]}
                        />
                        <Text key={gifInfo[0]} style={{ width: 200, color: '#fff', fontSize: 14, lineHeight: 20, fontWeight: 'bold' }}>{gifInfo[0]}</Text>
                    </View>
               )) }
           </ScrollView>
       }
      </View>
    );
  }

  findGiphyNews = async (dateVal) => {
        this.setState({ gifs: null });
        let { symbol } = this.state;
        console.log("DATE v");
        console.log(dateVal);
        fetch('https://gif-reacts-only.herokuapp.com/getGifs', {
            method: 'POST',
            timeout: 10000,
            body: JSON.stringify({'symbol': symbol, 'date': dateVal})
        }).then((output) => output.json()).then((parsed) => {
            let gifsArr = parsed.gifs;
            console.log("giftsarr v");
            console.log(gifsArr[0][0]);
            this.setState({ gifs: gifsArr });
        }).catch((error) => {
            console.error(error);
        });
        //gifs = ["https://media3.giphy.com/media/5xtDarEbygs3Pu7p3jO/200_d.gif", "https://media.giphy.com/media/3o6oziEt5VUgsuunxS/giphy.gif"]
        //this.setState({ gifs: gifs });
    }

    captureImage = async () => {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        base64: true,
      });

      console.log(result);

      if (!result.cancelled) {
        this.setState({ image: result.uri, gifs: null, dates: null });

        const req = new vision.Request({
          image: new vision.Image({
            base64: result.base64,
          }),
          features: [
            //new vision.Feature('TEXT_DETECTION', 1),
            new vision.Feature('LOGO_DETECTION', 1),
          ]
        })

        vision.annotate(req).then((res) => {
            console.log(res.responses);

            if (res && res.responses && res.responses[0] && res.responses[0].logoAnnotations && res.responses[0].logoAnnotations[0] && res.responses[0].logoAnnotations[0].description) {
                this.setState({ status: JSON.stringify(res.responses[0].logoAnnotations[0].description) });
                return res.responses[0].logoAnnotations[0].description; //Company name
            }
            else {
                this.setState({ status: JSON.stringify("Unidentified Company")});
                return '';
            }
        }, (e) => {
            let errorText = 'Error: ' + e;
            console.error(errorText);
            this.setState({ status: errorText });
        }).then((companyName) => {
            console.log('company', companyName);
            fetch('https://gif-reacts-only.herokuapp.com/getDates', {
                method: 'POST',
                timeout: 10000,
                body: JSON.stringify({'company': companyName})
            }).then((output) => output.json()).then((parsed) => {
                let dates = parsed.dates;
                console.log(dates);
                this.setState({ dates: dates, symbol: parsed.symbol });
            }).catch((error) => {
                console.error(error);
            });
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
},wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
});
