import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import _ from 'lodash'
import ImageLoad from 'react-native-image-placeholder'

const { width } = Dimensions.get('window')

class PhotoGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastImageClicked: false,
    }
  }

  _renderRow(images, _flexdirection, showmore_flag = false, morenumber = 0, extra=false) {
    const source = images;
    const firstViewImages = []
    const secondViewImages = []
    let index = 0

    _.each(source, (img, callback) => {
      if (_flexdirection == 'row') {
        firstViewImages.push(img)
      } else {
        if (index < 2) {
          firstViewImages.push(img)
        } else {
          secondViewImages.push(img)
        }
      }
      index++
    })

    const width = Dimensions.get('window').width - 40;
    const height = width;
    let ratio = 2 / 3;
    const direction = _flexdirection == 'row' ? 'column' : 'row';

    const firstImageWidth = !extra ? width / source.length : width/3 ;
    const firstImageHeight = firstImageWidth;

    const secondImageWidth = direction === 'column' ? (width / secondViewImages.length) : (width * ratio)
    const secondImageHeight = secondImageWidth

    const secondViewWidth = direction === 'column' ? width : (width * ratio)
    const secondViewHeight = direction === 'column' ? (height * ratio) : height

    return source.length ? (
      <View style={[{ flexDirection: direction }]}>
        <View style={{ flexDirection: direction === 'row' ? 'column' : 'row' }}>
          {firstViewImages.map((image, index) => (
            <TouchableOpacity activeOpacity={0.7} key={index}
              style={{ flex: 1, borderRadius: 50 }}

              onPress={() => {
                if (index == 2 && showmore_flag){
                  this.setState({lastImageClicked:true});
                }
              }}>
              {index == 2 && showmore_flag ? (
                <ImageBackground
                  borderRadius={10}
                  style={[styles.image, { width: firstImageWidth, height: firstImageWidth }, this.props.imageStyle]}
                  source={typeof image === 'string' ? { uri: image } : image}
                >
                  <View style={styles.lastWrapper}>
                    <Text style={[styles.textCount, this.props.textStyles]}>+{morenumber}</Text>
                  </View>
                </ImageBackground>
              )
                : <ImageLoad

                  borderRadius={10}
                  key={index}
                  style={[styles.image, { width: firstImageWidth, height: firstImageHeight }]}
                  source={typeof image === 'string' ? { uri: image } : image}
                />}

            </TouchableOpacity>
          ))}
        </View>
        {
          secondViewImages.length ? (
            <View style={{ width: secondViewWidth, flexDirection: direction === 'row' ? 'column' : 'row' }}>
              {secondViewImages.map((image, index) => (
                <TouchableOpacity activeOpacity={0.7} key={index} style={{
                  flex: 1,
                  borderRadius: 10,
                }}
                  onPress={() => {}}>
                  <ImageLoad

                    borderRadius={10}
                    key={index}
                    style={[styles.image, { width: secondImageWidth, height: secondImageHeight }, this.props.imageStyle]}
                    source={typeof image === 'string' ? { uri: image } : image}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
      </View >
    ) : null
  }


  _renderExtraImages() {
    var extraImgs = this.props.source.slice(9);
    var group = parseInt(extraImgs.length /3) + (extraImgs.length % 3  == 0 ? 0 : 1);
    var arr = [];
    for (var i = 0; i< group; i++){
        arr.push(i*3);
    }
    return (
      <View>
        {arr.map((item) => (
           <View>
             {this._renderRow(extraImgs.slice(item, item+3), 'row', false ,0,  true)}
           </View>
          ))}
      </View>
    )
  }

  render() {
    var sourceLen = this.props.source.length;

    var firstRow = [];
    var secondRow = [];
    var thirdRow = [];
    var index = 0;
    var extraNum = sourceLen > 9 ? sourceLen - 9 : 0;

    _.each(this.props.source, (img, callback) => {
      if (sourceLen <= 3) {
        firstRow.push(img);
      } else if (sourceLen > 3 && sourceLen <= 6) {
        if (index < 3) {
          firstRow.push(img);
        } else {
          secondRow.push(img);
        }
      } else if (sourceLen > 6) {
        if (index < 3) {
          firstRow.push(img);
        } else if (index < 6 && index >= 3) {
          secondRow.push(img);
        } else if (index < 9 && index >= 6) {
          thirdRow.push(img);
        }
      }
      index++
    })

    return (
      <View>
        {this._renderRow(firstRow, sourceLen == 3? 'column':'row')}
        {secondRow.length && (sourceLen >=6 )? this._renderRow(secondRow, 'column') : this._renderRow(secondRow, 'row')}
        {this._renderRow(thirdRow, 'row', !this.state.lastImageClicked && extraNum?true:false,extraNum)}
        {
          this.state.lastImageClicked?(
            this._renderExtraImages()
          ):null
        }
      </View>
    )
  }
}

PhotoGrid.prototypes = {
  source: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
  imageStyle: PropTypes.object,
  onPressImage: PropTypes.func,
  ratio: PropTypes.float,
}

PhotoGrid.defaultProps = {
  style: {},
  imageStyle: {},
  width: width,
  height: 400,
  ratio: 1 / 3
}

const styles = {
  image: {
    resizeMode: 'cover',
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: 10
  },
  lastWrapper: {
    flex: 1,
    backgroundColor: 'rgba(200, 200, 200, .5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textCount: {
    color: '#fff',
    fontSize: 60
  }
}

export default PhotoGrid
