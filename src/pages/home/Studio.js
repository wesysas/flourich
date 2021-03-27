import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Spinner from "react-native-loading-spinner-overlay";
import RBSheet from "react-native-raw-bottom-sheet";
import {getAssets, uploadAsset} from "../../shared/service/api";
import { Button, Input, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import {multiBtnGroupStyle, ios_red_color, ios_green_color, btnGradientProps} from "../../GlobalStyles";

const AssetFolder = ({ iconSize, fileName }) => {
    return (
        <View>
            <TouchableOpacity >
                <Icon name="folder" size={iconSize} color="#011f6f"/>
                <Icon name="check-circle" size={25} color="green" style={{ position: 'absolute', top: 17, left: 8 }} />
                <Text style={{ alignSelf: 'center', bottom: 0, position: 'absolute' }}>{fileName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: 'center', borderRadius: 15, padding: 2, width: 30, height: 30, alignItems: 'center', borderWidth: 1, borderColor: 'gray' }}>
                <EntypoIcon name="dots-three-vertical" size={24} />
            </TouchableOpacity>
        </View>
    )
};

export default class Studio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iconSize: null,
            image_files:[],
            video_files:[]
        };
        this.RBSheetR = null;
    }
    UNSAFE_componentWillMount() {
        var _height = Dimensions.get('window').height;
        var _width = Dimensions.get('window').width;
        if (_width > _height) {
            this.setState({ iconSize: Math.round(_height / 3 - 15) })
        } else {
            this.setState({ iconSize: Math.round(_width / 3 - 15) })
        }
    }

    async uploadAsset() {

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

            data.append("booking_id", global.user.cid);
            data.append("media_type", res.type);

            this.setState({spinner: true});
            var response = await uploadAsset(data);

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
        this.setState({spinner: false});
        global.upload_asset = false;
        this.loadFiles();
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            //this.RBSheetR.open();
            this.loadFiles();
        });
    }
    async loadFiles(){
        var files = await getAssets({creator_id:global.user.cid});

        if (files){
            var image_files = files.filter((file) => file.media_type == 0);
            var video_files = files.filter((file) => file.media_type == 1);

            this.setState({image_files});
            this.setState({video_files});
        }
    }
    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        return (
            <SafeAreaView  style={{
                flex: 1,
            }}>
                <Spinner
                    visible={this.state.spinner}
                />
                {/* <BackButton navigation={this.props.navigation} /> */}
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop:20}}>Studio</Text>               
                <Button
                    containerStyle={{position:'absolute', right:5, top:20}}
                    titleStyle={{fontSize:20, marginHorizontal:5, marginVertical:0}}
                    ViewComponent={LinearGradient}
                    linearGradientProps={btnGradientProps}
                    title="Upload"
                    onPress={() => {
                        this.RBSheetR.open();
                    }}
                />
                <ScrollableTabView
                    style={styles.container}
                    renderTabBar={() =>
                        <DefaultTabBar
                            backgroundColor='rgba(255, 255, 255, 0.7)'
                        // tabStyle={{ width: 100 }}
                        />}
                    tabBarPosition='overlayTop'
                >
                    <ScrollView tabLabel='Image files' style={styles.innerTab}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch' }}>
                            {this.state.image_files.map((file, i) => {
                                return (
                                    <AssetFolder key={i} iconSize={this.state.iconSize} fileName={file.media_url.replace(/^.*[\\\/]/, '').replace(/^.*[_]/, '')} />
                                );
                            })}                            
                        </View>                        
                    </ScrollView>
                    <ScrollView tabLabel='Video files' style={styles.innerTab}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch' }}>
                            {this.state.video_files.map((file, i) => {
                                return (
                                    <AssetFolder key={i} iconSize={this.state.iconSize}  fileName={file.media_url.replace(/^.*[\\\/]/, '').replace(/^.*[_]/, '')} />
                                );
                            })}
                        </View>
                    </ScrollView>
                </ScrollableTabView>

                <RBSheet
                    ref={ref => {
                        this.RBSheetR = ref;
                    }}
                    height={100}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20
                        },
                        draggableIcon: {
                            backgroundColor: "lightgrey",
                            width:100
                        }
                    }}
                >
                    <TouchableOpacity style={{marginTop:10}}
                                      onPress={async () => {
                                          this.RBSheetR.close();
                                          this.uploadAsset();
                                      }}
                    >
                        <Text style={styles.btnStyle}>Upload assets</Text>
                    </TouchableOpacity>
                </RBSheet>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        zIndex: 1
    },
    innerTab: {
        marginTop:50,
        marginHorizontal: 20
    },
    btnStyle:{
        alignItems: 'center',
        backgroundColor:'#f7f9fc',
        paddingVertical:10,
        marginHorizontal:20,
        borderRadius:5,
        fontSize:16,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
        textAlign:'center'
    }
});