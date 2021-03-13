import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SERVER_URL } from '../globalconfig';
import { uploadAvatar } from '../shared/service/api';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { Avatar, ListItem } from 'react-native-elements';

export default class ProfileAvatar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            updated: false,
        };
        this.RBSheetR = null;
        this.bottomSheetList = [
            {
                title: 'Select an Option',
                containerStyle: {
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                }
            },
            {
                title: 'Camera',
                onPress: () => {
                    ImagePicker.openCamera({
                        width: 300,
                        height: 300,
                        cropping: true,
                        includeBase64:true,
                        showCropGuidelines:false,
                      }).then(image => {
                        this.uploadAvatarImage(image);
                        this.RBSheetR.close();
                      }).catch(err => {
                          console.log(err);
                          this.RBSheetR.close();
                      });
                }
            },
            {
                title: 'Gallery',
                onPress: () => {
                    ImagePicker.openPicker({
                        width: 300,
                        height: 300,
                        cropping: true,
                        includeBase64:true,
                        cropperCircleOverlay:true,
                        showCropGuidelines:false,
                      }).then(image => {
                        this.uploadAvatarImage(image);
                        this.RBSheetR.close();
                      }).catch(err => {
                        console.log(err);
                        this.RBSheetR.close();
                    });
                }
            }
        ];
    }
    uploadAvatarImage = async (image) => {
        this.setState({"userid": global.user.cid});

        var ext = image.mime;
        var ext_a = ext.split("/");
        if(ext_a.length > 1) {
            ext = ext_a[1];
        }
        var data = image.data;
        var filename = `${global.user.cid}.${ext}`;
        this.setState({"image": data});
        this.setState({"filename": filename});
        this.setState({spinner: true});
        var res = await uploadAvatar(this.state);
        this.setState({spinner: false});

        if(res != null) {
            global.user.avatar = res.avatar;
        }
    }
    render () {
        return (
            <View style={styles.container}>
                <Avatar
                    rounded
                    key={new Date()}
                    size="xlarge"
                    avatarStyle={styles.avatar}
                    containerStyle={styles.avatarContainer}
                    source={{uri: SERVER_URL+ global.user.avatar+"?time=" + new Date()}}
                />
                {global.user.rating_point && 
                    <View style={styles.markContainer}>
                        <Icon name="star" color="green" size={15} />
                        <Text> {global.user.rating_point} ({global.user.rating_count})</Text>
                    </View>
                }
                <TouchableOpacity style={styles.uploadPicture}
                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                onPress={() => {
                                this.RBSheetR.open();
                            }}>
                    <Icon name="camera" size={15} />
                </TouchableOpacity>
                <RBSheet
                    ref={ref => {
                        this.RBSheetR = ref;
                    }}
                    height={200}    
                    openDuration={250}
                    closeOnDragDown={true}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20
                        },
                        draggableIcon: {
                        backgroundColor: "lightgrey",
                        width:120,
                        height:5
                        }
                    }}
                >
                    {this.bottomSheetList.map((l, i) => (
                        <ListItem key={i} containerStyle={[styles.bottomSheetItem, l.containerStyle]} onPress={l.onPress}>
                            <ListItem.Content style={{ alignItems: 'center' }}>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </RBSheet>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 30,
        bottom: -70,
    },
    uploadPicture: {
        backgroundColor:'red',
        padding:8,
        borderRadius:20,
        borderWidth:1,
        borderColor:'white',
        backgroundColor:'lightgrey',
        position: 'absolute',
        right: 10,
        bottom: 20,
        zIndex:2
    },
    avatar: {
        borderColor: 'white',
        borderWidth: 3
    },
    avatarContainer: {
        padding: 10
    },
    markContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'white',
        bottom: 0,
        width: 100,
        borderRadius: 10,
        borderColor: 'transparent',
        borderWidth: 1,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.9,
        shadowRadius: 8,
        elevation: 1,
        padding: 2
    }
});