import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { Button, Avatar, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import ProfileAvatar from '../../components/ProfileAvatar';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getUserId } from '../../shared/service/storage';
import { logout } from '../../shared/service/api';
import Moment from 'moment';
import { LogBox, FlatList } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { getCreatorMediaData, getMe, uploadPortfolio, uploadStory, getReviews, getCreatorService, getCreatorProfile } from '../../shared/service/api';
import { SERVER_URL, WIDTH } from '../../globalconfig';
import BackButton from '../../components/BackButton';
import { btnBackgroundColor, ios_red_color, btnGradientProps } from "../../GlobalStyles";
import PhotoGrid from './PhotoGrid'
import _, { rest } from 'lodash'
import DocumentPicker from 'react-native-document-picker';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { saveStorage, getStorage } from '../../shared/service/storage';
import LinearGradient from 'react-native-linear-gradient/index';
import { local } from '../../shared/const/local';
import Video from 'react-native-video';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
    container: {
        // flexGrow: 1,
        // paddingHorizontal: 30,
    },
    headerTitle: {
        fontSize: 20,
        marginBottom: 20,
        color: 'black'
    },
    bodyText: {
        marginVertical: 2
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
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 20,
        fontSize: 16,
        textAlign: 'center'
    },
    mozaicImg: {
        borderRadius: 10,
        width: 100,
        aspectRatio: 1,
        alignSelf: 'center',
        resizeMode: 'center',
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
    reviewContainer: {
        paddingBottom: 10
    },
    reviewDescription: {
        paddingHorizontal: 20
    }
});

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            spinner: false,
            service: [],
            story: [],
            portfolio: [],

            featured: 0,
            portfolio_flag: 1,
            user: global.user,
            min: 100,
            max: 100,
            category: 'Food',
            rbSheetVisible: true,
            typeSheetVisible: false,
            gallarySheetVisible: false,
            image_video: '',
        };
        this.activIndex = 3,

            this.user = null;
        this.RBSheetR = null;
        this.bottomSheetList = [
            {
                title: 'Portfolio Post',
                onPress: () => {
                    this.setState({ portfolio_flag: 1 });
                    this.setState({ rbSheetVisible: false });
                    this.setState({ typeSheetVisible: true });
                    // this.uploadPortfolio();
                }
            },
            {
                title: 'Story',
                onPress: () => {
                    this.setState({ portfolio_flag: 0 });
                    this.setState({ featured: 0 });
                    this.setState({ rbSheetVisible: false });
                    this.setState({ typeSheetVisible: true });
                }
            },
            {
                title: 'Story highlight',
                onPress: () => {
                    this.setState({ portfolio_flag: 1 });
                    this.setState({ featured: 1 });
                    this.setState({ rbSheetVisible: false });
                    this.setState({ typeSheetVisible: true });
                }
            },
        ];
        this.bottomTypeSheetList = [
            {
                title: 'Please select a type',
                onPress: () => {
                }
            },
            {
                title: 'Image',
                onPress: () => {
                    this.setState({
                        image_video: 'image',
                        typeSheetVisible: false,
                        gallarySheetVisible: true
                    });
                }
            },
            {
                title: 'Video',
                onPress: () => {
                    this.setState({
                        image_video: 'video',
                        typeSheetVisible: false,
                        gallarySheetVisible: true
                    });
                }
            },
        ];
        this.bottomGallarySheetList = [
            {
                title: 'Please select option',
                onPress: () => {
                }
            },
            {
                title: 'Gallery',
                onPress: () => {
                    this.openGallaryPicker();
                }
            },
            {
                title: 'Camera',
                onPress: () => {
                    this.openCameraPicker();
                }
            },
        ];
    }

    async componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.refreshScreen();
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    _renderCarouselItem = ({ item, index }) => {
        return (
            <View style={{alignContent:'center', alignItems:'center'}}>
            <TouchableOpacity
                onPress={() => { this.props.navigation.navigate('StoryView', { story: item }) }}
                style={{
                    borderRadius: WIDTH / 5,
                    width: WIDTH / 5 + 15,
                    borderColor: 'red',
                    borderWidth: 2,
                    padding: 5,
                    borderStyle: 'dotted'
                }}
            >
                {item.media_type == 'video' &&
                    <Video
                        source={item.media_url.indexOf('http') > -1 ? { uri: item.media_url } : { uri: SERVER_URL + item.media_url }}
                        resizeMode="cover"
                        muted={true}
                        style={{
                            width: WIDTH / 5,
                            height: WIDTH / 5,
                            borderRadius: WIDTH / 5,
                        }}
                    />}
                {item.media_type == 'photo' && <FastImage
                    resizeMode="cover"
                    style={{
                        width: WIDTH / 5, height: WIDTH / 5,
                        borderRadius: WIDTH / 5,
                    }}

                    source={item.media_url.indexOf('http') > -1 ? { uri: item.media_url } : { uri: SERVER_URL + item.media_url }} />}

                
            </TouchableOpacity>
            {item.featured == 1 && <Text style={{ marginTop: -15, width: 55, fontSize: 8, backgroundColor: ios_red_color, borderRadius: 10, color: 'white', textAlign: 'center', padding: 3 }}>FEATURED</Text>}
            </View>
        );
    }

    async refreshScreen() {
        this.RBSheetR.close();
        var data = await getCreatorProfile({
            userid: global.user.cid,
            limit: 2,
        })
        var user = data.user;//await getMe({ userid: global.user.cid });
        var reviews = data.reviews;//await getReviews({ userid: global.user.cid, limit: 2 });
        var result = data.result;//await getCreatorMediaData({ userid: global.user.cid });
        var service = data.service;//await getCreatorService({ userid: global.user.cid });

        global.user = user;
        this.setState({ user });
        this.setState({ reviews });
        this.setState({ story: result.story });
        this.setState({ portfolio: result.portfolio });
        this.setState({ service });

        if (service.length > 0) {
            var sorted = service.sort(function (a, b) {
                if (a.category_id < b.category_id) {
                    return -1;
                }
                return 0;
            });

            console.log(sorted);
            var category = sorted.map((prop, key) => { return prop.category });
            category = [...new Set(category)];

            category =category.filter(i=> {if(i) return i;})

            this.setState({ category: category.join(", ") });
            this.setState({ min: Math.min.apply(null, service.map((prop, key) => { return prop.price })) });
            this.setState({ max: Math.max.apply(null, service.map((prop, key) => { return prop.price })) });
        }
    }
    /**
     *  open image picker for portfolio
     */
    async uploadPortfolio() {

        // Pick a single file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size
            );

            const data = new FormData();
            data.append("media", {
                name: res.name,
                type: res.type,
                uri: res.uri
            });

            data.append("userid", global.user.cid);
            data.append("media_type", res.type);

            this.setState({ spinner: true });
            var response = await uploadPortfolio(data);

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
        this.setState({ spinner: false });
        this.refreshScreen();
    }

    openCameraPicker = () => {
        if (this.state.image_video == 'video') {
            this.openStoryVideoPicker();
        }
        if (this.state.image_video == 'image') {
            this.openStoryPicker();
        }
    }

    openGallaryPicker = () => {
        if (this.state.image_video == 'video') {
            this.openStoryVideoPickerFromGallary();
        }
        if (this.state.image_video == 'image') {
            this.openStoryPickerFromGallary();
        }
    }

    /**
     * open image camera for story
     */
    openStoryPicker = () => {

        ImagePicker.openCamera({
            // cropping: true,
            // includeBase64:true,
            showCropGuidelines: false,
        }).then(image => {
            this._uploadStory(image, "photo");
            this.refreshScreen();
        }).catch(err => {
            console.log(err);
            Toast.show(err.message);
        });
    }

    /**
     * open image gallary for story
     */
    openStoryPickerFromGallary = () => {

        ImagePicker.openPicker({
            // cropping: true,
            // includeBase64:true,
            showCropGuidelines: false,
        }).then(image => {
            this._uploadStory(image, "photo");
            this.refreshScreen();
        }).catch(err => {
            console.log(err);
            Toast.show(err.message);
        });
    }

    /**
     * 
     * @param {*} media 
     * upload story image and video to server.
     */

    _uploadStory = async (media, media_type = "photo") => {
        var userid = await getUserId();
        this.setState({ "userid": userid });
        console.log(userid);
        var ext = media.mime;
        var ext_a = ext.split("/");
        if (ext_a.length > 1) {
            ext = ext_a[1];
        }

        this.setState({ spinner: true });

        const data = new FormData();
        data.append("media", {
            name: "creator." + ext,
            type: media.mime,
            uri:
                Platform.OS === "android" ? media.path : media.path.replace("file://", "")
        });
        data.append("userid", userid);
        data.append("media_type", media_type);
        data.append("featured", this.state.featured);

        console.log(data);

        if (this.state.portfolio_flag == 1) {
            var res = await uploadPortfolio(data);
        } else {
            var res = await uploadStory(data);
        }

        this.setState({ spinner: false });
        if (res != null) {
            this.refreshScreen();
        }
    }
    openStoryVideoPicker = () => {

        ImagePicker.openCamera({
            includeBase64: true,
            showCropGuidelines: false,
            mediaType: 'video',
        }).then(video => {
            this._uploadStory(video, 'video');
            this.refreshScreen();
        }).catch(err => {
            console.log(err);
            Toast.show(err.message);

        });
    }


    openStoryVideoPickerFromGallary = () => {

        ImagePicker.openPicker({
            includeBase64: true,
            showCropGuidelines: false,
            mediaType: 'video',
        }).then(video => {
            this._uploadStory(video, 'video');
            this.refreshScreen();
        }).catch(err => {
            console.log(err);
            Toast.show(err.message);

        });
    }

    logOut = async () => {
        this.setState({ spinner: true });
        await logout({ cid: global.user.cid });
        await saveStorage(local.isLogin, 'false');
        await saveStorage(local.token, '');
        await saveStorage(local.user, '');

        var login_type = await getStorage('login_type');
        console.log(login_type);
        if (login_type == 'google') {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        }

        await saveStorage('login_type', '');

        this.setState({ spinner: false });
        this.props.navigation.navigate("Index");
    }

    deletePortfolio = (id) => {

        var new_prot = this.state.portfolio.filter((item) => {
            if (item.id != id) return item;
        })
        this.setState({ portfolio: new_prot });
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                />
                <View style={{
                    alignItems: 'stretch'
                }}>
                    <BackButton navigation={this.props.navigation} />
                    <ProfileAvatar />
                </View>
                <View style={{
                    marginVertical: 30,
                    marginHorizontal: 20
                }}>
                    <Text style={styles.headerTitle}>{this.state.user.first_name ?? ''} {this.state.user.last_name}</Text>
                    <Text style={styles.bodyText}>{this.state.user.fulladdress} {this.state.user.street}</Text>
                    {this.state.service && <Text style={styles.bodyText}>£ {this.state.min}~{this.state.max}</Text>}
                    {this.state.service && <Text style={styles.bodyText}>{this.state.category}</Text>}
                    <Text style={styles.bodyText}>{this.state.user.weburl}</Text>

                    {/* summary header */}

                    <View style={[styles.separate, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProfileEdit') }}
                            style={{
                                borderWidth: 1,
                                padding: 10,
                                marginVertical: 10,
                                borderColor: 'lightgrey',
                                width: 150,
                                borderRadius: 5
                            }}
                        >
                            <Text style={{ fontSize: 18, textAlign: 'center', color: 'grey' }} >Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({ rbSheetVisible: true });
                            this.setState({ typeSheetVisible: false });
                            this.RBSheetR.open();
                        }}
                            style={{
                                borderWidth: 1,
                                padding: 10,
                                marginVertical: 10,
                                borderColor: 'lightgrey',
                                backgroundColor: '#f7f9fc',
                                width: 150,
                                borderRadius: 5
                            }}
                        >
                            <Text style={{ fontSize: 18, textAlign: 'center' }}>Add New</Text>
                        </TouchableOpacity>
                    </View>

                    {/* carousel part */}
                    <View style={{
                        flex: 1, flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, marginHorizontal: 5,
                        borderBottomWidth: 1, borderTopWidth: 1, borderColor: 'lightgrey'
                    }}>
                        <Carousel
                            layout={"default"}
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.story}
                            sliderWidth={300}
                            itemWidth={100}
                            renderItem={(item, index) => this._renderCarouselItem(item, index)}
                            firstItem={1}
                            onSnapToItem={index => {
                                this.activIndex = index;
                            }} />
                    </View>
                    {/* image mozaic part */}
                    <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
                        <PhotoGrid source={this.state.portfolio} callbackFrom={(id) => { this.deletePortfolio(id) }} />
                    </SafeAreaView>

                    {global.user.rating_point &&
                        <View style={[styles.separate, {
                            flexDirection: 'row',
                            alignItems: 'center',
                        }]}>
                            <Icon name="star" color="green" size={25} />
                            <Text style={{ fontSize: 20 }}> {global.user.rating_point} ({global.user.rating_count})</Text>
                        </View>
                    }
                    <FlatList
                        data={this.state.reviews}
                        renderItem={({ item }) =>
                            <View style={styles.reviewContainer}>
                                <ListItem>
                                    <Avatar
                                        rounded
                                        size="medium"
                                        source={{ uri: SERVER_URL + item.avatar }}
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title>{item.first_name} {item.last_name}</ListItem.Title>
                                        <ListItem.Subtitle>
                                            {Moment(item.updated_at).fromNow()}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                                <Text style={styles.reviewDescription}>{item.review}</Text>
                            </View>
                        }
                    />

                    {global.user.rating_point &&
                        <Button
                            type="clear"
                            style={{ marginVertical: 20 }}
                            titleStyle={{ textDecorationLine: 'underline', color: 'black', fontSize: 15 }}
                            title={"See all " + global.user.rating_count + " reviews"}
                            onPress={() => this.props.navigation.navigate('AllReview')}
                        />}


                    <Button
                        buttonStyle={{ marginVertical: 20, borderRadius: 8, height: 50 }}
                        ViewComponent={LinearGradient}
                        titleStyle={styles.btnTitle}
                        linearGradientProps={btnGradientProps}
                        title="Log Out"
                        onPress={() => {
                            this.logOut()
                        }}
                    />

                </View>
                <RBSheet
                    ref={ref => {
                        this.RBSheetR = ref;
                    }}
                    closeOnDragDown={true}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20
                        },
                        draggableIcon: {
                            backgroundColor: "lightgrey",
                            width: 120,
                            height: 5
                        }
                    }}
                    height={200}
                    openDuration={250}
                >
                    {this.state.rbSheetVisible && this.bottomSheetList.map((l, i) => (
                        <ListItem key={i} containerStyle={[styles.bottomSheetItem, l.containerStyle]} onPress={l.onPress}>
                            <ListItem.Content style={{ alignItems: 'center' }}>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                    {this.state.typeSheetVisible && this.bottomTypeSheetList.map((l, i) => (
                        <ListItem key={i} containerStyle={[styles.bottomSheetItem, l.containerStyle]} onPress={l.onPress}>
                            <ListItem.Content style={{ alignItems: 'center' }}>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                    {this.state.gallarySheetVisible && this.bottomGallarySheetList.map((l, i) => (
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
