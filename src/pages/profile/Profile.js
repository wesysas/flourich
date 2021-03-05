import React, { Component, useState, Dimentiions, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Button, Input, CheckBox, Avatar, ListItem, BottomSheet } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import { Col, Row, Grid } from 'react-native-easy-grid';

import ReviewItem from '../../components/ReviewItem';
import BackButton from '../../components/BackButton';
import ProfileAvatar from '../../components/ProfileAvatar';

import RBSheet from 'react-native-raw-bottom-sheet';
import { getStorage, getUserId, saveStorage } from '../../shared/service/storage';
import { local } from '../../shared/const/local';
import { LogBox, FlatList } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { getCreatorMediaData, uploadPortfolio, uploadStory } from '../../shared/service/api';
import { SERVER_URL } from '../../globalconfig';

const styles = StyleSheet.create({
    container: {
        // flexGrow: 1,
        // paddingHorizontal: 30,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black'
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'gray',
        marginVertical: 10
    },
    separate: {
        marginVertical: 20
    },
    btnStyle: {
        width: 90,
        borderRadius: 50,
        borderColor: 'gray',
        margin: 10
    },
    mozaicImg: {
        borderRadius: 10,
        width: 100,
        height: 100,
        aspectRatio: 1,
        alignSelf: 'center',
        resizeMode: 'contain',
        margin: 5
    },
    mozaicImgLarge: {
        borderRadius: 10,
        width: 220,
        height: 210,
        alignSelf: 'center',
    },
    bottomSheetItem: {
        // backgroundColor:'transparent',
    },

});
const _renderCarouselItem = ({ item, index }) => {
    return (
        <View>
            <Avatar
                rounded
                size="large"
                containerStyle={{
                    borderColor: 'red',
                    borderWidth: 2,
                    padding: 5,
                    borderStyle: 'dotted'
                }}
                source={{uri: SERVER_URL+item.media_url }}
            />
            {/* <Text style={{fontSize: 30}}>{item.title}</Text> */}
            {/* <Text>{item.text}</Text> */}
        </View>
    );
}

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            spinner: false,
            story:[],
            portfolio: [],
            user: global.user
        };
        this.activIndex = 3,

        this.user = null;
        this.RBSheetR = null;
        this.bottomSheetList = [
            {
                title: 'Create New',
                containerStyle: {
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                }
            },
            {
                title: 'Portfolio Post',
                titleStyle: { fontWeight: 'bold' },
                onPress: () => {this.openPortfolioPicker() }
            },
            {
                title: 'Story (Photo)',
                titleStyle: { fontWeight: 'bold' },
                onPress: () => {
                    this.openStoryPicker();
                }
            },
            {
                title: 'Story (Video)',
                titleStyle: { fontWeight: 'bold' },
                onPress: () => {
                    this.openStoryVideoPicker();
                }
            },
        ];
    }

    async componentDidMount() {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);        
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.refreshScreen();
        });
    }
  
    componentWillUnmount() {
      this._unsubscribe();
    }

   async refreshScreen() {
        var result = await getCreatorMediaData({ userid: global.user.cid });
        this.setState({user: global.user});
        this.setState({story: result.story});
        this.setState({portfolio: result.portfolio});
    }
    /**
     *  open image picker for portfolio
     */
    openPortfolioPicker = () => {
        this.RBSheetR.close();
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64:true,
            showCropGuidelines:false,
          }).then(image => {
            this.uploadPortfolioImage(image);
          }).catch(err => {
            console.log(err);
        });
    }
    /**
     * 
     * @param {*} image 
     * upload portfolio to user portfolio
     */
    uploadPortfolioImage = async (image) => {
        var userid = await getUserId();
        this.setState({"userid": userid});

        var ext = image.mime;
        var ext_a = ext.split("/");
        if(ext_a.length > 1) {
            ext = ext_a[1];
        }
        var data = image.data;
        this.setState({spinner: true});
        var params = {
            userid: userid,
            media: data,
            ext: ext,
        }
        var res = await uploadPortfolio(params);
        this.setState({spinner: false});
        if(res != null) {
            alert('success');
            this.refreshScreen();
        }
    }

    /**
     * open image camera for story
     */
    openStoryPicker = () => {
        this.RBSheetR.close();

        ImagePicker.openCamera({
            cropping: true,
            // includeBase64:true,
            showCropGuidelines:false,
          }).then(image => {
            this._uploadStory(image, "photo");
          }).catch(err => {
              console.log(err);
          });
    }

    /**
     * 
     * @param {*} media 
     * upload story image and video to server.
     */

    _uploadStory = async (media, media_type="photo") => {
        var userid = await getUserId();
        this.setState({"userid": userid});
        console.log(userid);
        var ext = media.mime;
        var ext_a = ext.split("/");
        if(ext_a.length > 1) {
            ext = ext_a[1];
        }

        this.setState({spinner: true});

        const data = new FormData();
        data.append("media", {
            name: "creator." + ext,
            type: media.mime,
            uri:
              Platform.OS === "android" ? media.path : media.path.replace("file://", "")
          });
        data.append("userid", userid);
        data.append("media_type", media_type);

        console.log(data);
        var res = await uploadStory(data);
        this.setState({spinner: false});
        if(res != null) {
            alert('success');
            this.refreshScreen();
        }
    }
    openStoryVideoPicker = () => {
        this.RBSheetR.close();

        ImagePicker.openCamera({
            includeBase64:true,
            showCropGuidelines:false,
            mediaType: 'video',
          }).then(video => {
            this._uploadStory(video, 'video');
          }).catch(err => {
              console.log(err);
          });
    }

    goPortfolioPost = () => {
        this.RBSheetR.close()
        this.props.navigation.navigate('ProfileAdd');
    }

    goStory = () => {
        alert('goStory');
    }
    
    logout = async () => {
        saveStorage(local.user, null);
        saveStorage(local.token, null);
        this.props.navigation.navigate('Index');
    }    

    goStoryHilight = () => {
        alert('goStoryHilight');
    }

    render () {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                />
                <View style={{
                    alignItems: 'stretch'
                }}>
                    {/* <BackButton navigation={this.props.navigation} /> */}
                    <Image style={styles.image} source={require('../../assets/img/profile_logo.jpg')} />
                    <ProfileAvatar />
                </View>
                <View style={{
                    marginVertical: 30,
                    marginHorizontal: 20
                }}>
                    <Text style={styles.headerTitle}>{this.state.user.first_name} {this.state.user.last_name}</Text>
                    <Text >{this.state.user.fulladdress}, {this.state.user.street}</Text>
                    <Text >{this.state.user.services}</Text>
                    <Text >{this.state.user.weburl}</Text>
    
                    {/* summary header */}
    
                    <View style={[styles.separate, { flexDirection: 'row', justifyContent: 'space-around' }]}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProfileEdit') }}>
                            <Text style={{ fontSize: 20 }} >Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.RBSheetR.open()}>
                            <Text style={{ fontSize: 20 }}>Create New</Text>
                        </TouchableOpacity>
                    </View>
    
                    {/* carousel part */}
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                        <Carousel
                            layout={"default"}
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.story}
                            sliderWidth={300}
                            itemWidth={100}
                            renderItem={_renderCarouselItem}
                            firstItem={1}
                            onSnapToItem={index => {
                                this.activIndex = index;
                            }} />
                    </View>
                    {/* image mozaic part */}
                    <FlatList style={{ marginTop: 30 }}
                        data={this.state.portfolio}
                        numColumns={3}
                        renderItem={({ item }) => <View><Image style={styles.mozaicImg} source={{uri: SERVER_URL+item.media_url }} /></View>}
                        />
                    
    
                    <View style={[styles.separate, {
                        flexDirection: 'row',
                        alignItems: 'center',
    
                    }]}
    
                    >
                        <Icon name="star" color="green" size={25} />
                        <Text style={{ fontSize: 20 }}>4.5 (123)</Text>
                    </View>
    
                    <View>
                        <ReviewItem />
                    </View>
                    <Button
                        type="clear"
    
                        titleStyle={{ textDecorationLine: 'underline' }}
    
                        title="see all reviews"
                        onPress={() => this.props.navigation.navigate('AllReview')}
                    />
    
                </View>
                <RBSheet
                    ref={ref => {
                        this.RBSheetR = ref;
                    }}
                    openDuration={250}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20
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
            </ScrollView>
        )
    }
}
