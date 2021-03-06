import React, { Component } from 'react';
import {View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, FlatList} from 'react-native';
import { CheckBox } from 'react-native-elements'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BookingModal from "../../components/BookingModal";
import {getBookings, updateBooking} from "../../shared/service/api";
import {SERVER_URL} from "../../../src/globalconfig";
import SocketIOClient from 'socket.io-client';
import Moment from 'moment';
import {ios_green_color} from "../../GlobalStyles";


const IconText = ({ iconName, size, txt }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={iconName} size={size} />
            <Text style={{ paddingLeft: 5, flex: 1, flexWrap: 'wrap'}}>{txt}</Text>
        </View>
    );
};

const CustomCheckBox = ({ title, checked, onPress }) => {
    return (
        <CheckBox
            containerStyle ={{backgroundColor: 'transparent', borderWidth:0}}
            textStyle={{fontWeight:'normal', color:checked?ios_green_color:'grey'}}
            checkedColor={ios_green_color}
            uncheckedColor={'grey'}
            checkedIcon='check-square'
            uncheckedIcon='square-o'
            title={title} checked={checked}
            onPress={onPress}
        />
    );
};

const CustomCard = ({item, parent}) => {
    return (
        <TouchableOpacity key={item.bid.toString()} style={styles.rowStyle}
               onPress={() => {
                   global.booking = item;
                   if (item.status_id == 5)
                       parent.props.navigation.navigate('Start');
                   else if(item.status_id == 7 || item.status_id == 8)
                       parent.props.navigation.navigate('Progress');
               }}
        >
            
            <TouchableOpacity style={styles.sideIcon}
                              onPress={async () => {
                                  var favorite = item.favorite?false:true;
                                  var bookings = parent.state.bookings;

                                  var index = bookings.findIndex(function(c) {
                                      return c.bid == item.bid;
                                  });

                                  bookings[index].favorite = favorite;
                                  parent.setState({bookings});
                                  var newBooking = await updateBooking({booking:bookings[index]});
                              }}>
                <Icon name='heart' color={item.favorite?'red':'grey'} size={35}/>
                {item.creator_read == 0?<Text style={{color:'red'}}>New</Text>:null}
            </TouchableOpacity>
            <View style={styles.new}>
                <Image
                    style={styles.newImage}
                    resizeMode="cover"
                    source={{uri: SERVER_URL+item.avatar}}
                />
                <View style={styles.newSideTxt}>
                    <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
                    <IconText iconName="map-marker" size={20} txt={item.customer_location} />
                    <Text style={styles.summaryTxt}>{Moment(item.start_at).format(("D MMM | HH:mm"))} |  ?? {item.price}</Text>
                </View>
            </View>
            <View>
                <Text style={styles.title}>{item.item}</Text>
                <Text style={styles.desc}>
                    {item.content}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <CustomCheckBox title='Accept' checked={item.status_id==3?true:false}
                                onPress={() => {
                                    item.creator_read = 1;
                                    parent.setState({booking:item});
                                    parent.setState({check_type:'accept'});
                                    parent.setState({ showPopover: true });
                                }}
                />
                <CustomCheckBox title='Decline' checked={item.status_id==10?true:false}
                                onPress={async () => {
                                    var bookings = parent.state.bookings;

                                    var index = bookings.findIndex(function(c) {
                                        return c.bid == item.bid;
                                    });

                                    bookings[index].status_id = 10;
                                    
                                    bookings[index].creator_read = 1;
                                    parent.setState({bookings});
                                    var newBooking = await updateBooking({booking:bookings[index]});
                                }}
                />
                <CustomCheckBox title='Postpone' checked={item.status_id==2?true:false}
                                onPress={() => {
                                    item.creator_read = 1;
                                    parent.setState({booking:item});
                                    parent.setState({check_type:'postpone'});
                                    parent.setState({ showPopover: true });
                                }}
                />
            </View>
        </TouchableOpacity>
    );
};

export default class Booking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            booking:{},
            bookings:[],
            pastBookings:[],
            check_type:'accept',
            isDatePickerVisible: false,
            isFromTimePickerVisible:false,
            fromTime:new Date(),
            isToTimePickerVisible:false,
            toTime:new Date(),
        }

        this.socket = SocketIOClient(SERVER_URL);
        this.socket.on('new-bookings', async (mes) => {
            this.setState({spinner: true});
            var bookings = await getBookings({creator_id:global.user.cid, status:[1,2,3,4,5,6,7,8,10], date_filter:365});
            this.setState({bookings});
            
        });
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            var bookings = await getBookings({creator_id:global.user.cid, status:[1,2,3,4,5,6,7,8,10], date_filter:365});
            this.setState({bookings});
        });
    }

    async componentDidMount() {
        var bookings = await getBookings({creator_id:global.user.cid, status:[1,2,3,4,5,6,7,8,10], date_filter:365});
        this.setState({bookings});
        
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
            }}>
                {/* <BackButton navigation={this.props.navigation} /> */}
                
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: 20 }}>Bookings</Text>

                <BookingModal parent={this} />

                <ScrollableTabView
                    style={styles.container}
                    renderTabBar={() =>
                        <DefaultTabBar
                            backgroundColor='rgba(255, 255, 255, 0.7)'
                        // tabStyle={{ width: 100 }}
                        />}
                    onChangeTab={async({ i, from })=>{
                        if (i == from){                            
                            var bookings = await getBookings({creator_id:global.user.cid, status:[1,2,3,4,5,6,7,8,10], date_filter:365});
                            var pastBookings = await getBookings({creator_id:global.user.cid, status:[9], date_filter:365});
                            this.setState({bookings});
                            this.setState({pastBookings});
                        }
                    }}
                    tabBarPosition='overlayTop'
                >
                    <FlatList tabLabel='New' style={styles.flatList}
                              data={this.state.bookings}
                              keyExtractor={(item,index)=>item.bid.toString()}
                              renderItem = {({item,index})=>
                                  <CustomCard item={item} parent={this}/>
                              }
                    />
                    <FlatList tabLabel='Saved' style={styles.flatList}
                              data={this.state.bookings.filter((booking) => booking.favorite===1)}
                              keyExtractor={(item,index)=>item.bid.toString()}
                              renderItem = {({item,index})=>
                                  <CustomCard item={item} parent={this}/>
                              }
                    />
                    <FlatList tabLabel='Past' style={styles.flatList}
                              data={this.state.pastBookings}
                              keyExtractor={(item,index)=>item.bid.toString()}
                              renderItem = {({item,index})=>
                                      <TouchableOpacity key={item.bid.toString()} style={[styles.rowStyle, {flexDirection: 'row'}]}
                                                        onPress={() => {
                                                          global.booking = item;
                                                          this.props.navigation.navigate('Complete');
                                                      }}
                                      >
                                          <Text style={{ position: 'absolute', right: 115, top: 5, color:'grey' }}>completed</Text>
                                          <View>
                                              <Text style={{fontSize: 18}}>{item.first_name} {item.last_name}</Text>
                                              <IconText iconName="map-marker" size={20} txt={item.customer_location} />
                                              {item.service_type&&<Text style={[styles.summaryTxt, {marginTop:10}]}>{item.item}</Text>}
                                              <Text style={styles.summaryTxt}>{Moment(item.start_at).format(("D MMM"))}  |  {Moment(item.start_at).format(("HH:mm"))}  |  ?? {item.price}</Text>
                                          </View>
                                          <Image
                                              style={styles.newImage}
                                              resizeMode="cover"
                                              source={{uri: SERVER_URL+item.avatar}}
                                          />
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
    alertMsg:{
        fontSize: 20, 
        padding:10,
        marginHorizontal:20,
        fontWeight: 'bold', 
        color: 'black', 
        textAlign: 'center', 
        backgroundColor:'#ff5b90',
        borderRadius:5
    },
    innerTab: {
        marginTop:50,
        marginHorizontal: 20
    },
    new: {
        flex: 1,
        flexDirection: 'row'
    },
    rowStyle: {

        justifyContent: 'space-between',
        marginHorizontal:20,
        marginVertical:10,
        padding:10,
        borderRadius:10,

        borderColor:'lightgrey',
        borderWidth:1,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
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
        right: 5,
        top: 5,
        zIndex:10
    },

    name: {
        fontSize: 18,
        marginVertical: 10
    },
    title: {
        fontSize: 15,
        marginVertical: 10
    },
    locTxt: {
        fontSize: 14
    },
    summaryTxt: {
        fontSize: 13
    },
    desc: {
        fontSize: 12,
        color:'grey'
    },
    flatList: {
        marginTop: 50
    },


});