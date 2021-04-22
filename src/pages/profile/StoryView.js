import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { removeStory } from '../../shared/service/api';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { DefaultBtnHeight, HEIGHT, WIDTH } from '../../globalconfig';
import BackButton from '../../components/BackButton';
import { SERVER_URL } from '../../globalconfig';

import { isIphoneX } from 'react-native-iphone-x-helper';
import ImageZoom from 'react-native-image-pan-zoom';
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
    }

    removeStory = async () => {
        await removeStory({id: this.state.story.id});
        this.props.navigation.goBack(null);
    }
    render() {
        return (
            <SafeAreaView>
                <Spinner
                    visible={this.state.spinner}
                />
                <View style={styles.container}>
                    <BackButton navigation={this.props.navigation} />
                    <TouchableOpacity
                    style={{position:'absolute', top:50, right: 50, zIndex:100}}
                        onPress={()=>{
                            this.removeStory()
                        }}
                    >
                        <Icon name="trash" size={30} color="red" />
                    </TouchableOpacity>                    
                    {this.state.story && this.state.story.media_type == 'video' &&
                        <VideoPlayer
                            video={this.state.story.media_url.indexOf('http') > -1?{uri: this.state.story.media_url}:{ uri: SERVER_URL + this.state.story.media_url }}
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
                                source={this.state.story.media_url.indexOf('http') > -1?{uri: this.state.story.media_url}:{ uri: SERVER_URL + this.state.story.media_url }} />
                        </ImageZoom>
                    }
                </View>
            </SafeAreaView>
        )
    }
}
