import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Spinner from "react-native-loading-spinner-overlay";
import RBSheet from "react-native-raw-bottom-sheet";
import {
    getAssets, uploadAsset, saveStudioData, shareToCustomer, finishJob,
    renameFolderAndFile,
    deleteFolderAndFile,
    shareToStoryAndPortfolio,
} from "../../shared/service/api";
import { Button, Input, ListItem, Overlay } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import { WIDTH } from '../../globalconfig';
import { btnGradientProps } from '../../GlobalStyles';
import storage from "@react-native-firebase/storage";
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Back from '../../components/Back';

const width = (WIDTH - 45) / 3;
const height = width;

export default class Studio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            folders: [],
            folderView: true,
            selectedFolder: 'Home',
            selectedFolderId: '',
            bottomSheetTitle: '',
            asset_name: '',
            refPath: '',
            folder_d_name: '',
            file_d_name: '',
            selectedFileId: '',
            visibleRenameOverlay: false,
            rename: '',
        };
        this.RBSheetR = null;
    }

    async componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.loadFiles();
        });
        // this.loadFiles(); // PLEASE REMOVE WHEN BUILDING
    }

    async uploadAsset(storagePath) {
        // Pick a single file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            this._uploadFile(res, storagePath);

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
        global.upload_asset = false;
        this.RBSheetR.close();
    }

    _uploadFile = async (filePath, storagePath) => {
        try {
            // Check if file selected
            if (Object.keys(filePath).length == 0)
                return alert("Please Select any File");
            //   setLoading(true);

            // Create Reference

            const reference = storage().ref(
                storagePath.refPath + `/${filePath.name}`
            );

            // Put File
            const task = reference.putFile(
                filePath.uri.replace("file://", "")
            );
            // You can do different operation with task
            // task.pause();
            // task.resume();
            // task.cancel();

            // task.on("state_changed", (taskSnapshot) => {
            //     console.log(
            //         `${taskSnapshot.bytesTransferred} transferred 
            //    out of ${taskSnapshot.totalBytes}`
            //     );
            // });

            this.setState({ spinner: true })

            await task

            const url = await reference.getDownloadURL()

            var params = {
                creator_id: global.user.cid,
                url: url,
                file_name: filePath.name,
                folder_id: storagePath.folder_id,
                file_type: filePath.type
            }
            var result = await saveStudioData(params);

            this.setState({ spinner: false })
            if (result) {
                var folders = [];
                this.state.folders.forEach((item) => {
                    if (item.f_id == params.folder_id) {
                        var folder = item;
                        folder.folder_files.push({
                            file_name: params.file_name,
                            file_type: params.file_type,
                            url: params.url
                        })
                        folders.push(folder);
                    } else {
                        folders.push(item)
                    }
                })
                this.setState({ folders });
            }


        } catch (error) {
            console.log("Error->", error);
            alert(`Error-> ${error}`);
        }
        // setLoading(false);
    };

    shareToStoryAndPortfolio = async (flag) => {
        var file = this.state.files.filter(item => {
            if (item.file_id == this.state.selectedFileId) return item;
        })[0];
        var params = {
            flag: flag,
            creator_id: global.user.cid,
            featured: 0,
            media_type: file.file_type.indexOf('image') > -1 ? 'photo' : 'video',
            media_url: file.url
        }
        this.setState({ spinner: true });
        var res = await shareToStoryAndPortfolio(params);
        this.setState({ spinner: false });
        this.RBSheetR.close()
        if (res && res.code == 'already') {
            alert('Already Shared');
        }
        if (res && res.code == 'success') {
            alert('Successfully Shared');
        }
        if (!res) {
            alert('Error Happens');
        }
    }

    rename = async () => {
        if (this.state.folderView) {
            var params = {
                folder_id: this.state.selectedFolderId,
                rename: this.state.rename
            }
            this.setState({ spinner: true });
            await renameFolderAndFile(params);
            var folders = [];
            this.state.folders.forEach((item) => {
                if (item.f_id == params.folder_id) {
                    var folderitem = item;
                    folderitem.folder_d_name = params.rename
                    folders.push(folderitem);
                } else {
                    folders.push(item)
                }
            })
            this.setState({ folders, spinner: false });

        } else {
            var params = {
                file_id: this.state.selectedFileId,
                rename: this.state.rename
            }
            this.setState({ spinner: true });
            await renameFolderAndFile(params);
            var files = [];
            this.state.files.forEach((item) => {
                if (item.file_id == params.file_id) {
                    var fileItem = item;
                    fileItem.file_d_name = params.rename
                    files.push(fileItem);
                } else {
                    files.push(item)
                }
            })
            this.setState({ files, spinner: false });
        }

        this.setState({ visibleRenameOverlay: false, rename: '' });
        this.RBSheetR.close()

    }

    delete = async () => {
        if (this.state.folderView) {
            var params = {
                folder_id: this.state.selectedFolderId,
            }
            this.setState({ spinner: true });
            await deleteFolderAndFile(params);
            var folders = [];
            this.state.folders.forEach((item) => {
                if (item.f_id != params.folder_id) {
                    folders.push(item)
                }
            })
            this.setState({ folders, spinner: false });

        } else {
            var params = {
                file_id: this.state.selectedFileId,
            }
            this.setState({ spinner: true });
            await deleteFolderAndFile(params);
            var files = [];
            this.state.files.forEach((item) => {
                if (item.file_id != params.file_id) {
                    files.push(item)
                }
            })
            this.setState({ files, spinner: false });
        }

        this.setState({ visibleRenameOverlay: false, rename: '' });
        this.RBSheetR.close()

    }

    async loadFiles() {
        var folders = await getAssets({ creator_id: global.user.cid });
        if (folders.length > 0) {
            this.setState({
                asset_name: folders[0].asset_name,
                selectedFolder: folders[0].asset_name,
            });
        }
        this.setState({ folders });
    }

    shareToCustomer = async () => {
        var folder = this.state.folders.filter(item => {
            if (item.f_id == this.state.selectedFolderId) return item;
        })[0];

        this.setState({ spinner: true });
        await shareToCustomer({ asset_id: folder.asset_id });
        var folders = [];
        this.state.folders.forEach((item) => {
            if (item.asset_id == folder.asset_id) {
                var folderitem = item;
                folderitem.shared_flag = 1
                folders.push(folderitem);
            } else {
                folders.push(item)
            }
        })
        this.setState({ folders });
        this.setState({ spinner: false });
        this.RBSheetR.close();
    }

    finishJob = async (folder) => {
        this.setState({ spinner: true });
        await finishJob({ asset_id: folder.asset_id });
        var folders = [];
        this.state.folders.forEach((item) => {
            if (item.asset_id == folder.asset_id) {
                var folderitem = item;
                folderitem.finished_flag = 1
                folders.push(folderitem);
            } else {
                folders.push(item)
            }
        })
        this.setState({ folders });
        this.setState({ spinner: false });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    _renderAssetFolder = (folder, index) => {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            files: folder.folder_files,
                            folderView: false,
                            selectedFolder: folder.folder_name,
                            folder_d_name: folder.folder_d_name ? folder.folder_d_name : folder.folder_name,
                            selectedFolderId: folder.f_id
                        })
                    }}
                >
                    <Icon name="folder" size={width} color="#011f6f" />
                    {folder.finished_flag || folder.shared_flag ? <Icon name="check-circle" size={25} color="#3ddb48" style={{ position: 'absolute', top: 17, left: 8 }} /> : null}
                    <Text style={{ alignSelf: 'center', bottom: 0, position: 'absolute' }}>
                        {folder.folder_d_name ? folder.folder_d_name : folder.folder_name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            selectedFolderId: folder.f_id,
                            folder_d_name: folder.folder_d_name ? folder.folder_d_name : folder.folder_name
                        })
                        this.RBSheetR.open()
                    }}
                    style={{ alignSelf: 'center', padding: 2, width: 30, height: 30, alignItems: 'center', }}>
                    <Ionicon name="ellipsis-horizontal" size={24} />
                </TouchableOpacity>
            </View>
        )
    };

    _renderAssetFile = (file) => {
        return (
            <View>
                <TouchableOpacity

                    onPress={() => {
                        var ext = file.file_type.indexOf('image') > -1 ? 'photo' : 'video';

                        this.props.navigation.navigate('Preview', { link: file.url, type: ext })
                    }}
                >
                    {file.file_type.indexOf('image') > -1 ?
                        <FastImage
                            style={{ width: width - 10, height: height, margin: 5 }}
                            source={{ uri: file.url }}
                        /> :
                        <View style={{ width: width - 10, height: height, margin: 5 }}>
                            <Video
                                source={{ uri: file.url }}
                                resizeMode={"cover"}
                                style={[styles.videostyle, {
                                    width: 40,
                                    height: 40
                                }]}
                            />
                            <Icon name="play" size={25} color="lightgray" style={styles.videoPlayer}> </Icon>
                        </View>}
                    <Text style={{ textAlign: 'center', width: width - 10 }}>{file.file_d_name ? file.file_d_name : file.file_name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            file_d_name: file.file_d_name ? file.file_d_name : file.file_name,
                            selectedFileId: file.file_id
                        })
                        this.RBSheetR.open()
                    }}
                    style={{ alignSelf: 'center', padding: 2, width: 30, height: 30, alignItems: 'center', marginTop: 10 }}>
                    <Ionicon name="ellipsis-horizontal" size={24} />
                </TouchableOpacity>
            </View>
        )
    };

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                marginTop: Platform.OS == 'ios' ? 35 : 0,
            }}>
                <Spinner
                    visible={this.state.spinner}
                />
                {!this.state.folderView && <Back onPress={() => {
                    this.setState({
                        folderView: !this.state.folderView,
                        selectedFolder: this.state.asset_name ? this.state.asset_name : 'Home'
                    })
                }} />}
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: 20 }}>Studio</Text>

                {!this.state.folderView && <TouchableOpacity
                    style={{ position: 'absolute', left: WIDTH / 2 - 40, bottom: 20, height: 80, zIndex: 5 }}
                    onPress={() => {
                        var params = {
                            refPath: this.state.asset_name + '/' + this.state.selectedFolder,
                            folder_id: this.state.selectedFolderId
                        }
                        this.uploadAsset(params);
                    }}>
                    <Image style={{ width: 80, height: 80 }}
                        resizeMode="contain"
                        source={require('../../assets/img/upload-icon.png')} />
                </TouchableOpacity>}

                <View style={{ paddingRight: 5, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>

                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{this.state.folderView ? this.state.selectedFolder : this.state.folder_d_name}</Text>
                </View>


                {this.state.folderView && <ScrollView style={styles.innerTab}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch' }}>
                        {this.state.folders.length > 0 && this.state.folders.map((folder, i) => {
                            return (
                                <View key={i}>
                                    {this._renderAssetFolder(folder)}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>}

                {!this.state.folderView && <ScrollView style={styles.innerTab}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' }}>
                        {this.state.files.length > 0 && this.state.files.map((file, i) => {
                            return (
                                <View key={i}>
                                    {this._renderAssetFile(file)}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>}


                <RBSheet
                    ref={ref => {
                        this.RBSheetR = ref;
                    }}
                    // height={200}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            paddingHorizontal: 20
                        },
                        draggableIcon: {
                            backgroundColor: "lightgrey",
                            width: 100
                        }
                    }}
                >
                    {this.state.folderView && <View>
                        <Text style={{ fontSize: 25, textAlign: 'center' }}>{this.state.folder_d_name}</Text>

                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => { this.shareToCustomer(); }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon name="share-variant" size={20} />
                                <Text style={styles.btnStyle}>Share to Customer</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => { this.setState({ visibleRenameOverlay: true }); }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon name="form-textbox" size={20} />
                                <Text style={styles.btnStyle}>Rename</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => { this.delete(); }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon name="trash-can-outline" size={20} color="red" />
                                <Text style={[styles.btnStyle, { color: 'red' }]}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                    </View>}
                    {!this.state.folderView && <View>
                        <Text style={{ fontSize: 25, textAlign: 'center' }}>{this.state.file_d_name}</Text>

                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => { this.shareToStoryAndPortfolio('story'); }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon name="share-variant" size={20} />
                                <Text style={styles.btnStyle}>Share to Story</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => { this.shareToStoryAndPortfolio('portfolio'); }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Ionicon name="image-outline" size={20} />
                                <Text style={styles.btnStyle}>Add To Portfolio</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => { this.setState({ visibleRenameOverlay: true }); }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon name="form-textbox" size={20} />
                                <Text style={styles.btnStyle}>Rename</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => { this.delete(); }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon name="trash-can-outline" size={20} color="red" />
                                <Text style={[styles.btnStyle, { color: 'red' }]}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                    </View>}

                    <Overlay
                        isVisible={this.state.visibleRenameOverlay} onBackdropPress={() => this.setState({ visibleRenameOverlay: false, rename: '' })}>

                        <View>
                            <Input
                                renderErrorMessage={false}
                                inputContainerStyle={{ width: WIDTH * 0.8 }}
                                onChangeText={(value) => {
                                    this.setState({ rename: value })
                                }} />
                            {!this.state.rename && <Text style={{ padding: 3, color: 'red' }}>this is required</Text>}

                            <Button
                                buttonStyle={{ marginTop: 20, borderRadius: 8, height: 40 }}
                                ViewComponent={LinearGradient}
                                linearGradientProps={btnGradientProps}
                                title="Rename"
                                onPress={() =>
                                    this.rename()}
                            />
                        </View>
                    </Overlay>


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
        marginTop: 10,
        marginHorizontal: 20,
    },
    btnStyle: {
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 20,
        borderRadius: 5,
        fontSize: 16,
        textAlign: 'center'
    },
    popovercontent: {
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
});