import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { Card, ListItem, Button, CheckBox, Avatar } from 'react-native-elements'

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
const IconText = ({ iconName, size, txt }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={iconName} size={size} />
            <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>{txt}</Text>
        </View>
    );
}

const MessageItem = () => {
    return (
        <ListItem bottomDivider>
            <Avatar
                rounded
                size="large"
                source={require('../../assets/img/test.jpg')}
            />
            <ListItem.Content>
                <ListItem.Title>Argin</ListItem.Title>
                <ListItem.Subtitle>
                    Latest message display here and upon click opens on a screen
                    with all messages
          </ListItem.Subtitle>

            </ListItem.Content>
            <ListItem.Chevron />
            <View style={{ position: 'absolute', right: 3, alignItems: 'center' }}>
                <Text>12/20</Text>
                <Text style={{ width: 20, height: 20, backgroundColor: '#242729', color: 'white', borderRadius: 10, textAlign: 'center' }}>6</Text>
            </View>
        </ListItem>
    );
}

const NotifiItem = () => {
    return (
        <ListItem bottomDivider>
            <Avatar
                rounded
                size="large"
                source={require('../../assets/img/test.jpg')}
            />
            <ListItem.Content>
                <ListItem.Title>Argin</ListItem.Title>
                <ListItem.Subtitle>
                    Latest message display here and upon click opens on a screen
                    with all messages
      </ListItem.Subtitle>

            </ListItem.Content>
            <ListItem.Chevron />
            <TouchableOpacity style={{ position: 'absolute', right: 3, alignItems: 'center' }}>
                <EntypoIcon name="dots-three-vertical" size={20}/>
            </TouchableOpacity>
        </ListItem>
    );
}

export default class Inbox extends Component {

    constructor() {
        super();
        this.init();
    }
    UNSAFE_componentWillMount() {
        // if (Platform.OS === 'ios') {
        //   CardIOUtilities.preload();
        // }
        // alert('kokok')
    }

    init() {
        // alert('here');
    }

    render() {
        return (
            <View style={{
                flex: 1,
                // marginHorizontal: 30,
                marginTop: 10
            }}>
                <Button
                    icon={
                        <Icon
                            name="arrow-left"
                            size={25}
                            color="black"
                        />
                    }
                    type="outline"
                    buttonStyle={{ width: 50, height: 50, zIndex: 1, borderRadius: 25, borderColor: 'transparent' }}
                    titleStyle={{ color: 'black' }}
                    iconContainerStyle={styles.btnIcon}
                />
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>Booking</Text>
                <ScrollableTabView
                    style={styles.container}
                    renderTabBar={() =>
                        <DefaultTabBar
                            backgroundColor='rgba(255, 255, 255, 0.7)'
                        // tabStyle={{ width: 100 }}
                        />}
                    tabBarPosition='overlayTop'
                >
                    <ScrollView tabLabel='Messages' style={styles.innerTab}>
                        <MessageItem />
                        <MessageItem />
                    </ScrollView>
                    <ScrollView tabLabel='Notification' style={styles.innerTab}>
                        <NotifiItem />
                        <NotifiItem />
                        <NotifiItem />
                    </ScrollView>
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        zIndex: 1
    },
    innerTab: {
        marginVertical: 50,
        marginHorizontal:20
    },
    new: {
        flex: 1,
        flexDirection: 'row'
    },
    newImage: {
        width: 100,
        height: 100,
        borderRadius: 5
    },
    newSideTxt: {
        flexDirection: 'column',
        paddingLeft: 20
    },
    sideIcon: {
        position: 'absolute',
        right: 0

    },
    title: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
        marginVertical: 10
    },
    locTxt: {
        fontWeight: 'bold',
        fontSize: 14
    },
    summaryTxt: {
        fontWeight: 'bold',
        fontSize: 14
    }


});