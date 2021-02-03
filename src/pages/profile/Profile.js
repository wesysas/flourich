import React, { useState, Dimentiions, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button, Input, CheckBox, Avatar, ListItem, BottomSheet } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import { Col, Row, Grid } from 'react-native-easy-grid';

import ReviewItem from '../../components/ReviewItem';
import BackButton from '../../components/BackButton';
import ProfileAvatar from '../../components/ProfileAvatar';

import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        // flexGrow: 1,
        // paddingHorizontal: 30,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black'
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'gray',
        marginVertical: 10
    },
    separate: {
        marginVertical: 20
    },
    btnStyle: {
        width: 90,
        borderRadius: 50,
        borderColor: 'gray',
        margin: 10
    },
    mozaicImg: {
        borderRadius: 10,
        width: 100,
        height: 100,
        aspectRatio: 1,
        alignSelf: 'center',
        resizeMode: 'contain',
        margin: 5
    },
    mozaicImgLarge: {
        borderRadius: 10,
        width: 220,
        height: 210,
        alignSelf: 'center',
    },
    bottomSheetItem: {
        // backgroundColor:'transparent',
    },

});
const _renderCarouselItem = ({ item, index }) => {
    return (
        <View>
            <Avatar
                rounded
                size="large"
                containerStyle={{
                    borderColor: 'red',
                    borderWidth: 2,
                    padding: 5,
                    borderStyle: 'dotted'
                }}
                source={require('../../assets/img/test.jpg')}
            />
            {/* <Text style={{fontSize: 30}}>{item.title}</Text> */}
            {/* <Text>{item.text}</Text> */}
        </View>
    );
}

const Profile = ({ navigation }) => {

    const [currentUser, setCurrentUser] = useState(null)
    
    const [selectedValue, setSelectedValue] = useState("private_company");
    const [value1, onChangeText1] = useState('100');
    const [value2, onChangeText2] = useState('500');

    const [activIndex, setActiveIndex] = useState(3);
    const [carouselItems, setCarouselItems] = useState(
        [
            {
                title: "Item 1",
                text: "Text 1",
            },
            {
                title: "Item 2",
                text: "Text 2",
            },
            {
                title: "Item 3",
                text: "Text 3",
            },
            {
                title: "Item 4",
                text: "Text 4",
            },
            {
                title: "Item 5",
                text: "Text 5",
            },
        ])

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        retrieveData();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            // retrieveData();
            console.log('profile page')
        }, [])
    );

    const retrieveData = async () => {
        try {
            const user = await AsyncStorage.getItem('@user')
            if (user) {
                // console.log(user);
                setCurrentUser(user);
            }
        } catch (e) {
            console.log(e);
            alert('Failed to load name.')
        }
    }

    const save = async (key, data) => {
        try {
          await AsyncStorage.setItem(key, data)
          console.log('Data successfully saved!')
        } catch (e) {
            console.log(e);
          alert('Failed to save name.')
        }
      }

    const bottomSheetList = [
        {
            title: 'Create New',
            containerStyle: {
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
            }
        },
        {
            title: 'Portfolio Post',
            titleStyle: { fontWeight: 'bold' },
            onPress: () => goPortfolioPost()
        },
        {
            title: 'Story',
            titleStyle: { fontWeight: 'bold' },
            onPress: () => goStory()
        },
        {
            title: 'Story Highlight',
            titleStyle: { fontWeight: 'bold' },
            onPress: () => goStoryHilight()
        },
    ];

    const goPortfolioPost = () => {
        RBSheetR.close()
        navigation.navigate('ProfileAdd');
    }

    const goStory = () => {
        alert('goStory');
    }
    
    const logout = () => {
        // save('@token', '');
        // save('@user', '');
        navigation.navigate('Index');
    }
    

    var RBSheetR = null;

    const goStoryHilight = () => {
        alert('goStoryHilight');
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{
                alignItems: 'stretch'
            }}>
                <BackButton navigation={navigation} />
                <Image style={styles.image} source={require('../../assets/img/profile_logo.jpg')} />
                <ProfileAvatar />
            </View>
            <View style={{
                marginVertical: 30,
                marginHorizontal: 20
            }}>
                <Text style={styles.headerTitle}>Argin Rgn production</Text>
                <Text >Hackeny, London</Text>
                <Text >£ 100-500</Text>
                <Text >Food, Fashion, Events</Text>
                <Text >http://www.freelancerwebste.com</Text>

                {/* summary header */}

                <View style={[styles.separate, { flexDirection: 'row', justifyContent: 'space-around' }]}>
                    <TouchableOpacity onPress={() => { navigation.navigate('ProfileEdit') }}>
                        <Text style={{ fontSize: 20 }} >Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => RBSheetR.open()}>
                        <Text style={{ fontSize: 20 }}>Create New</Text>
                    </TouchableOpacity>
                </View>

                {/* carousel part */}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                    <Carousel
                        layout={"default"}
                        //   ref={ref => this.carousel = ref}
                        data={carouselItems}
                        sliderWidth={300}
                        itemWidth={100}
                        renderItem={_renderCarouselItem}
                        firstItem={1}
                        onSnapToItem={index => setActiveIndex({ index })} />
                </View>

                {/* image mozaic part */}
                <View style={{
                    marginTop: 30
                }}>
                    <Grid>
                        <Row>
                            <Col>
                                <Image style={styles.mozaicImg} source={require('../../assets/img/test.jpg')} />
                            </Col>
                            <Col>
                                <Image style={styles.mozaicImg} source={require('../../assets/img/test.jpg')} />
                            </Col>
                            <Col>
                                <Image style={styles.mozaicImg} source={require('../../assets/img/test.jpg')} />
                            </Col>
                        </Row>
                        <Row style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Col size={1} >

                                <Image style={styles.mozaicImg} source={require('../../assets/img/test.jpg')} />
                                <Image style={styles.mozaicImg} source={require('../../assets/img/test.jpg')} />

                            </Col>
                            <Col size={2}>
                                <Image style={styles.mozaicImgLarge} source={require('../../assets/img/test.jpg')} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Image style={styles.mozaicImg} source={require('../../assets/img/test.jpg')} />
                            </Col>
                            <Col>
                                <Image style={styles.mozaicImg} source={require('../../assets/img/test.jpg')} />
                            </Col>
                            <Col>
                                <Image style={styles.mozaicImg} source={require('../../assets/img/test.jpg')} />
                            </Col>
                        </Row>
                    </Grid>

                </View>

                <View style={[styles.separate, {
                    flexDirection: 'row',
                    alignItems: 'center',

                }]}

                >
                    <Icon name="star" color="green" size={25} />
                    <Text style={{ fontSize: 20 }}>4.5 (123)</Text>
                </View>

                <View>
                    <ReviewItem />
                </View>
                <Button
                    type="clear"

                    titleStyle={{ textDecorationLine: 'underline' }}

                    title="see all reviews"
                    onPress={() => navigation.navigate('AllReview')}
                />

            </View>
            <RBSheet
                ref={ref => {
                    RBSheetR = ref;
                }}
                openDuration={250}
                customStyles={{
                    container: {
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20
                    }
                }}
            >
                {bottomSheetList.map((l, i) => (
                    <ListItem key={i} containerStyle={[styles.bottomSheetItem, l.containerStyle]} onPress={l.onPress}>
                        <ListItem.Content style={{ alignItems: 'center' }}>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </RBSheet>




        </ScrollView>
    )

}

export default Profile;