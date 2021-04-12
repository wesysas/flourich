import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, Dimensions, TouchableOpacity, ImageBackground, } from 'react-native'
import _ from 'lodash'
import { Overlay, Button } from 'react-native-elements';
import ImageLoad from 'react-native-image-placeholder'
import { Modal } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SERVER_URL, WIDTH } from '../../globalconfig';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import { removePortfolio } from '../../shared/service/api'
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image';
import {isIphoneX} from 'react-native-iphone-x-helper';

class PhotoGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastImageClicked: false,
      showZoomimg: false,
      selectedMedia: null,
      paused: false,
      longClickItem: null,
      spinner:false
    }
  }

  _renderRow(images, _flexdirection, showmore_flag = false, morenumber = 0, extra = false) {
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

    const firstImageWidth = !extra ? width / source.length : width / 3;
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
                if (index == 2 && showmore_flag) {
                  this.setState({ lastImageClicked: true });
                } else {
                  this.setState({ showZoomimg: true, selectedMedia: image })
                }
              }}
              >
               {/* {this.state.longClickItem && this.state.longClickItem.id == image.id ?  <TouchableOpacity style={{position:'absolute', zIndex:9999, top:15, left:15}}>
                  <Icon name="trash" size={20} color="red" />
                </TouchableOpacity>:null} */}

              {index == 2 && showmore_flag ? (
                (image.media_type == 'photo' ?
                  <ImageBackground
                    borderRadius={10}
                    style={[styles.image, { width: firstImageWidth, height: firstImageWidth }, this.props.imageStyle]}
                    source={{ uri: SERVER_URL + image.media_url }}
                  >
                    <View style={styles.lastWrapper}>
                      <Text style={[styles.textCount, this.props.textStyles]}>+{morenumber}</Text>
                    </View>
                  </ImageBackground> :
                  <View style={{ width: firstImageWidth, height: firstImageWidth }}>
                    <Video 
                      source={{ uri: SERVER_URL + image.media_url }}
                      keyExtractor={image => image.id}
                      resizeMode={"cover"}
                      style={[styles.image, {
                        width: firstImageWidth,
                        height: firstImageHeight
                      }]}
                    />
                    <Icon name="play" size={25} color="lightgray" style={styles.videoPlayer}> </Icon>
                    <View style={[styles.image, {
                      position: 'absolute', width: firstImageWidth, backgroundColor: '#b9b9b978',
                      height: firstImageHeight, alignItems: 'center', justifyContent: 'center'
                    }]}>
                      <Text style={[styles.textCount, this.props.textStyles]}>+{morenumber}</Text>
                    </View>
                  </View>)

              )
                :
                (image.media_type == 'photo' ?

                  <FastImage

                    borderRadius={10}
                    key={index}
                    style={[styles.image, { width: firstImageWidth, height: firstImageHeight }]}
                    source={{ uri: SERVER_URL + image.media_url }}
                  /> :
                  <View style={{ width: firstImageWidth, height: firstImageWidth }}>
                    <Video 
                      source={{ uri: SERVER_URL + image.media_url }}
                      keyExtractor={image.id}
                      resizeMode={"cover"}
                      style={[styles.image, {
                        width: firstImageWidth,
                        height: firstImageHeight
                      }]}
                    />
                    <Icon name="play" size={25} color="lightgray" style={styles.videoPlayer}> </Icon>
                  </View>

                )}

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
                  onPress={() => {

                    console.log('i\'m here www');
                    this.setState({ showZoomimg: true, selectedMedia: image })
                    console.log(this.state.selectedMedia);
                  }}>
                  {
                    image.media_type == 'photo' ?

                      <FastImage

                        borderRadius={10}
                        key={index}
                        style={[styles.image, { width: secondImageWidth, height: secondImageHeight }, this.props.imageStyle]}
                        source={{ uri: SERVER_URL + image.media_url }}
                      /> :
                      <View style={{ width: secondImageWidth, height: secondImageHeight }}>
                        <Video
                          source={{ uri: SERVER_URL + image.media_url }}
                          keyExtractor={image.id}
                          resizeMode={"cover"}
                          style={[styles.image, { width: secondImageWidth, height: secondImageHeight }, this.props.imageStyle]}
                         
                        />
                        <Icon name="play" size={25} color="lightgray" style={styles.videoPlayer}> </Icon>
                      </View>
                  }
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
    var group = parseInt(extraImgs.length / 3) + (extraImgs.length % 3 == 0 ? 0 : 1);
    var arr = [];
    for (var i = 0; i < group; i++) {
      arr.push(i * 3);
    }
    return (
      <View>
        {arr.map((item) => (
          <View>
            {this._renderRow(extraImgs.slice(item, item + 3), 'row', false, 0, true)}
          </View>
        ))}
      </View>
    )
  }

  deleteItem  = async () =>{
    this.setState({showZoomimg:false, spinner:true});
    var res = await removePortfolio({portfolio_id:this.state.selectedMedia.id});   
    
    this.setState({spinner:false});

    console.log(res);
    if (res) {
      this.props.callbackFrom(this.state.selectedMedia.id);
    }
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
      index++;
    })

    return (
      <View>
        <Spinner
                    visible={this.state.spinner}
                />
        {this._renderRow(firstRow, sourceLen == 3 ? 'column' : 'row')}
        {secondRow.length && (sourceLen >= 6) ? this._renderRow(secondRow, 'column') : this._renderRow(secondRow, 'row')}
        {this._renderRow(thirdRow, 'row', !this.state.lastImageClicked && extraNum ? true : false, extraNum)}
        {
          this.state.lastImageClicked ? (
            this._renderExtraImages()
          ) : null
        }
        <Modal visible={this.state.showZoomimg}
          style={{ width: width, height: height, 
            backgroundColor:"red" }}
          transparent={true}
          onRequestClose={() => { this.setState({ showZoomimg: false }) }}>
            <View style={{backgroundColor:'#ffd5fe70', height: height,}}>

            <Icon name="trash" size={30} color="red" 
               style={{zIndex:9999, position:'absolute', left:50,
               top:isIphoneX()?85:50}}
               onPress={() => { this.deleteItem() }}/>

            <Icon name="times" size={30} color="black" 
               style={{zIndex:9999, position:'absolute', right:50,
               top:isIphoneX()?85:50}}
               onPress={() => { this.setState({ showZoomimg: false }) }}/>

          {
            this.state.selectedMedia && this.state.selectedMedia.media_type == 'photo' ?
            
               <ImageZoom 
                      cropWidth={width}
                       cropHeight={isIphoneX()?height-40:height - 70}
                       imageWidth={width}
                       imageHeight={height}
                        resizeMode="contain"
                       >     
                          
                <FastImage
                resizeMode="contain"
                style={{ width: width, height: height}}
                
                       source={{uri:SERVER_URL + this.state.selectedMedia.media_url}}/>
              
              </ImageZoom>
              :
              this.state.selectedMedia &&
              <VideoPlayer
                video={{ uri: SERVER_URL + this.state.selectedMedia.media_url }}
                autoplay={true}
                style={{ backgroundColor: '#b9b9b978', height: isIphoneX()?height-40:height - 70 }}
              />
          }
          </View>
        </Modal>        
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
  },
  videoPlayer: {
    position: 'absolute', top: '45%', left: '45%'
  }
}

export default PhotoGrid
