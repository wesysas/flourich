import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { Card, ListItem, Button, CheckBox, Overlay } from 'react-native-elements'

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';

import BackButton from '../../components/BackButton';

const IconText = ({ iconName, size, txt }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={iconName} size={size} />
            <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>{txt}</Text>
        </View>
    );
}

const NewTabCard = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card>
                <Icon name='heart' color='gray' size={25} style={styles.sideIcon} />
                <View style={styles.new}>
                    <Image
                        style={styles.newImage}
                        resizeMode="cover"
                        source={require('../../assets/img/test.jpg')}
                    />
                    <View style={styles.newSideTxt}>
                        <Text style={styles.title}>Karapincha</Text>
                        <IconText iconName="map-marker" size={15} txt="Location goes here" />
                        <Text style={styles.summaryTxt}>24 Dec | 14:00 - 20:00 | £ 200</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.title}>Graphics-Videos</Text>
                    <Text style={styles.desc}>
                        Details in brief input by user appears here for exmple
                        follows "Food & Interior photos for social media and print.
                        Photos should be edited before delivery"
                </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <CheckBox title='Accept' checked={true} />
                    <CheckBox title='Decline' checked={false} />
                    <CheckBox title='Postpone' checked={false} />
                </View>
            </Card>
        </TouchableOpacity>


    );
}

const InnerOverLay = () => {
    return (
        <View style={{
            alignItems: 'center',
        }}>
            <View style={{ flexDirection: 'row' }}>
                <Image
                    style={styles.newImage}
                    resizeMode="cover"
                    source={require('../../assets/img/test.jpg')}
                />
                <View style={styles.newSideTxt}>
                    <Text style={styles.title}>Karapincha</Text>
                    <IconText iconName="map-marker" size={15} txt="Location goes here" />
                    <Text style={styles.summaryTxt}>24 Dec | 14:00 - 20:00 | £ 200</Text>
                </View>
            </View>
            <View>
                <Text style={styles.title}>Graphics-Videos</Text>
                <Text style={{}}>
                    Details in brief input by user appears here for exmple
                    follows "Food & Interior photos for social media and print.
                    Photos should be edited before delivery"
                </Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                <Text style={[styles.title, { textAlign: 'center' }]}>Availability</Text>
                <Text style={[styles.title, { textAlign: 'center' }]}>from 12:00 to 24:00</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <CheckBox title='Accept' checked={true} />
                <CheckBox title='Decline' checked={false} />
                <CheckBox title='Postpone' checked={false} />
            </View>
        </View>
    )
}

const SavedTabCard = () => {
    return (
        <Card>
            <Icon name='heart' color='red' size={25} style={styles.sideIcon} />
            <View style={styles.new}>
                <Image
                    style={styles.newImage}
                    resizeMode="cover"
                    source={require('../../assets/img/test.jpg')}
                />
                <View style={styles.newSideTxt}>
                    <Text style={styles.title}>Karapincha</Text>
                    <IconText iconName="map-marker" size={15} txt="Location goes here" />
                    <Text style={styles.summaryTxt}>24 Dec | 14:00 - 20:00 | £ 200</Text>
                </View>
            </View>
            <View>
                <Text style={styles.title}>Graphics-Videos</Text>
                <Text style={styles.desc}>
                    Details in brief input by user appears here for exmple
                    follows "Food & Interior photos for social media and print.
                    Photos should be edited before delivery"
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <CheckBox title='Accept' checked={true} />
                <CheckBox title='Decline' checked={false} />
                <CheckBox title='Postpone' checked={false} />
            </View>
        </Card>
    );
}

const PastTabCard = () => {
    return (
        <Card>
            <View style={[styles.new, { justifyContent: 'space-between' }]}>

                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ position: 'absolute', right: 3, top: 10 }}>completed</Text>
                    <Text style={styles.title}>Karapincha</Text>
                    <IconText iconName="map-marker" size={15} txt="Location goes here" />
                    <Text style={styles.summaryTxt}>24 Dec | 14:00 - 20:00 | £ 200</Text>
                </View>
                <Image
                    style={{ width: 80, height: 80, borderRadius: 5 }}
                    resizeMode="cover"
                    source={require('../../assets/img/test.jpg')}
                />
            </View>
        </Card>
    );
}
export default class Booking extends Component {

    constructor(props) {
        super(props);
        // this.init();
        this.state = {
            visible: false,
            approved: false
        }
    }


    async retrieveData() {
        try {
            const user = await AsyncStorage.getItem('@user')
            if (user) {
                this.setState({ approved: JSON.parse(user).approved })

            }
        } catch (e) {
            console.log(e);
            alert('Failed to load value.')
        }
    }

    UNSAFE_componentWillMount() {

        this.retrieveData();
    }

    init() {
        // alert('here');
    }

    toggleOverlay() {
        // alert('ee');
        this.setState({ visible: !this.state.visible });
        console.log(this.state.visible);
    }

    _approved() {
        if (this.state.approved) {
            return (
                <Text>Approved</Text>
            )
        } else {
            return (
                <Text style={styles.alertMsg}>Un Approved</Text>
            )
        }

    }

    render() {
        return (
            <View style={{
                flex: 1,
                // marginTop: 10
            }}>
                <BackButton navigation={this.props.navigation} />
                
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: 50 }}>Booking</Text>
                {this._approved()}
                <ScrollableTabView
                    style={styles.container}
                    renderTabBar={() =>
                        <DefaultTabBar
                            backgroundColor='rgba(255, 255, 255, 0.7)'
                        // tabStyle={{ width: 100 }}
                        />}
                    tabBarPosition='overlayTop'
                >
                    <ScrollView tabLabel='New' style={styles.innerTab}>
                        <NewTabCard key={0} onPress={() => this.toggleOverlay()} />
                        <NewTabCard key={1} onPress={() => this.toggleOverlay()} />

                        <Overlay isVisible={this.state.visible} onBackdropPress={() => this.toggleOverlay()}
                            overlayStyle={{ margin: 30 }}>
                            <InnerOverLay />
                        </Overlay>
                    </ScrollView>
                    <ScrollView tabLabel='Saved' style={styles.innerTab}>
                        <SavedTabCard />
                        <SavedTabCard />
                        <SavedTabCard />
                    </ScrollView>
                    <ScrollView tabLabel='Past' style={styles.innerTab}>
                        <PastTabCard />
                        <PastTabCard />
                        <PastTabCard />
                        <PastTabCard />
                        <PastTabCard />
                        <PastTabCard />
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
        marginVertical: 50,
        marginHorizontal: 20
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