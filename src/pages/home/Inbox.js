import React, { Component } from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Moment from "moment";
import {SERVER_URL} from "../../globalconfig";
import BackButton from "../../components/BackButton";
import {getMessage} from "../../shared/service/api";

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
            var bookings = await getMessage({creator_id:global.creator.cid, status:[2,3,4,5,6,7,8,9]});
            this.setState({bookings});
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        return (
            <View style={{
                flex: 1,
            }}>
                <BackButton navigation={this.props.navigation} />
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: 30 }}>Inbox</Text>
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
                                  <TouchableOpacity key={item.bid.toString()} style={styles.rowStyle}
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
                                      <ListItem.Content style={{marginLeft:10}}>
                                          <ListItem.Title>{item.first_name} {item.last_name}</ListItem.Title>
                                          <ListItem.Subtitle>{item.last_msg}</ListItem.Subtitle>
                                      </ListItem.Content>
                                      {item.last_msg_time &&
                                      <View style={{ position: 'absolute', right: 3, alignItems: 'center' }}>
                                          <Text>{Moment(item.last_msg_time).format("D/M/YY")}</Text>
                                          <Text style={{ width: 20, height: 20, backgroundColor: '#242729', color: 'white', borderRadius: 10, textAlign: 'center', marginTop:10  }}>6</Text>
                                      </View>}
                                  </TouchableOpacity>
                              }
                    />

                    <FlatList tabLabel='Notification' style={styles.flatList}
                              data={this.state.bookings}
                              keyExtractor={(item,index)=>item.bid.toString()}
                              renderItem = {({item,index})=>
                                  <TouchableOpacity key={item.bid.toString()} style={styles.rowStyle}
                                                    onPress={() => {
                                                        global.booking = item;
                                                       // this.props.navigation.navigate('ChatBox');
                                                    }}
                                  >
                                          <Avatar
                                              rounded
                                              size="large"
                                              source={{uri: SERVER_URL+item.avatar}}
                                          />
                                          <ListItem.Content style={{marginLeft:10}}>
                                              <ListItem.Title>{item.first_name} {item.last_name}</ListItem.Title>
                                              <ListItem.Subtitle>
                                                  Latest message display here and upon click opens on a screen
                                                  with all messages
                                              </ListItem.Subtitle>
                                          </ListItem.Content>
                                          <TouchableOpacity style={{ alignItems: 'center' }}>
                                              <EntypoIcon name="dots-three-vertical" size={20}/>
                                          </TouchableOpacity>
                                  </TouchableOpacity>
                              }
                    />

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
        alignItems:'center',
        flexDirection: 'row'
    },
});