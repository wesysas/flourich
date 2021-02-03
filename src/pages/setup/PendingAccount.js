import React, { useState, useCallback, Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Button, SocialIcon, Input, Slider } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 'auto'
    },
    txtPart: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },
});

export default class PendingAccount extends Component {

    constructor() {
        super();
    }

    render() {

        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/img/pending.jpg')} />
                <View style={styles.txtPart}>
                    <Text style={{ fontSize: 30, fontWeight: '500', color: '#000022' }}>Leteechia,</Text>
                    <Text style={{ textAlign: 'center' }}>Your profile verification is pending. We will inform you{"\n"} when complete in 1-2 business days</Text>

                </View>
                <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', marginHorizontal: 30 }}>
                    <Slider
                        value={0.5}
                        maximumTrackTintColor='#c7e0dc' 
                        minimumTrackTintColor='#76c371'
                        trackStyle={{ height:8}}
                        thumbStyle={{ backgroundColor: 'transparent' }}
                        disabled
                    // onValueChange={(value) => this.setState({ value })}
                    />
                    {/* <Text>Value: {this.state.value}</Text> */}
                </View>
            </View>
        )

    }
}