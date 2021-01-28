import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Button, SocialIcon, Input } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../GlobalStyles';
import { RectButton } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient/index';
import SafariView from 'react-native-safari-view'

import {API_URL} from '../globalconfig';

import axios from 'axios';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 'auto'
    },
    btnContainer: {
        flexGrow: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 30,
        marginVertical: 10
    },
    btn: {
        borderRadius: 8
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
    }
});

export default class LoginPage extends Component {

    constructor(props) {

        console.log(API_URL);
        super(props);
        this.state = {
            selectedValue: 'java',
            value: ''
        }
        //     const [selectedValue, setSelectedValue] = useState("java");
        // const [value, onChangeText] = useState('');

    }
    componentDidMount() {
        // Add event listener to handle OAuthLogin:// URLs
        Linking.addEventListener('url', this.handleOpenURL);
        // Launched from an external URL
        Linking.getInitialURL().then((url) => {
            if (url) {
                this.handleOpenURL({ url });
            }
        });
    };

    componentWillUnmount() {
        // Remove event listener
        Linking.removeEventListener('url', this.handleOpenURL);
    };

    handleOpenURL = ({ url }) => {
        // Extract stringified user string out of the URL
        const [, user_string] = url.match(/user=([^#]+)/);
        
        var data = JSON.parse(decodeURI(user_string));

        this.save('@token', data.token);
        this.save('@user', JSON.stringify(data.user));

        if (Platform.OS === 'ios') {
            SafariView.dismiss();
        }

        this.props.navigation.navigate('Home');
    };

    save = async (key, data) => {
        try {
          await AsyncStorage.setItem(key, data)
          console.log('Data successfully saved!')
        } catch (e) {
            console.log(e);
          alert('Failed to save name.')
        }
      }

    // Handle Login with Facebook button tap
    //   loginWithFacebook = () => this.openURL('https://localhost:3000/auth/facebook');

    // Handle Login with Google button tap
    loginWithGoogle = () => this.openURL(API_URL + '/auth/google');

    // Open URL in a browser
    openURL = (url) => {
        // Use SafariView on iOS
        if (Platform.OS === 'ios') {
            SafariView.show({
                url: url,
                fromBottom: true,
            });
        }
        // Or Linking.openURL on Android
        else {
            Linking.openURL(url);
        }
    };

    render() {
        const { user } = this.state;
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../assets/img/get_started_logo.jpg')} />
                <ScrollView contentContainerStyle={styles.btnContainer}>
                    <Text style={{ textAlign: 'center' }}>create a account to continue</Text>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            borderColor: 'gray',
                            borderRadius: 8,
                            borderWidth: 1,
                            height: 40
                        }}
                        // () => navigation.navigate('IdCardScan') //blink
                        onPress={() => this.loginWithGoogle()}
                    >
                        <Image
                            style={{
                                // width:50,
                                height: 25,
                                resizeMode: 'contain'

                            }}
                            source={require('../assets/img/google.png')} />
                        <Text>Connect with Google</Text>

                    </TouchableOpacity>

                    <Button
                        icon={
                            <Icon
                                name="apple"
                                size={25}
                                color="white"
                            />
                        }
                        buttonStyle={{ backgroundColor: 'black', justifyContent: 'space-evenly', paddingHorizontal: 55, borderRadius: 8 }}

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
                        buttonStyle={{ backgroundColor: '#39559f', justifyContent: 'space-evenly', paddingHorizontal: 55, borderRadius: 8 }}
                        titleStyle={styles.btnTitle}
                        iconContainerStyle={styles.btnIcon}
                        iconLeft
                        title="Connect with Facebook"
                    />
                    <Text style={{ textAlign: 'center', paddingTop: 10 }}>or use your phone number</Text>
                    <View style={styles.numberPart}>
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
                    </View>

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
                        onPress={() => navigation.navigate('Verify')}
                    />
                </ScrollView>
            </View>
        )
    }

}