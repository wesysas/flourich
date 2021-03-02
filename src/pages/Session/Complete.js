import {Image, Text, StyleSheet, View} from "react-native";
import React from "react";
import ValidationComponent from 'react-native-form-validator';
import { Rating} from 'react-native-ratings';
import {ios_red_color} from "../../GlobalStyles";
import {getBookingStatus, getStatusData} from "../../shared/service/api";

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-around',
        height:'100%'
    }
});

export default class SetupDetail extends ValidationComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View contentContainerStyle={styles.container}>
                <Image style={{
                    width:'80%',
                    height:350,
                    marginTop:30,
                    alignSelf: 'center',
                    resizeMode: 'contain',}}
                       source={require('../../assets/img/shot2.png')} />

                <Text style={{
                    textAlign:'center',
                    fontSize: 35,
                    fontWeight: 'bold',
                    color: ios_red_color
                }}>Content creation{"\n"}session is complete.</Text>

                <Text style={{ textAlign:'center', marginTop:30}}>{global.booking.first_name} {global.booking.last_name} left a review.</Text>

                <Rating
                    type='custom'
                    ratingColor='#1ddb56'
                    ratingBackgroundColor='transparent'
                    startingValue={global.booking.rate}
                    imageSize={25}
                    readonly = {true}
                    style={{ paddingVertical: 10, marginHorizontal: 10 }}
                />
            </View>
        )
    }
}