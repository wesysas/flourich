import React, { useState, useCallback, Component } from 'react';
import { View, Text, Picker, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, PermissionsAndroid } from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler'

import {Button, SocialIcon, Input, SearchBar, Divider, ListItem, Card, CheckBox} from 'react-native-elements';
import { getBookings } from '../../shared/service/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { render } from 'react-dom';
import Geolocation from '@react-native-community/geolocation';
import { SelectMultipleButton } from "react-native-selectmultiple-button";
import _ from "lodash";

import  { SERVER_URL,LATITUDE,LONGITUDE, LATITUDE_DELTA, LONGITUDE_DELTA}  from '../../globalconfig';
import {bottomSheetStyle, ios_red_color, btnBackgroundColor} from "../../GlobalStyles";
import Moment from 'moment';
import axios from 'axios';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import PopoverTooltip from 'react-native-popover-tooltip';


import { getServiceData } from '../../shared/service/api';
import { googleConfig } from '../../globalconfig';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PhoneInput from "react-native-phone-number-input";
import {getStorage} from "../../../../creator-interface/src/shared/service/storage";
//navigator.geolocation.getCurrentPosition = Geolocation.getCurrentPosition;
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// const origin = {latitude: 51.68080542967339, longitude: 0.1236155113725498};
// const destination = {latitude: 51.511040135977304, longitude: 0.2671244205013812};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAKXQN4GlcQgn3qmtsZDpFCuVHqtkf4whk';

navigator.geolocation = require('@react-native-community/geolocation');
const styles = StyleSheet.create({
    mapcontainer: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    btnStyle: {
        width: 90,
        borderRadius: 50,
        borderColor: 'gray',
        margin: 10
    },
    mozaicImg: {
        width: Dimensions.get('window').width-20,
        aspectRatio: 1,
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
    locTxt: {
        fontWeight: 'bold',
        fontSize: 14
    },
    summaryTxt: {
        fontWeight: 'bold',
        fontSize: 14
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
    }

});
const IconText = ({ iconName, size, txt }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={iconName} size={size} />
            <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>{txt}</Text>
        </View>
    );
};
export default class Explore extends Component {

    constructor() {
        super();
        this.state = {
            date: new Date(),
            date_title:'Online',
            from_time: new Date(),
            to_time: new Date(),
            isDatePickerVisible: false,
            isFromTimePickerVisible: false,
            isToTimePickerVisible: false,
            search: '',
            bookings: [],
            mapRegion: {
                latitude: LATITUDE,
                longitude:  LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            lastLat: 0,
            lastLong: 0,
        };
        this.bottomSheet = null;
    }
    watchId = null;

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Example App',
                    'message': 'Example App access to your location '
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

        this.requestLocationPermission();
        this.watchID = navigator.geolocation.watchPosition((position) => {
            let region = {
                // latitude: position.coords.latitude,
                // longitude: position.coords.longitude,
                latitude: LATITUDE,
                longitude:  LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            };
            global.latitude = region.latitude;
            global.longitude = region.longitude;
            console.log(region);
            this.onRegionChange(region, region.latitude, region.longitude);
        });

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.searchSubmit("");
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }
    onRegionChange(region, lastLat, lastLong) {
        this.setState({
            mapRegion: region,
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
        });
    }

    componentWillUnmount() {
        console.log('UNSAFE_componentWillUnmount');
        navigator.geolocation.clearWatch(this.watchID);
    }

    onMapPress(e) {
        console.log(e.nativeEvent.coordinate.longitude);
        let region = {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        };
        this.onRegionChange(region, region.latitude, region.longitude);
    }

    async searchSubmit (search)
    {
        const creator = JSON.parse(await getStorage('creator'));

        var bookings = await getBookings({creator_id:creator.cid, status:1});

        console.log("-------------", bookings);
        if (bookings){
            this.setState({bookings});
            return;
        }

        this.setState({bookings: []})
    }
    async updateSearch (search)
    {
        this.setState({ search});
    }
    pressMark(e) {
        alert(e);
        console.log(e);
        // axios.get('/user')
        //   .then(function (response) {
        //       alert('res');
        //     console.log(response);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //     alert('err');
        //   });
    }
    render() {
        console.log(this.state.mapRegion);
        return (
            <View style={styles.container}>
                <GooglePlacesAutocomplete
                    listViewDisplayed='true'
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
                            position: 'absolute',
                            zIndex: 9999,
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
                                this.setState({isDatePickerVisible:true});
                            }}>
                            <Icon name="clock-o" size={25} color={'grey'} />
                        </TouchableOpacity>
                        <Divider style={{ backgroundColor: 'grey', width: 2, height: 30 }} />
                        <TouchableOpacity onPress={ () => {
                            }}>
                            <Icon name="sliders" size={25} color={'grey'} />
                        </TouchableOpacity>
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
                        <Marker
                            pinColor={"navy"}
                            coordinate={
                                {
                                    latitude: this.state.lastLat,
                                    longitude: this.state.lastLong,
                                }
                            }
                            title={'You'}
                        />
                        {/*<MapViewDirections*/}
                        {/*origin={{latitude: 51.50901, longitude: -0.073849 }}*/}
                        {/*destination={{latitude: 51.519588, longitude: -0.16963 }}*/}
                        {/*apikey={GOOGLE_MAPS_APIKEY}*/}
                        {/*/>*/}
                    </MapView>
                </View>
                <BottomSheet
                    ref={ref => {
                        this.bottomSheet = ref;
                    }}
                    snapPoints={["32%","100%"]}
                    borderRadius={10}
                    initialSnap={0}
                    renderContent={() => (
                        <View
                            style={{
                                backgroundColor: 'white',
                                padding: 16,
                                height: '93%',
                                zIndex:100
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                                <Button
                                    type="clear"
                                    containerStyle={styles.arrowBtnStyle}
                                    icon={( <Icon name="arrow-left" size={20} /> )}
                                    onPress={()=>{}}
                                />
                                <Text style={{fontSize:15,padding:10,fontWeight:'bold'}}>{this.state.bookings.length??0} content creators</Text>
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
                                        style={{borderRadius:10, margin:10,
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 1,
                                            },
                                            shadowOpacity: 0.20,
                                            shadowRadius: 1.41,
                                            elevation: 1,}}>
                                        <View style={{ flexDirection: 'row', padding:10, }}>
                                            <View style={styles.newSideTxt}>
                                                <Text style={{fontWeight: 'bold',fontSize: 20,}}>{ item.first_name } {item.last_name}</Text>
                                                <IconText iconName="map-marker" size={15} txt={item.fulladdress+', '+item.street} />
                                                {/*<Text style={styles.summaryTxt}>Price Range: £ {item.min_price}~{item.max_price}</Text>*/}
                                            </View>
                                            <Text style={{backgroundColor:'black', color: 'white', fontSize:20,position: 'absolute',
                                                top: 20,padding:10,
                                                right: 20}}>12 mins</Text>
                                        </View>

                                        {item.portfolios && (
                                            <FlatList data={Array.from(new Set(item.portfolios.split(',')))}
                                                      style={{height:200}}
                                                      horizontal={true}
                                                      keyExtractor={(item,index)=>index.toString()}
                                                      renderItem={({ item }) => <Image style={styles.mozaicImg} source={{uri: SERVER_URL+item }} />}
                                            />
                                        )}

                                        <TouchableOpacity style={{ flexDirection: 'row', padding:10 }}
                                                          onPress={() => {
                                                              global.creator = item;
                                                              this.props.navigation.navigate('CreatorProfile');
                                                          }}>
                                            <View>
                                                <View style={{flexDirection: 'row'}}
                                                >
                                                    <Icon name="star" color="green" size={15} />
                                                    <Text>{item.rating_point}({item.rating_count})</Text>
                                                </View>
                                                <Text style={styles.title}>{item.services}</Text>
                                                <Text style={styles.desc}>Food Fashion Event</Text>
                                            </View>
                                            <Icon name='heart' color='red' size={25}
                                                  style={{position: 'absolute',
                                                      top: 20,
                                                      right: 20}} />
                                        </TouchableOpacity>
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