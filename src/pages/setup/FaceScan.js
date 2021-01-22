import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const FaceScan = () =>{
    return (
        <View style={styles.container}>
            <Text>Public FaceScan Screen</Text>
        </View>
    )
}

export default FaceScan;