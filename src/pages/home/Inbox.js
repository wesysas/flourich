import React, { Component } from 'react';
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Moment from "moment";
import {SERVER_URL} from "../../globalconfig";
import {lastMessage, deleteContact} from "../../shared/service/api";
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeout from 'react-native-swipeout';
import _ from "lodash";

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
            var bookings = await lastMessage({creator_id:global.user.cid, status:[2,3,4,5,6,7,8,9]});
            this.setState({bookings});
        });
        var bookings = await lastMessage({creator_id:global.user.cid, status:[2,3,4,5,6,7,8,9]});
        this.setState({bookings});

        
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    deleteContact = async(item, index) => {
        await deleteContact({booking_id: item.bid});
        this.setState({
            bookings: this.state.bookings.filter((_, i) => i !== index)
        });
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
            }}>
                {/* <BackButton navigation={this.props.navigation} /> */}
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: 20 }}>Inbox</Text>
                <ScrollableTabView
                    style={styles.container}
                    renderTabBar={() =>
                        <DefaultTabBar
                            backgroundColor='rgba(255, 255, 255, 0.7)'
                        />}
                    locked={true}
                    tabBarPosition='overlayTop'
                >
                    <FlatList tabLabel='Messages' style={styles.flatList}
                              data={this.state.bookings}
                              keyExtractor={(item,index)=>item.bid.toString()}
                              renderItem = {({item,index})=>
                              <Swipeout
                                    right={[
                                        {
                                            component: (
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexDirection: 'column',
                                                    }}
                                                >

                                                    <Icon name="trash-o" size={30} color={'white'} />
                                                </View>
                                            ),
                                            backgroundColor: '#eb3f55',
                                            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                                            onPress: () => {
                                                this.deleteContact(item, index);
                                            },
                                        },
                                    ]}
                                    autoClose="true"
                                    backgroundColor="transparent"
                                    key={index}
                                >
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
                                      
                                      <View style={{ position: 'absolute', right: 3, alignItems: 'center' }}>
                                        {item.last_at  && <Text>{Moment(item.last_at).format("D/M/YY")}</Text>}
                                        {item.creator_unread >0 &&  <View style={{ width: 20, height: 20, backgroundColor: 'red', borderRadius: 10, justifyContent:'center'}}>
                                              <Text style={{color:'white', textAlign:'center'}}>{item.creator_unread}</Text>
                                            </View>}
                                      </View>
                                  </TouchableOpacity>
                                </Swipeout>
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
                                              size="medium"
                                              source={{uri: SERVER_URL+item.avatar}}
                                          />
                                          <ListItem.Content style={{marginLeft:10}}>
                                              <ListItem.Title>{item.first_name} {item.last_name}</ListItem.Title>
                                              <ListItem.Subtitle>
                                                {item.first_name} {item.last_name} booked at {Moment(item.created_at).format(("D MMM HH:mm"))}
                                              </ListItem.Subtitle>
                                          </ListItem.Content>
                                          <TouchableOpacity style={{ alignItems: 'center' }}>
                                              <EntypoIcon name="dots-three-vertical" size={20}/>
                                          </TouchableOpacity>
                                  </TouchableOpacity>
                              }
                    />

                </ScrollableTabView>
            </SafeAreaView>
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