import React, { useState, Component  } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import { CardView } from 'react-native-credit-card-input';
import {Picker} from '@react-native-picker/picker';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { LogBox } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadCard, uploadAvatar } from '../../shared/service/api';
import { getStorage, getUserId } from '../../shared/service/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { btnGradientProps } from '../../GlobalStyles';
import DropDownPicker from 'react-native-dropdown-picker';

const options = [
    'Cancel', 
    'Camera', 
    'Gallery', 
  ]
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 30,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black'
    },
    subTitle: {
        fontSize: 18,
        marginVertical: 10
    },
    separate: {
        marginVertical: 20
    },
    btnStyle: {
        marginVertical: 10, borderRadius: 8
    }
});
export default class Identity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            country: '',
            cardtype: '',
            filename: '',
            image: '',
            uploadedCard: false,
            availAvatar: false,
            spinner: false,
            option: 1,
        }
        this.imagePicker = ImagePicker;
    }

    componentDidMount() {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }
    showActionSheet = () => {
        this.ActionSheet.show()
    }

    openPicker(){
        if(this.state.availAvatar) {
            this.imagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                includeBase64:true,
                cropperCircleOverlay:true,
                showCropGuidelines:false,
              }).then(image => {
                this.uploadAvatarImage(image);
                console.log('----avatar----');
              }).catch(err => {
                console.log(err);
            });
        }else{
            this.imagePicker.openPicker({
                width: 400,
                height: 300,
                cropping: true,
                includeBase64:true,
                // cropperCircleOverlay:true,
                showCropGuidelines:false,
              }).then(image => {
                this.uploadCardImage(image);
              }).catch(err => {
                console.log(err);
            });
        }
    }

    openCamera = () => {
        if(this.state.availAvatar) {
            this.imagePicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
                includeBase64:true,
                showCropGuidelines:false,
              }).then(image => {
                this.uploadAvatarImage(image);
              }).catch(err => {
                  console.log(err);
              });
    
        }else{
            this.imagePicker.openCamera({
                width: 400,
                height: 300,
                cropping: true,
                includeBase64:true,
                showCropGuidelines:false,
              }).then(image => {
                this.uploadCardImage(image);
              }).catch(err => {
                  console.log(err);
              });
    
        }
    }
    uploadCardImage = async (image) => {
        var userid = await getUserId();
        this.setState({"userid": userid});

        var ext = image.mime;
        var ext_a = ext.split("/");
        if(ext_a.length > 1) {
            ext = ext_a[1];
        }
        var data = image.data;
        var filename = `${userid}.${ext}`;
        this.setState({"image": data});
        this.setState({"filename": filename});
        this.setState({spinner: true});
        var res = await uploadCard(this.state);
        this.setState({spinner: false});
        if(res != null) {
            this.setState({"uploadedCard": true});
        }
    }
    uploadAvatarImage = async (image) => {
        var userid = await getUserId();
        this.setState({"userid": userid});

        var ext = image.mime;
        var ext_a = ext.split("/");
        if(ext_a.length > 1) {
            ext = ext_a[1];
        }
        var data = image.data;
        var filename = `${userid}.${ext}`;
        this.setState({"image": data});
        this.setState({"filename": filename});
        this.setState({spinner: true});
        var res = await uploadAvatar(this.state);
        this.setState({spinner: false});
        if(res != null) {
            this.setState({"availAvatar": true});
        }
    }
    render() {
        return (
            <SafeAreaView>
                <ScrollView style={styles.container}>
                    <Spinner
                        visible={this.state.spinner}
                    />
                    <Text style={styles.headerTitle}>Continue Set Up</Text>
                    <Text style={styles.subTitle}>Select the type of ID to proceed</Text>
                    <DropDownPicker
                        items={  [
                        {label: 'United Kingdom', value: 'uk'},
                        {label: 'France', value: 'fr'}]}
                        //defaultValue={this.state.operate_type}
                        style={{borderWidth:0, borderBottomWidth:1, paddingHorizontal:0}}
                        placeholder="Select a country"
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        onChangeItem={item => this.setState({
                            country: item.value
                        })}
                    />

                    <View style={styles.separate}>
                        <Button
                            buttonStyle={styles.btnStyle}
                            ViewComponent={LinearGradient}
                            titleStyle={styles.btnTitle}
                            linearGradientProps={btnGradientProps}
                            title="Identity Card"
                            onPress={()=> {
                                this.setState({'cardtype': 'Identity Card'});
                                this.setState({"availAvatar": false});
                                if(this.state.option === 1) {
                                    this.openCamera();
                                }
                                if(this.state.option === 2) {
                                    this.openPicker();
                                }
                            }}
                        />
                        <Button
                            buttonStyle={styles.btnStyle}
                            titleStyle={styles.btnTitle}
                            title="Passport"
                            type="outline"
                            onPress={()=> {
                                this.setState({'cardtype': 'Passport'});
                                this.setState({"availAvatar": false});
                                if(this.state.option === 1) {
                                    this.openCamera();
                                }
                                if(this.state.option === 2) {
                                    this.openPicker();
                                }
                            }}
                        />
                        <Button
                            buttonStyle={styles.btnStyle}
                            titleStyle={styles.btnTitle}
                            title="Drivers License"
                            type="outline"
                            onPress={()=> {
                                this.setState({'cardtype': 'Drivers License'});
                                this.setState({"availAvatar": false});
                                if(this.state.option === 1) {
                                    this.openCamera();
                                }
                                if(this.state.option === 2) {
                                    this.openPicker();
                                }
                            }}
                        />
                        <Button
                            buttonStyle={styles.btnStyle}
                            ViewComponent={LinearGradient}
                            titleStyle={styles.btnTitle}
                            linearGradientProps={btnGradientProps}
                            title="Profile Picture"
                            onPress={()=> {
                                this.setState({"availAvatar": true});
                                if(this.state.option === 1) {
                                    this.openCamera();
                                }
                                if(this.state.option === 2) {
                                    this.openPicker();
                                }
                            }}
                        />
                    </View>

                    <Text style={{fontSize:13, textAlign:'center', marginBottom:20}}>For security reasons, you will be required to complete the verification process within 10 minutes.</Text>
                    <Button
                        buttonStyle={styles.btnStyle}
                        ViewComponent={LinearGradient}
                        titleStyle={styles.btnTitle}
                        linearGradientProps={btnGradientProps}
                        title="Next"
                        onPress={()=> {
                            if(this.state.availAvatar && this.state.uploadedCard) {   
                                this.props.navigation.navigate("PendingAccount");
                            }                             
                        }}
                    />
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={<Text style={{color: '#000', fontSize: 18}}>Select an Option</Text>}
                        options={options}
                        cancelButtonIndex={0}
                        // destructiveButtonIndex={2}
                        onPress={(option) => { 
                            this.setState({option});
                            }}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}
