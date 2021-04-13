import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import { LogBox } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadCard, uploadAvatar } from '../../shared/service/api';
import { getUserId } from '../../shared/service/storage';
import { btnGradientProps } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { DefaultBtnHeight, HEIGHT, WIDTH } from '../../globalconfig';
import BackButton from '../../components/BackButton';
import { SERVER_URL } from '../../globalconfig';

import { isIphoneX } from 'react-native-iphone-x-helper';
import ImageZoom from 'react-native-image-pan-zoom';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import FastImage from 'react-native-fast-image';

import Spinner from 'react-native-loading-spinner-overlay';
const options = [
    'Cancel',
    'Camera',
    'Gallery',
]
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ffd5fe70',
        height: HEIGHT
    },
    headerTitle: {
        fontSize: 30,
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
        marginVertical: 10,
        borderRadius: 8,
        height: DefaultBtnHeight
    }
});
export default class StoryView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            strory: '',
            spinner: false,
        }
        this.imagePicker = ImagePicker;
    }

    componentDidMount() {
        if (this.props.route.params) {
            this.setState({ story: this.props.route.params.story });
        }
        console.log(this.state.story)
    }

    clickSkipButton = () => {
        this.props.navigation.navigate('Home');
    }
    render() {
        return (
            <SafeAreaView>
                <Spinner
                    visible={this.state.spinner}
                />
                <View style={styles.container}>
                    <BackButton navigation={this.props.navigation} />
                    {this.state.story && this.state.story.media_type == 'video' &&
                        <VideoPlayer
                            video={{ uri: SERVER_URL + this.state.story.media_url }}
                            autoplay={true}
                            style={{ backgroundColor: '#b9b9b978', height: isIphoneX() ? HEIGHT - 40 : HEIGHT - 70 }}
                        />}
                    {this.state.story && this.state.story.media_type == 'photo' &&
                        <ImageZoom
                            cropWidth={WIDTH}
                            cropHeight={isIphoneX() ? HEIGHT - 40 : HEIGHT - 70}
                            imageWidth={WIDTH}
                            imageHeight={HEIGHT}
                            resizeMode="contain"
                        >
                            <FastImage
                                resizeMode="contain"
                                style={{ width: WIDTH, height: HEIGHT }}
                                source={{ uri: SERVER_URL + this.state.story.media_url }} />
                        </ImageZoom>
                    }
                </View>
            </SafeAreaView>
        )
    }
}
