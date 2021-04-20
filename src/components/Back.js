import React from 'react';
import { View } from 'react-native';
import { StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {btnBackgroundColor} from "../GlobalStyles";

const styles = StyleSheet.create({
    btnStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        zIndex: 1,
        borderRadius: 25,
        backgroundColor: btnBackgroundColor,
        alignItems: 'center',
        top:  25,
        left: 25
    }
});


const Back = ({ onPress }) => {
    return (
        <Button
            icon={<Icon name="arrow-left" size={30} color="black" />}
            type="outline"
            containerStyle={styles.btnStyle}
            buttonStyle={{borderWidth:0}}
            onPress={onPress}
        />
    )
};

export default Back;