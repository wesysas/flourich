import React, { useState, useCallback, Component } from 'react';
import { View, Text, Picker, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Dimensions, PermissionsAndroid } from 'react-native';
import { Button, SocialIcon, Input, SearchBar, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RectButton } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { render } from 'react-dom';
import Geolocation from '@react-native-community/geolocation';

import axios from 'axios';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
// navigator.geolocation.getCurrentPosition = Geolocation.getCurrentPosition;
navigator.geolocation = require('@react-native-community/geolocation');
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        zIndex: 1
    },
    mapcontainer: {
        // flex:1
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },

});

const OwnSearchBar = ({ search, updateSearch }) => {
    return (
        <View style={{
            // flex:1,
            zIndex: 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'white',
            borderRadius: 50,
            borderColor: 'transparent',
            borderWidth: 1,
            shadowColor: "#000000",
            shadowOffset: {
                width: 0,
                height: 20,
            },
            shadowOpacity: 0.9,
            shadowRadius: 8,
            elevation: 21,
            margin: 10,
            height: 50,
            position: 'absolute',
            width: Dimensions.get('window').width - 20



        }}>
            <SearchBar
                placeholder="Search Location Here"
                onChangeText={updateSearch}
                value={search}
                round
                lightTheme
                containerStyle={{
                    flex: 0.8,
                    backgroundColor: 'transparent',
                    borderBottomColor: 'transparent',
                    borderTopColor: 'transparent'
                }}
                inputContainerStyle={{
                    backgroundColor: 'transparent',
                }}
            />
            <Icon name="clock-o" size={25} />
            <Divider style={{ backgroundColor: 'black', width: 2, height: 30 }} />
            <TouchableOpacity>
                <Icon name="sliders" size={25} />
            </TouchableOpacity>
        </View>

    )

}

const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;

export default class Explore extends Component {

    constructor() {
        super();
        this.state = {
            search: '',
            mapRegion: null,
            mapRegion: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            lastLat: 0,
            lastLong: 0,
            markers: [{
                title: 'hello',
                coordinates: {
                    latitude: 37.148561,
                    longitude: -101.652778
                },
            },
            {
                title: 'hello1',
                coordinates: {
                    latitude: 38.149771,
                    longitude: -101.655449
                },
            }]
        };
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
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
               
            } else {
                console.log("location permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }

    componentDidMount() {
        

        this.requestLocationPermission()
        // this.watchID = navigator.geolocation.watchPosition((position) => {
        //     let region = {
        //         latitude: position.coords.latitude,
        //         longitude: position.coords.longitude,
        //         latitudeDelta: 0.015,
        //         longitudeDelta: 0.0121
        //     }
        //     console.log(region);
        //     this.onRegionChange(region, region.latitude, region.longitude);
        // });
    }

    onRegionChange(region, lastLat, lastLong) {
        this.setState({
            mapRegion: region,
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
        });
    }

    componentWillUnmount() {
        // console.log('UNSAFE_componentWillUnmount');
        // navigator.geolocation.clearWatch(this.watchID);
    }

    onMapPress(e) {
        console.log(e.nativeEvent.coordinate.longitude);
        let region = {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
        }
        this.onRegionChange(region, region.latitude, region.longitude);
    }


    updateSearch = (search) => {
        console.log(search);
        this.setState({ search });
    };
    pressMark(e) {
        // alert(e);
        // console.log(e);
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
        console.log('render');
        console.log(this.state.mapRegion);
        return (
            <View style={styles.container}>
                <OwnSearchBar search={this.state.search} updateSearch={(v) => this.updateSearch(v)} />
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
                            this.state.markers.map((marker, i) => (
                                <MapView.Marker
                                    key={i}
                                    coordinate={marker.coordinates}
                                    title={marker.title}
                                />
                            ))
                        }
                        {/* <MapView.Marker coordinate={{
                            latitude: (this.state.lastLat) || -36.82339,
                            longitude: (this.state.lastLong) || -73.03569,
                        }}
                            onPress={(e) => this.pressMark(e)}
                            title="eeeeee"
                            pinColor="blue"
                            icon={
                                <Icon name="home" size={25} />
                            }>
                            <Text>heee</Text>
                        </MapView.Marker> */}
                    </MapView>
                </View>
            </View>

        )

    }
}