import React, { useState, Dimentiions } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Button, Input, CheckBox, Avatar, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import { Col, Row, Grid } from 'react-native-easy-grid';

import ReviewItem from '../../components/ReviewItem';
import BackButton from '../../components/BackButton';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
});

const AllReview = ({navigation}) => {

    var go = () => {
        alert('gg');
    }
    return (
        
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton navigation={navigation}/>
           <ReviewItem />

        </ScrollView>
    )


}

export default AllReview;