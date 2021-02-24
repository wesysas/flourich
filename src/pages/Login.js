import React, { Component, useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Button, SocialIcon, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient/index';

import {API_URL, googleConfig} from '../globalconfig';

import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { loginWithGoogle, loginWithEmail} from '../shared/service/auth';
import { getMe } from '../shared/service/api';

import { saveStorage, getStorage } from '../shared/service/storage';
import ValidationComponent from 'react-native-form-validator';
// import { LoginManager, AccessToken } from "react-native-fbsdk";
import { local } from '../shared/const/local';
import Spinner from 'react-native-loading-spinner-overlay';
import {btnGradientProps} from "../GlobalStyles";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 'auto'
    },
    btnContainer: {
        // flexGrow: 1,
        // justifyContent: 'space-around',
        paddingHorizontal: 30,
        marginTop:10,
        paddingBottom:30,
    },
    btn: {
        borderRadius: 8,
        marginBottom:10,
    },
    btnText: {
        fontSize: 20
    },
    btnIcon: {
        flex: 0,
        color: 'black',
        margin: 25
    },
    numberPart: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    error: {
        color:'red'
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});

export default class LoginPage extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            email: 'jin@gmail.com',
            password: '123123',
            spinner:false,
        }
            // const [selectedValue, setSelectedValue] = useState("java");
        // const [value, onChangeText] = useState('');
    }
    componentDidMount() {
        GoogleSignin.configure({
            webClientId: googleConfig.clientID,
            offlineAccess: false,
        });
    };
    
    componentWillUnmount() {
        // Remove event listener
    };

    _loginWithGoogle = async()=> {
        try{
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            //console.log(userInfo);
            // {
            //     idToken: string,
            //     serverAuthCode: string,
            //     scopes: Array<string>, // on iOS this is empty array if no additional scopes are defined
            //     user: {
            //       email: string,
            //       id: string,
            //       givenName: string,
            //       familyName: string,
            //       photo: string, // url
            //       name: string // full name
            //     }
            //   }
            var res = await loginWithGoogle({"googletoken":userinfo.idToken});
            if(res != null) {
                // go next page
                await saveStorage(local.isLogin, 'true');
                await saveStorage(local.token, res.token);
                await saveStorage(local.user, JSON.stringify(res.user));
                global.user = JSON.stringify(res.user);
                this.props.navigation.navigate('Home');
            }
        }catch(error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // when user cancels sign in process,
                var res = await loginWithGoogle({"googletoken":'userinfo.idToken'});
                if(res != null) {
                    // go next page
                    await saveStorage(local.isLogin, 'true');
                    await saveStorage(local.token, res.token);
                    await saveStorage(local.user, JSON.stringify(res.user));
                    this.props.navigation.navigate('Home');
                }
                alert('Process Cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // when in progress already
              alert('Process in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // when play services not available
              alert('Play services are not available');
            } else {
              // some other error
              alert('Something else went wrong... ', error.toString());
            //   setError(error);
            }
        }
    }

    // need to check
    // _loginWithFacebook = async() => {
    //     LoginManager.logInWithPermissions(["public_profile"]).then(
    //         function(result) {
    //           if (result.isCancelled) {
    //             console.log("Login cancelled");
    //             alert('login cancelled')
    //           } else {
    //             console.log(
    //               "Login success with permissions: " +
    //                 result.grantedPermissions.toString()
    //             );
    //             AccessToken.getCurrentAccessToken().then(accessToken =>
    //                 console.log(accessToken),
    //                );
    //           }
    //         },
    //         function(error) {
    //           console.log("Login fail with error: " + error);
    //         }
    //     );
    // }
    _loginWithEmail = async() => {
        var validate = this.validate({
            email: {email: true},
            password: {minlength:6},
        });
        if(validate) {
            this.setState({spinner: true});
            var res = await loginWithEmail(this.state);
            this.setState({spinner: false});
            if(res != null) {
                // go next page
                await saveStorage(local.isLogin, 'true');
                await saveStorage(local.token, res.token);
                await saveStorage(local.user, JSON.stringify(res.user));

                await saveStorage('creator', JSON.stringify(res.user));

                global.user = res.user;
                global.creator = res.user;
                var userid = res.user.cid;
                this._getMe(userid);
            }
        }
    }

    /**
     * This is redundent function.
     * Can optimize with login function by getting user with user profile.
     */
    _getMe = (userid) => {
        this.setState({spinner: true});
        var data = {userid: userid};
        getMe(data).then( data => {
            console.log(data);
            this.setState({spinner: false});
            if(data != null ){
                var confirm_approved = data.confirm_approved;
                var approved = data.approved;
                var finish_setup = data.finish_setup;
                if(confirm_approved == 1) {
                    this.props.navigation.navigate("Home");
                }else if( approved == 1){
                    // get verify code
                    this.props.navigation.navigate("Verify");
                }else if(finish_setup == 1){
                    // else get finish, go to pending
                    this.props.navigation.navigate("SignUpStacks", {screen: "PendingAccount"});
                }
            }
        })
    }

    render() {
        // const { user } = this.state;
        return (
            <View style={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                />
                <Image style={styles.image} source={require('../assets/img/get_started_logo.jpg')} />
                <ScrollView contentContainerStyle={styles.btnContainer}>
                    <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                        }}>
                        <Text style={{ textAlign: 'center' }}>New User?   
                            <Text 
                                style={{ 
                                    color:'#03489c',
                                }}
                                onPress={()=> {
                                    this.props.navigation.navigate('Signup',{transition:'vertical'})
                                }}
                                > Create an account
                            </Text>
                        </Text>
                    </View>

                    <TextInput
                        style={{ borderWidth:1, borderRadius:4, borderColor:'gray', paddingHorizontal:10, fontSize: 18, marginVertical:10}}
                        placeholder="email@address.com"
                        value={this.state.email}
                        onChangeText={value => {
                            this.setState({"email":value});
                            // this.validate({
                            //     email: {email: true, required: true},
                            //     password: {minlength:6, required: true},
                            // });
                        }}
                    ></TextInput>
                    {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage => <Text style={styles.error}>{errorMessage}</Text>) }

                    <TextInput
                        style={{ borderWidth:1, borderRadius:4, borderColor:'gray', paddingHorizontal:10, fontSize: 18, marginVertical:10}}
                        placeholder="password"
                        value={this.state.password}
                        onChangeText={value => {
                            this.setState({"password":value});
                            // this.validate({
                            //     email: {email: true, required: true},
                            //     password: {minlength:6, required: true},
                            // });
                        }}
                        secureTextEntry={true}
                    ></TextInput>
                    {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage => <Text style={styles.error}>{errorMessage}</Text>) }

                    <View>
                        <Button
                        buttonStyle={ styles.btn }
                            titleStyle={styles.btnTitle}
                            ViewComponent={LinearGradient}
                            linearGradientProps={btnGradientProps}
                            title="Continue"
                            onPress={() => {
                                // navigation.navigate('Verify')
                                this._loginWithEmail();
                            }}
                        />
                    </View>
                    <Text style={{ marginVertical:10, textAlign:'center'}}>Or</Text>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            borderColor: 'gray',
                            borderRadius: 8,
                            borderWidth: 1,
                            height: 40,
                            marginBottom:10
                        }}
                        onPress={() => this._loginWithGoogle()}
                    >
                        <Image
                            style={{
                                // width:50,
                                height: 25,
                                resizeMode: 'contain'
                            }}
                            source={require('../assets/img/google.png')} />
                        <Text>Connect wdddith Google</Text>

                    </TouchableOpacity>

                    <Button
                        icon={
                            <Icon
                                name="apple"
                                size={25}
                                color="white"
                            />
                        }
                        buttonStyle={{ 
                            backgroundColor: 'black', 
                            justifyContent: 'space-evenly', 
                            paddingHorizontal: 55, 
                            borderRadius: 8,
                            marginBottom:10
                         }}

                        iconContainerStyle={styles.btnIcon}
                        title="Connect with Apple"
                    />

                    <Button
                        icon={
                            <Icon
                                name="facebook-square"
                                size={25}
                                color="white"
                            />
                        }
                        // type="outline"
                        color="blue"
                        buttonStyle={{ 
                            backgroundColor: '#39559f', 
                            justifyContent: 'space-evenly', 
                            paddingHorizontal: 55, 
                            borderRadius: 8,
                            marginBottom:10
                         }}
                        titleStyle={styles.btnTitle}
                        iconContainerStyle={styles.btnIcon}
                        iconLeft
                        title="Connect with Facebook"
                    />

                    {/* <View style={styles.numberPart}>
                        <View style={{
                            width: 30,
                            height: 30,
                            backgroundColor: 'black',
                            borderRadius: 15
                        }}>
                        </View>
                        <Picker
                            selectedValue={this.state.selectedValue}
                            style={{ width: 100 }}
                        // onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        >
                            <Picker.Item label="+01" value="01" />
                            <Picker.Item label="+02" value="02" />
                        </Picker>
                        <TextInput
                            style={{ borderColor: 'gray', fontSize: 20 }}
                            onChangeText={text => onChangeText(text)}
                            value={this.state.value}
                            placeholder="Enter Phone Number"
                            keyboardType={'numeric'}
                        />
                    </View> */}
                </ScrollView>
            </View>
        )
    }

}