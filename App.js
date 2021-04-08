import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { StyleSheet, Text, View, Platform, Image, TouchableOpacity } from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import SocketIOClient from 'socket.io-client';

import Index from './src/pages/Index';
import LoginPage from './src/pages/Login';
import SignupPage from './src/pages/Signup';
import ForgotPassword from './src/pages/ForgotPassword';

import Payment from './src/pages/setup/Payment';
import BankDetail from './src/pages/setup/BankDetail';
import SetupDetail from './src/pages/setup/SetupDetail';
import Identity from './src/pages/setup/Identity';
import FaceScan from './src/pages/setup/FaceScan';
import PendingAccount from './src/pages/setup/PendingAccount';
import CustomCamera from './src/pages/setup/CustomCamera';

import Verify from './src/pages/Verify';
import Explore from './src/pages/home/Explore';
import Booking from './src/pages/home/Booking';
import Inbox from './src/pages/home/Inbox';
import ChatBox from './src/pages/home/ChatBox';
import Studio from './src/pages/home/Studio';

import Profile from './src/pages/profile/Profile';
import ProfileEdit from './src/pages/profile/ProfileEdit';
import AllReview from './src/pages/profile/AllReview';
import Wallet from './src/pages/profile/Wallet';
import Report from './src/pages/profile/Report';
//session
import Start from "./src/pages/Session/Start";
import Complete from "./src/pages/Session/Complete";
import Progress from "./src/pages/Session/Progress";

import { SERVER_URL } from './src/globalconfig';
import { getUserId } from './src/shared/service/storage';
import { getNewBookings, unreadMessage } from './src/shared/service/api'
import { ifIphoneX } from 'react-native-iphone-x-helper';

const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const BookingStack = createStackNavigator();
const InboxStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Tab = createBottomTabNavigator();

global.socket = SocketIOClient(SERVER_URL);

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(255, 45, 85)',
        background: 'white'
    },
};
const tabSize = 30;
const HomeStacks = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Explore" component={Explore} options={{ headerShown: false }} />
        </HomeStack.Navigator>
    )
};
const SignUpStacks = () => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen name="SetupDetail" component={SetupDetail} options={{ headerShown: false }} />
            <RootStack.Screen name="Identity" component={Identity} options={{ headerShown: false }} />
            <RootStack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
            <RootStack.Screen name="BankDetail" component={BankDetail} options={{ headerShown: false }} />
            <RootStack.Screen name="PendingAccount" component={PendingAccount} options={{ headerShown: false }} />

            <RootStack.Screen name="FaceScan" component={FaceScan} options={{ headerShown: false }} />
        </RootStack.Navigator>
    )
};
const BookingStacks = () => {
    return (
        <BookingStack.Navigator>
            <BookingStack.Screen name="Bookings" component={Booking} options={{ headerShown: false }} />
        </BookingStack.Navigator>
    )
};
const InboxStacks = () => {
    return (
        <InboxStack.Navigator>
            <InboxStack.Screen name="Inbox" component={Inbox} options={{ headerShown: false }} />
            <InboxStack.Screen name="ChatBox" component={ChatBox} options={{ headerShown: false }} />
        </InboxStack.Navigator>
    )
};
const ProfileStacks = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <ProfileStack.Screen name="ProfileEdit" component={ProfileEdit} options={{ headerShown: false }} />
            <ProfileStack.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
            <ProfileStack.Screen name="Report" component={Report} options={{ headerShown: false }} />
        </ProfileStack.Navigator>
    )
};

function getTabBarVisible(route) {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ['Home'];
    if (hideOnScreens.indexOf(routeName) > -1) return false;
    return true;
}

const HomeTabs = () => {

    var [badgeNum, setBadgeNum] = useState(0);
    var [message, setMessage] = useState(0);

    useEffect( () => {

        async function fetchData() {
            var userid = await getUserId();
            var result = await getNewBookings({userid:userid});
            console.log(result);
            if(result) {
                console.log(result);
                setBadgeNum(result.count);
            }
            var unread = await unreadMessage({cid:userid});
            console.log(unread);
            if(unread) {
                setMessage(unread.unread);
            }
          }
          fetchData();

    }, [])



    global.socket.on('new-bookings', async (mes) => {
        var userid = await getUserId();
        if(userid == mes.creator_id){
            badgeNum++;
        }
        setBadgeNum(badgeNum)
    });

    global.socket.on('new-message', async (mes) => {
       console.log('----------new message on creator--------', mes);
        if(mes.to == 'creator'+global.user.cid){
            message++;
            setMessage(message);
        }
    });

    // const {routeName} = navigation.state;
    // console.log(routerName);

    return (
        <Tab.Navigator
            tabBarOptions={{
                keyboardHidesTabBar: true,
                labelStyle: { fontSize: 12 },
                tabStyle: { marginVertical: 15 },
                activeTintColor: 'black',
                inactiveTintColor: 'gray',
                style: { height: 100 }
            }}
        >
            <Tab.Screen name="Home"
                component={HomeStacks}
                options={({ route }) => ({
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon name="home" color={color} size={25} />
                    ),
                    tabBarVisible: getTabBarVisible(route)
                })} />
            <Tab.Screen name="Bookings"
                component={BookingStacks}
                options={({ navigation }) => (
                    navigation.isFocused()?setBadgeNum(0):null,
                    {
                    tabBarBadge: badgeNum > 0 ? badgeNum : null,
                    
                    tabBarIcon: ({ color }) => (
                        <Icon name="calendar-blank" color={color} size={25} />
                    ),
                })} />
            <Tab.Screen name="Inbox" component={InboxStacks}
                options={({ navigation }) => (
                    navigation.isFocused()?setMessage(0):null,
                    {
                    tabBarBadge: message > 0 ? message : null,
                    
                    tabBarIcon: ({ color }) => (
                        <Icon name="comment-outline" color={color} size={25} />
                    ),
                })} />

            <Tab.Screen name="Studio" component={Studio}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="camera-outline" color={color} size={25} />
                    ),
                }} />

            <Tab.Screen name="Profile" component={ProfileStacks}
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon name="user-circle" color={color} size={25} />
                    ),
                }} />
        </Tab.Navigator>
    )
};

export default function App() {
    useEffect(() => {
        SplashScreen.hide();
    }, [])


    return (
        <NavigationContainer theme={MyTheme}>
            <RootStack.Navigator>
                <RootStack.Screen name="Index" component={Index} options={{ headerShown: false }} />
                <RootStack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
                <RootStack.Screen name="Signup" component={SignupPage} options={{ headerShown: false }} />
                <RootStack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                <RootStack.Screen name="Verify" component={Verify} options={{ headerShown: false }} />
                <RootStack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
                <RootStack.Screen name="SignUpStacks" component={SignUpStacks} options={{ headerShown: false }} />
                <RootStack.Screen name="AllReview" component={AllReview} options={{ headerShown: false }} />

                <RootStack.Screen name="CustomCamera" component={CustomCamera} options={{ headerShown: false }} />
                <RootStack.Screen name="ChatBox" component={ChatBox} options={{ headerShown: false }} />
                <RootStack.Screen name="Start" component={Start} options={{ headerShown: false }} />
                <RootStack.Screen name="Complete" component={Complete} options={{ headerShown: false }} />
                <RootStack.Screen name="Progress" component={Progress} options={{ headerShown: false }} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}