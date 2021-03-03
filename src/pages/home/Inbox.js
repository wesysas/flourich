import React, { Component } from 'react';
import {View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList} from 'react-native';

import { Card, ListItem, Button, CheckBox, Avatar } from 'react-native-elements'

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {getMessage} from "../../shared/service/api";
import Spinner from "react-native-loading-spinner-overlay";
import Moment from "moment";
import {SERVER_URL} from "../../globalconfig";
const IconText = ({ iconName, size, txt }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={iconName} size={size} />
            <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>{txt}</Text>
        </View>
    );
};


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
};

export default class Inbox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            spinner: false,
            booking:{},
            bookings:[],
        }
    }

    async componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.setState({spinner: true});
            var bookings = await getMessage({creator_id:global.creator.cid, status:[2,3,4,5,6,7,8,9]});
            this.setState({bookings});
            this.setState({spinner: false});
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        return (
            <View style={{
                flex: 1,
                // marginHorizontal: 30,
                marginTop: 10
            }}>
                <Spinner visible={this.state.spinner} />
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
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>Inbox</Text>
                <ScrollableTabView
                    style={styles.container}
                    renderTabBar={() =>
                        <DefaultTabBar
                            backgroundColor='rgba(255, 255, 255, 0.7)'
                        />}
                    tabBarPosition='overlayTop'
                >
                    <FlatList tabLabel='Messages' style={styles.flatList}
                              data={this.state.bookings}
                              keyExtractor={(item,index)=>item.bid.toString()}
                              renderItem = {({item,index})=>
                                  <TouchableOpacity key={item.bid.toString()} style={[styles.rowStyle, {flexDirection: 'row'}]}
                                                    onPress={() => {
                                                        global.booking = item;
                                                        this.props.navigation.navigate('ChatBox');
                                                    }}
                                  >
                                      <Avatar
                                          rounded
                                          size="large"
                                          source={{uri: SERVER_URL+item.avatar}}
                                      />
                                      <ListItem.Content>
                                          <ListItem.Title>{item.first_name} {item.last_name}</ListItem.Title>
                                          <ListItem.Subtitle>{item.last_msg}</ListItem.Subtitle>
                                      </ListItem.Content>
                                      <ListItem.Chevron />
                                      <View style={{ position: 'absolute', right: 3, alignItems: 'center' }}>
                                          <Text>{item.last_msg_time?Moment(item.last_msg_time).format('HH:mm'):''}</Text>
                                          <Text style={{ width: 20, height: 20, backgroundColor: '#242729', color: 'white', borderRadius: 10, textAlign: 'center' }}>6</Text>
                                      </View>
                                  </TouchableOpacity>
                              }
                    />

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
        marginTop:50,
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
    },
    flatList: {
        marginTop: 50
    },
    rowStyle: {
        justifyContent: 'space-between',
        marginHorizontal:20,
        marginVertical:10,
    },
});