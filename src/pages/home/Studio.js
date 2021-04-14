import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Image } from 'react-native';
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
import { WIDTH } from '../../globalconfig';
import storage from "@react-native-firebase/storage";
import { getUserId } from '../../shared/service/storage';

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

function listFilesAndDirectories  (reference, pageToken)  {
    return reference.list({ pageToken }).then(result => {
        // Loop over each item
        result.items.forEach(ref => {
        console.log('file', ref.fullPath);
        });

        if (result.nextPageToken) {
        return listFilesAndDirectories(reference, result.nextPageToken);
        }

        if (result.prefixes) {
            result.prefixes.forEach(ref => {
                const reference1 = storage().ref(ref.path);
                return listFilesAndDirectories(reference1, result.nextPageToken);
                });
            // return listFilesAndDirectories(reference, result.nextPageToken);
        }

        return Promise.resolve();
    });
    }

export default class Studio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iconSize: null,
            image_files:[],
            video_files:[],
            // explorer:[],
            // explorerIndex: 0,
            files: [],
            folders:[],
            folderView: true,
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

            this._uploadFile(res);
            return;

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
        this.RBSheetR.close();
    }

    _uploadFile = async (filePath) => {
        try {
          // Check if file selected
          if (Object.keys(filePath).length == 0)
            return alert("Please Select any File");
        //   setLoading(true);
    
          // Create Reference
          console.log(filePath.uri.replace("file://", ""));
          console.log(filePath.name);
          const reference = storage().ref(
            `/myfiles/${filePath.name}`
          );
    
          // Put File
          const task = reference.putFile(
            filePath.uri.replace("file://", "")
          );
          // You can do different operation with task
          // task.pause();
          // task.resume();
          // task.cancel();
    
          task.on("state_changed", (taskSnapshot) => {
            setProcess(
              `${taskSnapshot.bytesTransferred} transferred 
               out of ${taskSnapshot.totalBytes}`
            );
            console.log(
              `${taskSnapshot.bytesTransferred} transferred 
               out of ${taskSnapshot.totalBytes}`
            );
          });

          await task

          const url = await reference.getDownloadURL()
          alert(url)
        //   setFilePath({});
        } catch (error) {
          console.log("Error->", error);
          alert(`Error-> ${error}`);
        }
        // setLoading(false);
      };
        

    async componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            //this.RBSheetR.open();
            console.log('focust')
            this.loadFiles();
        });
        // this.getFolderAndFiles('myfiles');
        // this.getAsset()
        this.loadFiles();
    }

    getFolderAndFiles = async (refName) =>{
        const reference = storage().ref(refName);
        
        // const ref = firebase.storage().ref('/');
        this.setState({spinner: true});
        const result = await reference.listAll();
        console.log('result', result);

        explorer = this.state.explorer;

        var files = [];
        result.items.forEach(ref => {
            console.log('file', ref.fullPath);
            var filenameArr = ref.fullPath.split('/');
            var filename = filenameArr[filenameArr.length-1];
            files.push({name: filename, path: ref.fullPath});
        });

        var folders = [];
        if (result.prefixes) {
            result.prefixes.forEach(ref => {
                console.log('folder', ref.fullPath);
                var foldernameArr = ref.fullPath.split('/');
                var foldername = foldernameArr[foldernameArr.length-1];
                folders.push({name: foldername, path: ref.fullPath});
            });
        }
        explorer.push({files: files, folders: folders})
        this.setState({explorer});

        console.log(this.state.explorer);
        // this.setState({folders});
        this.setState({spinner: false});
    }

    _renderAssetFolder = ( folder ) => {
        return (
            <View>
                <TouchableOpacity 
                    onPress={()=>{this.setState({files: folder.folder_files, folderView:false})}}
                >
                    <Icon name="folder" size={(WIDTH-45)/3} color="#011f6f"/>
                    {/* <Icon name="check-circle" size={25} color="green" style={{ position: 'absolute', top: 17, left: 8 }} /> */}
                    <Text style={{ alignSelf: 'center', bottom: 0, position: 'absolute' }}>{folder.folder_name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: 'center', borderRadius: 15, padding: 2, width: 30, height: 30, alignItems: 'center', borderWidth: 1, borderColor: 'gray' }}>
                    <EntypoIcon name="dots-three-vertical" size={24} />
                </TouchableOpacity>
            </View>
        )
    };
    _renderAssetFile = ( file ) => {
        return (
            <View>
                <TouchableOpacity >
                    <Icon name="file" size={(WIDTH-45)/3} color="#011f6f"/>
                    {/* <Icon name="check-circle" size={25} color="green" style={{ position: 'absolute', top: 17, left: 8 }} /> */}
                    <Text style={{ alignSelf: 'center', bottom: 0, position: 'absolute' }}>{file.file_name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: 'center', borderRadius: 15, padding: 2, width: 30, height: 30, alignItems: 'center', borderWidth: 1, borderColor: 'gray' }}>
                    <EntypoIcon name="dots-three-vertical" size={24} />
                </TouchableOpacity>
            </View>
        )
    };

    async loadFiles(){
        var folders = await getAssets({creator_id:global.user.cid});
        this.setState({folders});
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
                
                <TouchableOpacity style={{position:'absolute', left:WIDTH/2-40, bottom:20, height:80,zIndex:5}}
                    onPress={() => {
                                    this.RBSheetR.open();
                                }}>
                    <Image style={{width:80, height:80}}
                        resizeMode="contain"
                        source={require('../../assets/img/upload-icon.png')} />
                </TouchableOpacity>

                    <Text onPress={()=>{this.setState({folderView: !this.state.folderView})}}>Back</Text>
               
                    {this.state.folderView && <ScrollView style={styles.innerTab}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch' }}>
                            {this.state.folders.length > 0 && this.state.folders.map((folder, i) => {
                                return (
                                    <>
                                    {this._renderAssetFolder(folder)}
                                    </>
                                );
                            })} 
                        </View>                        
                    </ScrollView>}

                    {!this.state.folderView && <ScrollView style={styles.innerTab}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch' }}>                           
                            {this.state.files.length > 0 && this.state.files.map((file, i) => {
                                return (
                                    <>
                                    {this._renderAssetFile(file)}
                                    </>
                                );
                            })}  
                        </View>                        
                    </ScrollView>}
                    

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
        marginHorizontal: 20,
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