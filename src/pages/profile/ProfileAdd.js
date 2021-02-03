import React, { useState, useCallback, Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Button, SocialIcon, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RectButton } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { render } from 'react-dom';

import BackButton from '../../components/BackButton';

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


export default class ProfileAdd extends Component {

    constructor(props) {
        super(props);
        this.state = {
          
        };
    }

    render() {

        return (
            <View style={styles.container}>
                <BackButton navigation={this.props.navigation} />
                <Image style={styles.image} source={this.state.imgURL} />
                <View style={styles.numberPart}>

                    <Text>Profile Add</Text>

                </View>

            </View>

        )

    }
}