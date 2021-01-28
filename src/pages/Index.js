import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalStyles from '../GlobalStyles';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 'auto'
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

const Index = ({ navigation }) => {

    const [currentUser, setCurrentUser] = useState(null)

    // useEffect(() => {
    //     // retrieveData();
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            retrieveData();
        }, [])
    );

    const retrieveData = async () => {
        try {
            const user = await AsyncStorage.getItem('@user');
            if (user) {
                setCurrentUser(user);
            }
        } catch (e) {
            console.log(e);
            alert('Failed to load name.')
        }
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/img/login_signup.jpg')} />
            <Text style={styles.text}>Make money on the go{"\n"}doing what you love.</Text>
            <View style={styles.btnContainer}>
                <Button
                    type="outline"
                    buttonStyle={styles.btn}
                    titleStyle={styles.btnText}
                    title="Log In"
                    onPress={() => {
                        currentUser ? navigation.navigate('Home') :
                            navigation.navigate('Login')
                    }}
                />
                <Button
                    buttonStyle={styles.btn}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ["#c84e77", "#f13e3a"],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    title="Sign Up"
                    onPress={() => navigation.navigate('SignUpStacks')}
                />
            </View>
        </View>
    )
}

export default Index;