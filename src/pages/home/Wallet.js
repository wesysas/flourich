import React, { useState, useCallback, Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Button, SocialIcon, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
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


export default class Wallet extends Component {

    constructor() {
        super();
        this.state = {
          
        };
    }

    render() {

        return (
            <View style={styles.container}>
                <Image style={styles.image} source={this.state.imgURL} />
                <View style={styles.numberPart}>

                    <Text>Wallet</Text>

                </View>

            </View>

        )

    }
}