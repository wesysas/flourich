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
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text';

import { useForm, Controller } from 'react-hook-form';

import { CustomInput, CustomMaskInput, CustomPhoneMaskInput } from '../../components/CustomInputs';

import RBSheet from 'react-native-raw-bottom-sheet';

import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';

// const CusInput = (props) => {
//     return (
//       <View style={styles.wrapper}>
//         <TextInput
//           style={[styles.input, props.error && {color:'red'}, props.style]}
//           {...props}
//         />
//         {props.errorText && (
//           <Text style={styles.errorText}>{props.errorText}</Text>
//         )}
//       </View>
//     );
//   }


const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
        marginHorizontal: 20
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
    }

});

const ProfileEdit = ({ navigation }) => {
    const [currentUser, setCurrentUser] = useState();
    const [min_price, onChangeMinPrice] = useState('100');
    const [max_price, onChangeMaxPrice] = useState('500');
    const [birthday, onChangeBirthday] = useState();
    // const onSubmit = data =>{
    //     console.log(data);
    // }
    const { control, handleSubmit, errors } = useForm();

    const [allValues, setAllValues] = useState({
        mobile: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const changeHandler = e => {
        console.log(e);
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    }
    //  return (
    //     <input type="text"
    //         className="form-control"
    //         id="mobile"
    //         name="mobile"
    //         placeholder="Enter a valid mobile number"
    //         onChange={changeHandler}
    //     />
    //     // ...
    //  )



    const onSubmit = data => {
        console.log('err',errors);
        console.log('data', data);
    }

    useEffect(() => {
        retrieveUserData();
        // register("firstName");
        // register("lastName");
    }, [])

    const retrieveUserData = async () => {
        try {
            const user = await AsyncStorage.getItem('@user');
            if (user) {
                setCurrentUser(user);
            }
        } catch (e) {
            console.log(e);
            alert('Failed to load name.')
        }
    }

    

    const save = () => {
        console.log(min_price, max_price, birthday);
        console.log(datetimeField.isValid());
    }
    var datetimeField;

    const errorStyle = () => {
        

            return {
                borderBottomColor: 'red'
            }
    }

    return (
        <ScrollView contentContainerStyle={{}}>
            <View style={{ alignItems: 'stretch' }}>
                <BackButton navigation={navigation} />
                <Image style={styles.image} source={require('../../assets/img/profile_logo.jpg')} />
                <ProfileAvatar />
            </View>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Edit My Profile</Text>              

                <Collapse style={{ marginVertical: 10 }}>
                    <CollapseHeader>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: 'lightgray', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18 }}>Profile Setting</Text>
                            <Icon name="user-circle" size={18} />
                        </View>
                    </CollapseHeader>
                    <CollapseBody style={{ margin: 10 }}>
                        <Text>First Name</Text>
                        <CustomInput _filedName="first_name" _control={control} _errors={errors} _placeholder="Leteechia" _defaultValue=""/>

                        <Text>Last Name</Text>
                        <CustomInput _filedName="last_name" _control={control} _errors={errors} _placeholder="Rungasamy" _defaultValue=""/>

                        <Text>Birth Date</Text>
                        <CustomMaskInput _filedName="birth_date" _control={control} _errors={errors} _placeholder="DD/MM/YY" _defaultValue=""/>

                        <Text>Phone Number</Text>
                        <View style={{ marginTop:-10,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{fontSize:12}}>For notifications, reminders and help logging in</Text>
                            <Button
                                type="clear"
                                title="add"
                                titleStyle={{ textDecorationLine: 'underline' }}
                            />
                        </View>
                        <CustomPhoneMaskInput _filedName="phone_number" _control={control} _errors={errors} _placeholder="(99) 99999-9999" _defaultValue=""/>

                        <Text>Industry/Services</Text>
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            padding: 10
                        }}>

                            <Button
                                buttonStyle={styles.btnStyle}
                                titleStyle={{
                                    color: 'gray'
                                }}
                                title="Photos"
                                type='outline'
                            />

                            <Button
                                buttonStyle={styles.btnStyle}
                                titleStyle={{
                                    color: 'gray'
                                }}
                                title="Videos"
                                type='outline'
                            />

                            <Button
                                buttonStyle={styles.btnStyle}
                                titleStyle={{
                                    color: 'gray'
                                }}
                                title="Graphics"
                                type='outline'
                            />

                            <Button
                                buttonStyle={styles.btnStyle}
                                titleStyle={{
                                    color: 'gray'
                                }}
                                title="Editor"
                                type='outline'
                            />

                            <Button
                                buttonStyle={styles.btnStyle}
                                titleStyle={{
                                    color: 'gray'
                                }}
                                title="UGC"
                                type='outline'
                            />

                        </View>

                        <Text>Price Range</Text>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            paddingHorizontal: 20
                        }}>
                            <Text>form</Text>
                            <View>
                                <Text style={{
                                    position: 'absolute',
                                    left: 3,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    zIndex: 1,
                                    top: 7
                                }}>£</Text>
                                <TextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        paddingLeft: 20,
                                    }}
                                    onChangeText={text => onChangeMinPrice(text)}
                                    value={min_price}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            <Text>to</Text>
                            <View>
                                <Text style={{
                                    position: 'absolute',
                                    left: 3,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    zIndex: 1,
                                    top: 7
                                }}>£</Text>
                                <TextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        paddingLeft: 20,
                                        backgroundColor: 'black',
                                        color: "white"
                                    }}
                                    onChangeText={text => onChangeMaxPrice(text)}
                                    value={max_price}
                                    keyboardType={'numeric'}
                                />
                            </View>

                        </View>

                        <Text>Website</Text>
                        <Input placeholder='www.flourich.co.uk' />

                        <Text>Instagram URL</Text>
                        <Input placeholder='Instagram Link goes here' />

                        <Text>Linked in (optional)</Text>
                        <Input placeholder='Link to linked in profile goes here' />

                        <Text>Behance (optional)</Text>
                        <Input placeholder='Link to behance profile goes here' />
                    </CollapseBody>
                </Collapse>
                <Collapse style={{ marginVertical: 10 }}>
                    <CollapseHeader>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: 'lightgray', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18 }}>Address</Text>
                            <Icon name="map-marker" size={18} />
                        </View>
                    </CollapseHeader>
                    <CollapseBody style={{ margin: 10 }}>
                        <Text>Full Address</Text>
                        <Input placeholder='Full address displays here' />
                        <Text>Business or Building Name</Text>
                        <Input placeholder='Business or building name goes here' />
                        <Text>Street Address</Text>
                        <Input placeholder='street address goes here' />
                        <Text>Post Code</Text>
                        <Input placeholder='123456789UK' />
                        <Text>Business Name</Text>
                        <Input placeholder='Flourich Marketing Ltd' />
                    </CollapseBody>
                </Collapse>

                <View style={styles.separate}>
                    <Text style={styles.headerTitle}>SUPPORT</Text>
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title>How Flourich Works</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title>Safety Center</ListItem.Title>
                            <ListItem.Subtitle>
                                Get support tools and information you need to be safe
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title>Get Help/Support</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                </View>

                <View style={styles.separate}>
                    <Text style={styles.headerTitle}>LEGAL</Text>
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title>Terms of Service</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                </View>

                <Button
                    buttonStyle={{ marginVertical: 20, borderRadius: 8 }}
                    ViewComponent={LinearGradient}
                    titleStyle={styles.btnTitle}
                    linearGradientProps={{
                        colors: ["#c84e77", "#f13e3a"],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    title="Save"
                    onPress={handleSubmit(onSubmit)}
                />

                <Text style={{ alignSelf: 'center' }}>Flourich Version 3.0 (01012021)</Text>

            </View>



        </ScrollView>
    )

}

export default ProfileEdit;