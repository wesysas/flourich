import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import { HEIGHT, WIDTH } from '../../globalconfig';
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
});
export default class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: '',
            type: '',
            spinner: false,
        }
    }

    componentDidMount() {
        if (this.props.route.params) {
            this.setState({ 
                link: this.props.route.params.link,
                type: this.props.route.params.type,
            });
        }
    }

    render() {
        return (
            <SafeAreaView>
                <Spinner
                    visible={this.state.spinner}
                />
                <View style={styles.container}>
                    <BackButton navigation={this.props.navigation} />
                    {this.state.type == 'video' &&
                        <VideoPlayer
                            video={this.state.link.indexOf('http') > -1 ? {uri: this.state.link}:{ uri: SERVER_URL + this.state.link }}
                            autoplay={true}
                            style={{ backgroundColor: '#b9b9b978', height: isIphoneX() ? HEIGHT - 40 : HEIGHT - 70 }}
                        />}
                    {this.state.type == 'photo' &&
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
                                source={this.state.link.indexOf('http') > -1 ? {uri: this.state.link}:{ uri: SERVER_URL + this.state.link }} 
                                />
                        </ImageZoom>}
                </View>
            </SafeAreaView>
        )
    }
}
