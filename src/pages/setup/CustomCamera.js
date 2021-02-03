import React, { useState, Component  } from 'react';
import { Button, Input, CheckBox } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import {Picker} from '@react-native-picker/picker';
import { SelectMultipleButton, SelectMultipleGroupButton } from "react-native-selectmultiple-button";
import _ from "lodash";
import ValidationComponent from 'react-native-form-validator';
import { max } from 'react-native-reanimated';
import GlobalStyles from '../../GlobalStyles';
import { createProfile } from '../../shared/service/api';
import { getStorage } from '../../shared/service/storage';

import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image  } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BackButton from '../../components/BackButton';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';

const ios_blue = "#007AFF";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#707070',
      color:'#ffffff'
    },
    cameracontainer: {
        padding:20,
        paddingTop:50,
        flexDirection: 'column',
        alignItems: 'center',
     },
    preview: {
        height: 240,
        borderRadius: 10,
        overflow: 'hidden',
        width:'100%',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 240,
    },
    capture: {
    //   flex: 0,
      backgroundColor: 'transparent',
      alignSelf: 'center',
      margin: 20,
      width: 80,
      height: 80,
      borderRadius: 50,
      borderWidth:1,
      borderColor:'white',
      paddingTop:4,
      paddingLeft:4,
    },
    cap_btn: {
        width:70,
        height:70,
        borderRadius:50,
        backgroundColor:'white',
    },
    cap_btn_disable: {
        width:70,
        height:70,
        borderRadius:50,
        backgroundColor:'black',
        opacity:0.5
    },
    image_preview_container: {
        flex:1, 
    },
    image_preview: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 240,
        width: Dimensions.get('window').width
      },
      preview_btn_container: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'transparent',
        color: '#FFF',
        // justifyContent: 'flex-end',
        // marginBottom: 0
        flexDirection: 'row'
      },
      preview_ok:{
        flex:1,
        alignItems:'center'
      },
      preview_cancel: {
        flex:1,
        alignItems:'center'
      }
  });

export default class CustomCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: '',
            capturing:false,
        }
    }
    takePicture = async () => {
        if (this.camera && !this.state.capturing ) {
            this.setState({'capturing': true})
            const options = { quality: 0.5,'base64': true };
            const photo = await this.camera.takePictureAsync(options);
            this.setState({'capturing': false})
            var base64photo = 'data:image/jpg;base64,' + photo.base64;
            console.log(base64photo);
            this.setState({'photo': base64photo});
        }
    };
    saveCard = async () => {
        console.log('save card image');
    }
    renderCamera() {
        return (
            <View style={{flex:1, flexDirection: 'column'}}>
                <View style={{ width:'100%', flexDirection:'row', }}>
                    <BackButton navigation={this.props.navigation} iconColor="white"/>
                    <View style={{flexDirection: 'row', marginLeft:90, flex:1, }}>
                        <Text style={{ flex:1, height:50, fontSize: 20, paddingTop:10, fontWeight: 'bold',color: 'white', marginVertical:25 }}>ID Card</Text>
                        <Text style={{ flex:1, paddingTop:17, color: 'white', marginVertical:25 }}>Time Remaining 00:00</Text>
                    </View>
                </View>
                <View style={styles.cameracontainer}>
                    <View style={styles.preview}>
                        <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.camera}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        ratio={ '16:16' }
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        //   androidRecordAudioPermissionOptions={{
                        //     title: 'Permission to use audio recording',
                        //     message: 'We need your permission to use your audio',
                        //     buttonPositive: 'Ok',
                        //     buttonNegative: 'Cancel',
                        //   }}
                        />
                        
                    </View>
                    <View>
                        <Text style={{fontSize:16, marginTop:20, fontWeight:'bold', alignSelf:'center',color: 'white',}}>Scan the front and back of the ID Card</Text>
                        <Text style={{fontSize:14, marginTop:20, alignSelf:'center',color: 'white',}}>Position all 4 corners within the frame</Text>
                    </View>
                </View>
                <View style={{ flex: 1,justifyContent: 'flex-end',marginBottom: 0}}>
                    <View style={styles.capture}>
                        <Button 
                            buttonStyle={ styles.cap_btn}
                            disabled={this.state.capturing}
                            icon={
                                <MaterialCommunityIcons
                                  name="camera"
                                  size={35}
                                  color="gray"
                                  style={{ }}
                                />
                              }
                            onPress={this.takePicture.bind(this)}>
                        </Button>
                    </View>
                </View>
            </View>
        );
      }
    //   this.state.photo
    renderImage() {
    return (
        <View style={styles.image_preview_container}>
            <Image
                source={{uri: this.state.photo }}
                style={styles.image_preview}
            />
            <View style={ styles.preview_btn_container }>
                <View style={ styles.preview_ok }>
                    <Button 
                    type="clear"
                    onPress={() => {
                        this.saveCard();
                    }}
                    buttonStyle={{ backgroundColor: 'white', borderRadius:100}}
                    icon={
                        <MaterialCommunityIcons
                          name="check"
                          size={35}
                          color="green"
                          style={{ }}
                        />
                      }
                    ></Button>
                </View>
                <View style={ styles.preview_cancel} >
                    <Button 
                    onPress={() => this.setState({ photo: null })}
                    type="clear"
                    buttonStyle={{ backgroundColor: "white", borderRadius:100}}
                    icon={
                        <MaterialCommunityIcons
                          name="close"
                          size={35}
                          color="red"
                          style={{ }}
                        />
                      }
                    ></Button>
                </View>

            </View>
        </View>
    );
    }
    render() {
    return (
        <View style={styles.container}>
        { this.state.photo ? this.renderImage() : this.renderCamera()}
        </View>
    );
    }
}
