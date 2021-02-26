import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

import Index from './src/pages/Index';
import LoginPage from './src/pages/Login';
import SignupPage from './src/pages/Signup';

import SetupDetail from './src/pages/setup/SetupDetail';
import Identity from './src/pages/setup/Identity';
import IdCardScan from './src/pages/setup/IdCardScan';
import FaceScan from './src/pages/setup/FaceScan';
import PendingAccount from './src/pages/setup/PendingAccount';
import CustomCamera from './src/pages/setup/CustomCamera';

import Verify from './src/pages/Verify';

import Explore from './src/pages/home/Explore';
import Booking from './src/pages/home/Booking';
import Inbox from './src/pages/home/Inbox';
import Wallet from './src/pages/home/Wallet';
import Studio from './src/pages/home/Studio';

import Profile from './src/pages/profile/Profile';
import ProfileEdit from './src/pages/profile/ProfileEdit';
import ProfileAdd from './src/pages/profile/ProfileAdd';
import AllReview from './src/pages/profile/AllReview';

const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const BookingStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Tab = createBottomTabNavigator();

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(255, 45, 85)',
        background:'white'
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
            <RootStack.Screen name="SetupDetail" component={SetupDetail} options={{ headerShown: false }}/>
            <RootStack.Screen name="Identity" component={Identity} options={{ headerShown: false }}/>
            <RootStack.Screen name="IdCardScan" component={IdCardScan} options={{ headerShown: false }}/>
            <RootStack.Screen name="FaceScan" component={FaceScan} options={{ headerShown: false }}/>
            <RootStack.Screen name="PendingAccount" component={PendingAccount} options={{ headerShown: false }}/>
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

function getTabBarVisible(route) {
    const routeName = route.state
        ?  route.state.routes[route.state.index].name
        : route.params?.screen || 'Home';

    if (routeName === 'Search') {
        return false;
    }
    return true;
}
const HomeTabs = () => {
  return (
    <Tab.Navigator           
      tabBarOptions={{
        keyboardHidesTabBar:true,
        labelStyle: { fontSize: 12, marginTop:10 },
        tabStyle:{marginVertical:15},
        activeTintColor:'black',
        inactiveTintColor:'gray',
        style:{height:70}
      }}
    >
        <Tab.Screen name="Home"
                    component={HomeStacks}
                    options={({ route }) => ({
                        tabBarIcon: () => (
                            <FontAwesomeIcon name="home" color="#2f2f2f" size={25} />
                        ),
                        tabBarVisible: getTabBarVisible(route)
                    })} />
        <Tab.Screen name="Booking"
                    component={BookingStacks}
                    options={{
                        tabBarBadge: 1,
                        tabBarBadgeStyle:{top:-8},
                        tabBarIcon: () => (
                            <Icon name="calendar-blank" color="#2f2f2f" size={25} />
                        ),
                    }} />
        <Tab.Screen name="Inbox" component={Inbox}
                    options={{
                        tabBarIcon: () => (
                            <Icon name="comment-outline" color="#2f2f2f" size={25} />
                        ),
                    }} />

        <Tab.Screen name="Studio" component={Studio}
                    options={{
                        tabBarIcon: () => (
                            <Icon name="camera-outline" color="#2f2f2f" size={25} />
                        ),
                    }} />

        <Tab.Screen name="Profile" component={Profile}
                    options={{
                        tabBarIcon: () => (
                            <FontAwesomeIcon name="user-circle" color="black" size={25} />
                        ),
                    }} />
    </Tab.Navigator>
  )
}

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, [])
  return (
      <NavigationContainer theme={MyTheme}>
      <RootStack.Navigator>
        {/* <RootStack.Screen name="SignUpStacks" component={SignUpStacks} options={{ headerShown: false }} /> */}
        <RootStack.Screen name="Index" component={Index} options={{ headerShown: false }} />
        <RootStack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <RootStack.Screen name="Signup" component={SignupPage} options={{ headerShown: false }} />
          <RootStack.Screen name="Verify" component={Verify} options={{ headerShown: false }} />
        <RootStack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
        <RootStack.Screen name="SignUpStacks" component={SignUpStacks} options={{ headerShown: false }} />
        <RootStack.Screen name="Profile" component={Profile} options={{ headerShown: false }}  
    // options={{ 
    //                                                             headerBackTitleVisible:false,
    //                                                             headerTransparent:true,
    //                                                             headerTitle:'',
    //                                                             headerLeftContainerStyle:styles.backButton           
    //                                                             }}
                                                                    />
        <RootStack.Screen name="ProfileEdit" component={ProfileEdit} options={{ headerShown: false }} />
        <RootStack.Screen name="ProfileAdd" component={ProfileAdd} options={{ headerShown: false }} />
        <RootStack.Screen name="AllReview" component={AllReview} options={{ headerShown: false }}/>
        <RootStack.Screen name="CustomCamera" component={CustomCamera} options={{ headerShown: false }}/>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backButton:{
    backgroundColor:'red',
    position:'absolute',
    width:50,
    height:50,
    top:20,
    left:20,
    borderRadius:25,
    shadowColor: "#000000",
                    shadowOffset: {
                        width: 0,
                        height: 20,
                    },
                    shadowOpacity: 0.9,
                    shadowRadius: 8,
                    elevation: 1,
  }
});
