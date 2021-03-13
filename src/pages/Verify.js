import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import {btnGradientProps} from '../GlobalStyles';

import LinearGradient from 'react-native-linear-gradient';
import { getUserId } from '../shared/service/storage';
import { verifyCode, needApprove } from '../shared/service/api';


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 'auto'
    },
    numberPart: {
        // flex:1,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    textbox: {
        flex: 1,
        marginHorizontal: 30,
        // borderColor: 'gray',
        // borderWidth:1, 
        fontSize: 50,
        textAlign: 'center',
        letterSpacing: 50

    },
    btn: {
        borderRadius: 8,
        marginHorizontal: 40,
    },
    btnTitle: {
        fontSize: 20
    },
});

const imgVerification = require('../assets/img/verification.jpg');
const imgVerifying = require('../assets/img/verifying.jpg');
const imgVerified = require('../assets/img/verified.png');

export default class Verify extends Component {

    constructor() {
        super();
        this.state = {
            imgURL: imgVerification,
            code: '',
            buttonShow: false,
            userid:'',
            confirm: false,
        };
    }

    setText(text) {
        this.setState({ code: text });
        if (text.length == 4) {
            this.setState({ imgURL: imgVerifying });
            this.setState({ buttonShow: true });
        }else{
            this.setState({ imgURL: imgVerification });
            this.setState({ buttonShow: false });
        }
    }

    goHome() {
        this.props.navigation.navigate('Home');
    }

    /**
     * resend approve request
     */
    needApprove = async() => {
        var userid = await getUserId();
        this.setState({"userid": userid});
        var res = await needApprove(this.state);
        alert("Successfully send approve request!");
    }

    /**
     * verify code
     */
    verifyCode = async() => {
        var userid = await getUserId();
        this.setState({"userid": userid});
        var res = await verifyCode(this.state);
        if(res != null) {
            this.setState({confirm:true});
            this.setState({imgURL: imgVerified});
            setTimeout(()=>{
                this.goHome();
            }, 3000);
        }
    }

    _renderButton() {
        if(this.state.confirm){
            return (
                <View></View>
            )
        }else{
            if (this.state.buttonShow) {
                return (
                    <View style={{flex:1, justifyContent:'space-around'}}>
                        <Button
                            buttonStyle={styles.btn}
                            ViewComponent={LinearGradient}
                            titleStyle={styles.btnTitle}
                            linearGradientProps={btnGradientProps}
                            title="Continue"
                            onPress={() => {
                                this.verifyCode();
                            }}
                        />
                    </View>
                )
            } else {
                return (
                    <View style={{ justifyContent:'space-around'}}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Text>Didn't receive code?</Text>
                            <TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', marginHorizontal: 10, color: '#000022' }} onPress={this.needApprove}>Resend</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#000022', fontWeight: 'bold', textDecorationLine: 'underline' }}>Call me instead</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }

    }

    _renderImage() {
        if(this.state.confirm) {
            return (
                <View style={{flex:1}}>
                    <Image style={{ width: '100%', height:'100%'}} source={ require('../assets/img/verified.png') }/>
                </View>
            )
        }else{
            return (
                <View >
                    <Image style={styles.image} source={this.state.imgURL} />
                    <View style={styles.numberPart}>

                        <TextInput
                            style={styles.textbox}
                            value={this.state.value}
                            placeholder="0000"
                            keyboardType={'numeric'}
                            onChangeText={text => this.setText(text)}
                            maxLength={4} />

                    </View>
                </View>
            )
        }
    }
    render() {

        return (
            <View style={styles.container}>
                {this._renderImage()}
                {this._renderButton()}
            </View>

        )

    }
}