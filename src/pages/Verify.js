import React, { useState, useCallback, Component } from 'react';
import { View, Text, Picker, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Button, SocialIcon, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../GlobalStyles';
import { RectButton } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { render } from 'react-dom';
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

export default class Verify extends Component {

    constructor() {
        super();
        this.state = {
            imgURL: imgVerification,
            value: '',
            buttonShow: false
        };
    }

    setText(text) {
        this.setState({ value: text });
        if (text.length == 4) {
            this.setState({ imgURL: imgVerifying });
            this.setState({ buttonShow: true });
            // setTimeout(()=>{
            //     this.goHome();
            // }, 2000)
        }
    }

    goHome() {
        this.props.navigation.navigate('Home');
    }

    _renderButton() {
        if (this.state.buttonShow) {
            return (
                <View style={{flex:1, justifyContent:'space-around'}}>
                    <Button
                        buttonStyle={styles.btn}
                        ViewComponent={LinearGradient}
                        titleStyle={styles.btnTitle}
                        linearGradientProps={{
                            colors: ["#c84e77", "#f13e3a"],
                            start: { x: 0, y: 0.5 },
                            end: { x: 1, y: 0.5 },
                        }}
                        title="Continue"
                        onPress={() => this.goHome()}
                    />
                </View>
            )
        } else {
            return (
                <View>

                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Text>Didn't receive code?</Text>
                        <TouchableOpacity>
                            <Text style={{ fontWeight: 'bold', marginHorizontal: 10, color: '#000022' }}>Resend</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <Text style={{ color: '#000022', fontWeight: 'bold', textDecorationLine: 'underline' }}>Call me instead</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {

        return (
            <View style={styles.container}>
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

                {this._renderButton()}
            </View>

        )

    }
}