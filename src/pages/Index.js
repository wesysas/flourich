import React, { useEffect, useState, Component } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, LogBox} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {GlobalStyles, btnGradientProps} from '../GlobalStyles';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { local } from '../shared/const/local';
import { saveStorage, getStorage, getUserId} from '../shared/service/storage';
import { getMe } from '../shared/service/api';
import Spinner from 'react-native-loading-spinner-overlay';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height:'70%',
        width:'100%',
        alignSelf: 'center',
        resizeMode: 'stretch',
    },
    text: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 20,
        color: 'black'
    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    btn: {
        width: 150,
        borderRadius: 8
    },
    btnText: {
        color: 'black'
    }
});
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            spinner: false,
        }
    }
    componentDidMount() {
        LogBox.ignoreLogs(['Warning: `componentWillReceiveProps`']);

        getUserId().then( userid => {
            if(userid != null) {
                this.setState({'userid': userid});
                if(userid != null) {
                    getStorage(local.token).then(token => {
                        if(token != null) {
                            //this._getMe();
                        }
                    }).catch(err => {
    
                    })
                }
            }
        }).catch(err => {

        })
    }

    _getMe = () => {
        this.setState({spinner: true});
        getMe(this.state).then( data => {
            console.log(data);
            this.setState({spinner: false});
            if(data != null ){
                var confirm_approved = data.confirm_approved;
                var approved = data.approved;
                var finish_setup = data.finish_setup;

                getStorage(local.user).then(user => {
                    if(user != null) {
                        global.user=JSON.parse(user);
                    }
                }).catch(err => {

                });
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
        return (
            <View style={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                />
                <Image style={styles.image} source={require('../assets/img/login_signup.jpg')} />
                <Text style={styles.text}>Make money on the go{"\n"}doing what you love.</Text>
                <View style={styles.btnContainer}>
                    <Button
                        type="outline"
                        buttonStyle={styles.btn}
                        titleStyle={styles.btnText}
                        title="Log In"
                        onPress={() => {
                            // currentUser ? navigation.navigate('Home') :
                                this.props.navigation.navigate('Login');
                                // this.props.navigation.navigate("SignUpStacks", {screen: "PendingAccount"});
                        }}
                    />
                    <Button
                        buttonStyle={styles.btn}
                        ViewComponent={LinearGradient}
                        linearGradientProps={btnGradientProps}
                        title="Sign Up"
                        onPress={() => this.props.navigation.navigate('SignUpStacks')}
                    />
                </View>
            </View>
        )
    }

}
