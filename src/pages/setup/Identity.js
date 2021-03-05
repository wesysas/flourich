import React, { useState, Component  } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
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
        fontSize: 20,
        fontWeight: 'bold',
        color: 'gray',
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
            availAvatar: false,
            spinner: false,
        }
    }

    componentDidMount() {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }
    showActionSheet = () => {
        this.ActionSheet.show()
    }

    openPicker = () => {
        if(this.state.availAvatar) {
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                includeBase64:true,
                cropperCircleOverlay:true,
                showCropGuidelines:false,
              }).then(image => {
                this.uploadAvatarImage(image);
              }).catch(err => {
                console.log(err);
            });
        }else{
            ImagePicker.openPicker({
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
            ImagePicker.openCamera({
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
            ImagePicker.openCamera({
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
            this.setState({"availAvatar": true});
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
           // this.props.navigation.navigate("PendingAccount");
            this.props.navigation.navigate("Home");
        }
    }
    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                />
                <View style={{
                    marginVertical: 30
                }}>
                    <Text style={styles.headerTitle}>Continue Set Up</Text>
                    <View style={styles.separate}>
                        <Text style={styles.subTitle}>Select the type of ID to proceed</Text>
                        <Text>Country</Text>
                        <Picker
                            selectedValue={this.state.country}
                            style={{ textAlign: 'right' }}
                            onValueChange={(itemValue, itemIndex) => this.setState({"country": itemValue})}
                        >
                            <Picker.Item label="United Kingdom" value="uk" />
                            <Picker.Item label="France" value="fr" />
                        </Picker>
                    </View>

                    <View style={styles.separate}>
                        <Button
                            buttonStyle={styles.btnStyle}
                            ViewComponent={LinearGradient}
                            titleStyle={styles.btnTitle}
                            linearGradientProps={btnGradientProps}
                            title="Identity Card"
                            onPress={()=> {
                                this.setState({'cardtype': 'Identity Card'});
                                this.showActionSheet();
                            }}
                        />
                        <Button
                            buttonStyle={styles.btnStyle}
                            titleStyle={styles.btnTitle}
                            title="Passport"
                            type="outline"
                            onPress={()=> {
                                this.setState({'cardtype': 'Passport'});
                                this.showActionSheet();
                            }}
                        />
                        <Button
                            buttonStyle={styles.btnStyle}
                            titleStyle={styles.btnTitle}
                            title="Drivers License"
                            type="outline"
                            onPress={()=> {
                                this.setState({'cardtype': 'Drivers License'});
                                this.showActionSheet();
                            }}
                        />
                    </View>

                    <View style={{ marginVertical: 20, alignItems: 'center' }}>
                        <Text>For security reasons, you will be required</Text>
                        <Text>to complete the verification process within 10 minutes</Text>
                    </View>
                    <Button
                        buttonStyle={styles.btnStyle}
                        ViewComponent={LinearGradient}
                        titleStyle={styles.btnTitle}
                        linearGradientProps={btnGradientProps}
                        title="Next"
                        disabled={!this.state.availAvatar}
                        onPress={()=> {
                            this.showActionSheet();
                        }}
                    />
                </View>
                <View>
                    <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={<Text style={{color: '#000', fontSize: 18}}>Select Option</Text>}
                    options={options}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={2}
                    onPress={(index) => { 
                        if(index == 1) {
                            this.openCamera();
                        }
                        if(index == 2) {
                            this.openPicker();
                        }
                        }}
                    />
                </View>
            </ScrollView>
        )
    }
}
