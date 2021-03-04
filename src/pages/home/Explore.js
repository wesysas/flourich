import React, { useState, useCallback, Component } from 'react';
import { View, Text, Picker, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, PermissionsAndroid } from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler'
import FlashMessage, { showMessage } from "react-native-flash-message";

import {Button, SocialIcon, Input, SearchBar, Divider, ListItem, Card, CheckBox} from 'react-native-elements';
import {getBookings, changeCreatorStatus, updateBooking, getServiceData} from '../../shared/service/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { render } from 'react-dom';
import Geolocation from '@react-native-community/geolocation';
import { SelectMultipleButton } from "react-native-selectmultiple-button";
import _ from "lodash";
import BookingModal from "../../components/BookingModal";

import  { SERVER_URL,LATITUDE,LONGITUDE, LATITUDE_DELTA, LONGITUDE_DELTA, WIDTH, HEIGHT, GOOGLE_MAPS_APIKEY}  from '../../globalconfig';
import {bottomSheetStyle, ios_green_color, btnBackgroundColor} from "../../GlobalStyles";
import Moment from 'moment';
import axios from 'axios';
import { Popover, PopoverController } from 'react-native-modal-popover';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import PopoverTooltip from 'react-native-popover-tooltip';

import { googleConfig } from '../../globalconfig';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PhoneInput from "react-native-phone-number-input";
import {getStorage} from "../../shared/service/storage";
//navigator.geolocation.getCurrentPosition = Geolocation.getCurrentPosition;
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Spinner from 'react-native-loading-spinner-overlay';
import {local} from "../../shared/const/local";

// const origin = {latitude: 51.68080542967339, longitude: 0.1236155113725498};
// const destination = {latitude: 51.511040135977304, longitude: 0.2671244205013812};

navigator.geolocation = require('@react-native-community/geolocation');
const styles = StyleSheet.create({
    mapcontainer: {
        height: HEIGHT-150,
        width: WIDTH,
    },
    btnStyle: {
        backgroundColor:'blue',
        width: 90,
        borderRadius: 50,
        borderColor: 'gray',
        margin: 10
    },
    mozaicImg: {
        marginVertical:10,
        width: 360,
        height: 180,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    map: {
        backgroundColor:'white',
        ...StyleSheet.absoluteFillObject,
    },
    new: {
        flex: 1,
        flexDirection: 'row'
    },
    newImage: {
        width: 100,
        height: 80,
        borderRadius: 5
    },
    newSideTxt: {
        flexDirection: 'column',
        paddingRight: 10
    },
    title: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
    },
    flatList: {
        marginTop: 350,
        height: 120,
        backgroundColor: 'rgba(52, 52, 52, 0)',
        flexGrow: 0
    },
    arrowBtnStyle: {
        width: 38,
        height: 38,
        zIndex: 1,
        borderRadius: 19,
        backgroundColor: "#f5f6f6",
        alignItems: 'center'
    },

    content: {
        backgroundColor:'white',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    arrow: {
        borderTopColor: 'white',

    },
    background: {
        backgroundColor: 'transparent'
    },

});

export default class Explore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            isStatusBtnVisible: false,
            mapRegion: {
                latitude: LATITUDE,
                longitude:  LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            lastLat: LATITUDE,
            lastLong: LONGITUDE,

            booking:{},
            bookings:[],
            pastBookings:[],
            check_type:'accept',
            isDatePickerVisible: false,
            isFromTimePickerVisible:false,
            fromTime:new Date(),
            isToTimePickerVisible:false,
            toTime:new Date(),
        };
        this.date_filter = 1;
        this.bottomSheet = null;
        global.user = {};
    }
    watchId = null;

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Flourich App',
                    'message': 'Flourich App access to your location'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")

            } else {
                console.log("location permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }

    async componentDidMount() {
        global.user = JSON.parse(await getStorage(local.user));
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                let region = {
                    // latitude: position.coords.latitude,
                    // longitude: position.coords.longitude,
                    latitude: LATITUDE,
                    longitude:  LONGITUDE,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                };
                this.onRegionChange(region, region.latitude, region.longitude);
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
        );

        showMessage({
            message: global.user.status==0?"You are now offline.":"You are now online.",
            type: "success",
            backgroundColor: global.user.status==0?"grey":ios_green_color,
            //  color: "#606060", // text color
            titleStyle:{fontSize:20, textAlign:'center'}
        });

        this.searchSubmit("");
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.searchSubmit("");
        });
    }

    onRegionChange(region, lastLat, lastLong) {
        this.setState({
            mapRegion: region,
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
        console.log('UNSAFE_componentWillUnmount');
        navigator.geolocation.clearWatch(this.watchId);
    }

    async searchSubmit (search)
    {
        this.bottomSheet.snapTo(0);

        this.setState({spinner: true});
        var bookings = await getBookings({creator_id:global.user.cid, status:1, date_filter:this.date_filter});
        this.setState({spinner: false});

        if (bookings != null && bookings.length>0)  {
            this.setState({bookings});
            this.bottomSheet.snapTo(1);
        }
        else{
            this.setState({bookings:[]});
            this.bottomSheet.snapTo(0);
        }
    }
    async updateSearch (search)
    {
        this.setState({ search});
    }
    render() {
        return (
            <View style={{flex:1}}>
                <FlashMessage position="top" statusBarHeight={20} style={{zIndex:3}} />
                <GooglePlacesAutocomplete
                    listViewDisplayed='auto'
                    placeholder='Search Location Here'
                    minLength={1} // minimum length of text to search
                    autoFocus={false}
                    fetchDetails={true}
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

                        let region = {
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
                        };
                        this.onRegionChange(region, region.latitude, region.longitude);
                        this.searchSubmit({});
                    }}
                    getDefaultValue={() => {
                        return ''; // text input default value
                    }}
                    query={{
                        // available options: https://developers.google.com/places/web-service/autocomplete
                        key: 'AIzaSyAKXQN4GlcQgn3qmtsZDpFCuVHqtkf4whk',
                        language: 'en', // language of the results
                        types: 'address', // default: 'geocode'
                    }}
                    styles={{
                        container: {
                            zIndex:2, position: 'absolute',
                            width: Dimensions.get('window').width-140,
                            marginTop:12,
                            marginLeft:45,
                        },
                        description: {
                            fontWeight: 'bold',
                            textAlign: 'right'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb',
                        },
                    }}
                    currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel="Current location"
                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={{
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }}
                    GooglePlacesSearchQuery={{
                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                        rankby: 'distance',
                        types: 'food',
                    }}
                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    predefinedPlacesAlwaysVisible={true}
                />
                <View style={{
                    // flex:1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: btnBackgroundColor,
                    borderRadius: 50,
                    borderColor: 'transparent',
                    borderWidth: 1,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,

                    elevation: 4,
                    margin: 10,
                    paddingHorizontal:20,
                    height: 50,
                    width: Dimensions.get('window').width - 20
                }}>
                    <Icon name="search" size={15} color={"grey"}/>
                    <View style={{
                        width:60,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <TouchableOpacity
                            onPress={ () => {
                                this.setState({isStatusBtnVisible:true});
                            }}>
                            <Icon name="clock-o" size={25} color={(global.user.status==1)?ios_green_color:'grey'} />
                        </TouchableOpacity>
                        <Divider style={{ backgroundColor: 'grey', width: 2, height: 30 }} />
                        <PopoverController>
                            {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                                <React.Fragment>
                                    <TouchableOpacity ref={setPopoverAnchor} onPress={openPopover}>
                                        <Icon name="sliders" size={25} color={'grey'} />
                                    </TouchableOpacity>
                                    <Popover
                                        contentStyle={styles.content}
                                        arrowStyle={styles.arrow}
                                        backgroundStyle={styles.background}
                                        visible={popoverVisible}
                                        onClose={closePopover}
                                        fromRect={popoverAnchorRect}
                                        supportedOrientations={['portrait', 'landscape']}
                                    >
                                        <Text style={{ padding: 5, paddingBottom: 10, fontSize:20, borderBottomColor:'lightgrey',borderBottomWidth:1, width:200}}>Sort and Filter</Text>

                                        <TouchableOpacity style={{ flexDirection: 'row',margin:5, alignItems: 'center' }} onPress={ () => {
                                            this.date_filter=1;
                                            this.searchSubmit("");
                                            closePopover();
                                        }}>
                                            <Icon name={this.date_filter==1?"dot-circle-o":"circle-thin"} size={25} color={this.date_filter==1?'black':'grey'}/>
                                            <View>
                                                <Text style={{color:this.date_filter==1?'black':'grey', paddingLeft: 10, fontSize:16}}>New Bookings</Text>
                                                <Text style={{color:'grey', paddingLeft: 10, fontSize:12}}>past 24 hours</Text>
                                            </View>
                                            <Text style={{color:'red', paddingLeft: 20, fontWeight:'bold'}}>{this.date_filter==1?this.state.bookings.length:''}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row',margin:5, alignItems: 'center' }} onPress={ () => {
                                            this.date_filter=2;
                                            this.searchSubmit("");
                                            closePopover();
                                        }}>
                                            <Icon name={this.date_filter==2?"dot-circle-o":"circle-thin"} size={25} color={this.date_filter==2?'black':'grey'}/>
                                            <Text style={{color:this.date_filter==2?'black':'grey', paddingLeft: 10, fontSize:16}}>Past 48 hours</Text>
                                            <Text style={{color:'red', paddingLeft: 20, fontWeight:'bold'}}>{this.date_filter==2?this.state.bookings.length:''}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row',margin:5, alignItems: 'center' }} onPress={ () => {
                                            this.date_filter=365;
                                            this.searchSubmit("");
                                            closePopover();
                                        }}>
                                            <Icon name={this.date_filter==365?"dot-circle-o":"circle-thin"} size={25} color={this.date_filter==365?'black':'grey'}/>
                                            <Text style={{color:this.date_filter==365?'black':'grey', paddingLeft: 10, fontSize:16}}>Any time</Text>
                                            <Text style={{color:'red', paddingLeft: 20, fontWeight:'bold'}}>{this.date_filter==365?this.state.bookings.length:''}</Text>
                                        </TouchableOpacity>
                                    </Popover>
                                </React.Fragment>
                            )}
                        </PopoverController>
                    </View>
                </View>
                <View style={styles.mapcontainer}>
                    <MapView
                        style={styles.map}
                        region={this.state.mapRegion}
                        followUserLocation={true}
                        // onRegionChange={this.onRegionChange.bind(this)}
                        // onPress={this.onMapPress.bind(this)}
                        showsUserLocation={true}
                    >
                        <Marker
                            pinColor={"navy"}
                            coordinate={
                                {
                                    latitude: this.state.lastLat,
                                    longitude: this.state.lastLong,
                                }
                            }
                            title={'Your location'}
                        />
                        {
                            this.state.bookings.map((booking) => (
                                <Marker
                                    key={booking.bid.toString()}
                                    coordinate={
                                        {
                                            latitude: booking.customer_lat,
                                            longitude: booking.customer_long,
                                        }
                                    }
                                    title={booking.first_name+' '+booking.last_name}
                                />
                            ))
                        }
                    </MapView>
                    <FlatList style={styles.flatList}
                              data={this.state.bookings}
                              horizontal={true}
                              keyExtractor={(item,index)=>item.bid.toString()}
                              renderItem = {({item,index})=>
                                  <TouchableOpacity style={{flexDirection: 'row', backgroundColor:'white', borderRadius: 10, padding:10, margin:10, height:100}}
                                                    onPress={ () => {
                                                        // global.user = item;
                                                        // this.props.navigation.navigate('CreatorProfile');
                                                    }}>
                                      <View style={styles.newSideTxt}>
                                          <Text style={styles.title}>{ item.first_name } {item.last_name}</Text>
                                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom:10 }}>
                                              <Icon name="map-marker" size={15} />
                                              <Text style={{ paddingLeft: 5, fontSize:12}}>{item.customer_location}</Text>
                                          </View>
                                          <Text style={{fontSize:15}}>{item.service_type.replace(",", " - ")}</Text>
                                          <Text style={{}}>{Moment(item.start_at).format(("D MMM"))}  |  {Moment(item.start_at).format(("HH:mm"))}  |  £ {item.price}</Text>
                                      </View>
                                      <Image
                                          style={styles.newImage}
                                          resizeMode="cover"
                                          source={{uri: SERVER_URL+item.avatar}}
                                      />
                                      <TouchableOpacity style={{position:'absolute', right:15, top:15}}
                                          onPress={async () => {
                                              var favorite = item.favorite?false:true;
                                              var bookings = this.state.bookings;
                                              bookings[index].favorite = favorite;
                                              this.setState({bookings});
                                             // this.setState({spinner: true});
                                              var bookings = await updateBooking({booking:bookings[index]});
                                            //  this.setState({spinner: false});
                                          }}>
                                          <Icon name='heart' color={item.favorite?'red':'white'} size={20} />
                                      </TouchableOpacity>
                                  </TouchableOpacity>
                              }
                    />
                </View>
                {this.state.isStatusBtnVisible &&
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom:55,
                        left:WIDTH/2-50,
                        zIndex: 2,
                        borderColor:global.user.status==0?"grey":ios_green_color,
                        borderWidth:3,
                        alignItems:'center',
                        justifyContent:'center',
                        width:100,
                        height:100,
                        backgroundColor:'#fff',
                        borderRadius:100,
                    }}
                    onPress={ async () => {
                        this.setState({isStatusBtnVisible:false});
                        global.user.status = global.user.status==0?1:0;

                    //    this.setState({spinner: true});
                        var bookings = await changeCreatorStatus({creator_id:global.user.cid, status:global.user.status});
                     //   this.setState({spinner: false});
                        showMessage({
                            message: global.user.status==0?"You are now offline.":"You are now online.",
                            type: "success",
                            backgroundColor: global.user.status==0?"grey":ios_green_color,
                          //  color: "#606060", // text color
                            titleStyle:{fontSize:20, textAlign:'center'}
                        });
                    }}
                >
                    <Text style={{textAlign:'center', fontSize:20, color:global.user.status==0?"grey":ios_green_color,}}>{(global.user.status==0)?"Go\nOnline":"Go\nOffline"}</Text>
                </TouchableOpacity>
                }
                <BookingModal parent={this} />
                <BottomSheet
                    ref={ref => {
                        this.bottomSheet = ref;
                    }}
                    snapPoints={[0,"8%","80%"]}
                    borderRadius={10}
                    initialSnap={0}
                    renderContent={() => (
                        <View
                            style={{
                                backgroundColor: 'white',
                                padding: 16,
                                height: '100%',
                                zIndex:0
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                                <Button
                                    type="clear"
                                    containerStyle={styles.arrowBtnStyle}
                                    icon={( <Icon name="arrow-left" size={20} /> )}
                                    onPress={()=>{}}
                                />
                                <Text style={{fontSize:15,padding:10,fontWeight:'bold'}}>{this.state.bookings.length??0} bookings available</Text>
                                <Button
                                    type="clear"
                                    containerStyle={styles.arrowBtnStyle}
                                    icon={( <Icon name="arrow-right" size={20} /> )}
                                    onPress={()=>{}}
                                />
                            </View>
                            <FlatList
                                data={this.state.bookings}
                                keyExtractor={(item,index)=>item.bid.toString()}
                                renderItem = {({item,index})=>
                                    <View
                                        style={{borderRadius:10,padding:20,margin:10,
                                            justifyContent:'flex-start',
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 1,
                                            },
                                            shadowOpacity: 0.20,
                                            shadowRadius: 1.41,

                                            elevation: 2,
                                        }}>
                                        <View style={{ flexDirection: 'row', justifyContent:'space-between'}}>
                                            <View style={styles.newSideTxt}>
                                                <Text style={{fontWeight: 'bold',fontSize: 20,}}>{ item.first_name } {item.last_name}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon name="map-marker" size={15} />
                                                    <Text style={{ paddingLeft: 5 }}>{item.customer_location}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                  onPress={async () => {
                                                      var favorite = item.favorite?false:true;
                                                      var bookings = this.state.bookings;
                                                      bookings[index].favorite = favorite;
                                                      this.setState({bookings});
                                                  //    this.setState({spinner: true});
                                                      var bookings = await updateBooking({booking:bookings[index]});
                                                   //   this.setState({spinner: false});
                                                  }}>
                                                <Icon name='heart' color={item.favorite?'red':'grey'} size={30} />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{color:'red', textAlign:'right'}}>Offer Expires in {Moment(item.start_at).diff(Moment(new Date()), 'hours')} hrs</Text>

                                        {/*{item.portfolios && (*/}
                                            {/*<FlatList data={Array.from(new Set(item.portfolios.split(',')))}*/}
                                                      {/*style={{height:200}}*/}
                                                      {/*horizontal={true}*/}
                                                      {/*keyExtractor={(item,index)=>index.toString()}*/}
                                                      {/*renderItem={({ item }) => <Image style={styles.mozaicImg} source={{uri: SERVER_URL+item }} />}*/}
                                            {/*/>*/}
                                        {/*)}*/}
                                        <Image style={styles.mozaicImg} source={{uri: SERVER_URL+item.avatar }} />

                                        <View style={{ flexDirection: 'row', alignItems:'flex-end', justifyContent:'space-between'}}>
                                            <View>
                                                <Text style={styles.title}>{item.service_type.replace(",", " - ")}</Text>
                                                <Text style={{}}>{Moment(item.start_at).format(("D MMM"))}  |  {Moment(item.start_at).format(("HH:mm"))}  |  £ {item.price}</Text>
                                            </View>
                                            <PopoverController>
                                                {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                                                    <React.Fragment>
                                                        <TouchableOpacity ref={setPopoverAnchor} onPress={openPopover}>
                                                            <EntypoIcon name="dots-three-vertical" size={20}/>
                                                        </TouchableOpacity>
                                                        <Popover
                                                            contentStyle={styles.content}
                                                            arrowStyle={styles.arrow}
                                                            backgroundStyle={styles.background}
                                                            visible={popoverVisible}
                                                            onClose={closePopover}
                                                            fromRect={popoverAnchorRect}
                                                            supportedOrientations={['portrait', 'landscape']}
                                                        >

                                                            <TouchableOpacity onPress={ () => {
                                                                this.setState({booking:item});
                                                                this.setState({check_type:'accept'});
                                                                this.setState({ showPopover: true });
                                                                closePopover();
                                                            }}>
                                                                <Text style={{margin:5}}>Accept</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={ async () => {
                                                                var bookings = this.state.bookings;

                                                                var index = bookings.findIndex(function(c) {
                                                                    return c.bid == item.bid;
                                                                });

                                                                bookings[index].status_id = 10;
                                                                this.setState({bookings});
                                                            //    this.setState({spinner: true});
                                                                var bookings = await updateBooking({booking:bookings[index]});
                                                             //   this.setState({spinner: false});
                                                                closePopover();
                                                            }}>
                                                                <Text style={{margin:5}}>Decline</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={ () => {
                                                                this.setState({booking:item});
                                                                this.setState({check_type:'postpone'});
                                                                this.setState({ showPopover: true });
                                                                closePopover();
                                                            }}>
                                                                <Text style={{margin:5}}>Postpone</Text>
                                                            </TouchableOpacity>
                                                        </Popover>
                                                    </React.Fragment>
                                                )}
                                            </PopoverController>
                                        </View>
                                    </View>
                                }
                            />
                        </View>
                    )}
                />
            </View>
        )
    }
}