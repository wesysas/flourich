import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

import { Card, ListItem, Button, CheckBox, Avatar } from 'react-native-elements'

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import BackButton from '../../components/BackButton';

const AssetFolder = ({ iconSize }) => {
    return (
        <View>
            <TouchableOpacity >
                <Icon name="folder" size={iconSize} color="#011f6f"/>
                <Icon name="check-circle" size={25} color="green" style={{ position: 'absolute', top: 17, left: 8 }} />
                <Text style={{ alignSelf: 'center', bottom: 0, position: 'absolute' }}>Asset Name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: 'center', borderRadius: 15, padding: 2, width: 30, height: 30, alignItems: 'center', borderWidth: 1, borderColor: 'gray' }}>
                <EntypoIcon name="dots-three-vertical" size={24} />
            </TouchableOpacity>
        </View>
    )
}

export default class Studio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iconSize: null
        }
    }
    UNSAFE_componentWillMount() {
        var _height = Dimensions.get('window').height;
        var _width = Dimensions.get('window').width;
        if (_width > _height) {
            this.setState({ iconSize: Math.round(_height / 3 - 15) })
        } else {
            this.setState({ iconSize: Math.round(_width / 3 - 15) })
        }
    }

    init() {

    }

    render() {
        // var iconsize = this.state.width;
        // console.log(iconsize);
        return (
            <View  style={{
                flex: 1,
            }}>
                <BackButton navigation={this.props.navigation} />
                <View style={{ flex: 1, marginTop: 40 }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>Studio</Text>
                    <ScrollableTabView
                        style={styles.container}
                        renderTabBar={() =>
                            <DefaultTabBar
                                backgroundColor='rgba(255, 255, 255, 0.7)'
                            // tabStyle={{ width: 100 }}
                            />}
                        tabBarPosition='overlayTop'
                    >
                        <ScrollView tabLabel='Image files' style={styles.innerTab}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch' }}>

                                <AssetFolder iconSize={this.state.iconSize} />
                                <AssetFolder iconSize={this.state.iconSize} />
                                <AssetFolder iconSize={this.state.iconSize} />
                                <AssetFolder iconSize={this.state.iconSize} />
                                <AssetFolder iconSize={this.state.iconSize} />
                                <AssetFolder iconSize={this.state.iconSize} />
                                <AssetFolder iconSize={this.state.iconSize} />
                            </View>
                        </ScrollView>
                        <ScrollView tabLabel='Video files' style={styles.innerTab}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch' }}>

                                <AssetFolder iconSize={this.state.iconSize} />
                                <AssetFolder iconSize={this.state.iconSize} />
                                <AssetFolder iconSize={this.state.iconSize} />
                                <AssetFolder iconSize={this.state.iconSize} />
                            </View>
                        </ScrollView>
                    </ScrollableTabView>
                </View>

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