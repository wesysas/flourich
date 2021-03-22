import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, LogBox} from 'react-native';
import {btnGradientProps} from '../GlobalStyles';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import { local } from '../shared/const/local';
import { getStorage, getUserId} from '../shared/service/storage';
import { getMe } from '../shared/service/api';
import Spinner from 'react-native-loading-spinner-overlay';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { WIDTH, DefaultBtnHeight } from '../globalconfig';

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        marginBottom:isIphoneX()?30:0,        
    },
    image:{
        flex:2.5,
        width:'100%',
        resizeMode: 'cover',
    },
    text:{
        fontSize:28,
        textAlign: 'center',
        padding: 20,
        color: 'black'
    },
    btnContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    btn:{
        width: WIDTH/2.5,
        borderRadius:8,
        // paddingVertical:14
        height:DefaultBtnHeight
    },
    btnText:{
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
            <View style={{flex:1}}>
                <Spinner visible={this.state.spinner}/>
            <Image style={styles.image} source={require('../assets/img/login_signup.jpg')} />
            <View style={styles.container}>
            <Text style={styles.text}>Make money on the go{"\n"}doing what you love.</Text>
                <View style={styles.btnContainer}>
                    <Button
                        type="outline"
                        buttonStyle={[styles.btn, {borderColor:'black'}]}
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
                        onPress={() => this.props.navigation.navigate('Signup')}
                    />
                </View>

            </View>
        </View>
        )
    }

}
