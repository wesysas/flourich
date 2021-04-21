import React, { Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, PermissionsAndroid } from 'react-native';
import {FlatList} from 'react-native-gesture-handler'
import FlashMessage, { showMessage } from "react-native-flash-message";

import {Button, Divider} from 'react-native-elements';
import {getBookings, changeCreatorStatus, updateBooking, updateLocation} from '../../shared/service/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import _ from "lodash";
import BookingModal from "../../components/BookingModal";

import  { SERVER_URL,LATITUDE,LONGITUDE, LATITUDE_DELTA, LONGITUDE_DELTA, WIDTH, HEIGHT}  from '../../globalconfig';
import {ios_green_color, btnBackgroundColor} from "../../GlobalStyles";
import Moment from 'moment';
import { Popover, PopoverController } from 'react-native-modal-popover';

import MapView, { Marker } from 'react-native-maps';
import BottomSheet from 'reanimated-bottom-sheet';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {getStorage} from "../../shared/service/storage";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {local} from "../../shared/const/local";
import { isIphoneX } from 'react-native-iphone-x-helper';
navigator.geolocation = require('@react-native-community/geolocation');
import { CheckBox } from 'react-native-elements'

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
                    <Text style={styles.summaryTxt}>{Moment(item.start_at).format(("D MMM"))}  |  {Moment(item.start_at).format(("HH:mm"))}  |  £ {item.price}</Text>
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
        this.googlebar = null;
        global.user = {};
    }
    watchId = null;

    async requestLocationPermission() {
        try {
            if (Platform.OS === 'ios') {
                check(PERMISSIONS.IOS.LOCATION_ALWAYS)
                .then((result) => {
                    switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied but requestable');
                        break;
                    case RESULTS.LIMITED:
                        console.log('The permission is limited: some actions are possible');
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        break;
                    }
                })
                .catch((error) => {
                    // …
                });
            }else{
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Flourich App',
                        'message': 'Flourich App access to your location '
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the location")
    
                } else {
                    console.log("location permission denied")
                }
            }
        } catch (err) {
            console.warn(err)
        }
    }

    async componentDidMount() {    
        this.requestLocationPermission();  
        this.googlebar.setAddressText('Some Text');
        global.user = JSON.parse(await getStorage(local.user));
        if (!global.user.status) global.user.status = 0;
        this.watchId = navigator.geolocation.getCurrentPosition(
            (position) => {
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    // latitude: LATITUDE,
                    // longitude:  LONGITUDE,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                };
                this.onRegionChange(region, region.latitude, region.longitude);                
                this.searchSubmit("");
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
        console.log(this.state.mapRegion);
        var update = updateLocation({cid:global.user.cid, lat:region.latitude, long:region.longitude});
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
            <SafeAreaView>
                <FlashMessage position="top" statusBarHeight={20} style={{zIndex:3}} />
                <GooglePlacesAutocomplete
                    ref={ref => {
                        this.googlebar = ref;
                    }}
                    listViewDisplayed='auto'
                    placeholder='Search Location Here'
                    minLength={1} // minimum length of text to search
                    autoFocus={false}
                    fetchDetails={true}
                    renderDescription={row => row.description || row.formatted_address || row.name}
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
                            width: WIDTH-135,
                            marginTop:isIphoneX()?58:13,
                            marginLeft:45,
                        },
                        description: {
                            textAlign: 'right'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb',
                        },
                    }}
                    getDefaultValue={() => {
                        return 'hello'; // text input default value
                    }}
                    currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
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
                    paddingHorizontal:15,
                    height: 50,
                    width: WIDTH - 20
                }}>
                    <Icon name="map-marker" size={25}/>
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
                                        <Text style={{ padding: 5, paddingBottom: 10, fontSize:20, borderBottomColor:'lightgrey',borderBottomWidth:1, width:200,
                                    marginTop:20}}>Sort and Filter</Text>

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
                            this.state.bookings.map((booking) => 
                                
                                {booking.customer_lat && booking.customer_long && <Marker
                                    key={booking.bid.toString()}
                                    coordinate={
                                        {
                                            latitude: booking.customer_lat,
                                            longitude: booking.customer_long,
                                        }
                                    }
                                    title={booking.first_name+' '+booking.last_name}
                                />}
                            )
                        }
                    </MapView>
                </View>
                
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom:130,
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
                    onPress={ () => {
                        this.setState({isStatusBtnVisible:false});
                        global.user.status = global.user.status==0?1:0;

                    //    this.setState({spinner: true});
                        var bookings = changeCreatorStatus({creator_id:global.user.cid, status:global.user.status});
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
                
                <BookingModal parent={this} />
                <BottomSheet
                    ref={ref => {
                        this.bottomSheet = ref;
                    }}
                    snapPoints={[0,"9%","77%"]}
                    borderRadius={10}
                    initialSnap={0}
                    renderContent={() => (
                        <View
                            style={{
                                backgroundColor: 'white',
                                // padding: 16,
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
                                style={styles.flatList}
                                renderItem = {({item,index})=>
                                    <CustomCard item={item} parent={this}/>
                                }
                            />
                        </View>
                    )}
                />
            </SafeAreaView>
        )
    }
}

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
        marginTop: HEIGHT-390,
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
        top: 5
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
