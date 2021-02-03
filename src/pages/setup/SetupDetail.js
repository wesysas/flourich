import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, LogBox } from 'react-native';

import { Button, Input, CheckBox } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import {Picker} from '@react-native-picker/picker';
import { SelectMultipleButton, SelectMultipleGroupButton } from "react-native-selectmultiple-button";
import _ from "lodash";
import ValidationComponent from 'react-native-form-validator';
import { max } from 'react-native-reanimated';
import GlobalStyles from '../../GlobalStyles';
import { createProfile } from '../../shared/service/api';
import { getStorage } from '../../shared/service/storage';
const ios_blue = "#007AFF";

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 30,
    },
    headerTitle: {
        fontSize: 30,
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
    }
});

const services = ["Photos", "Videos", "Graphics", "Editor", "UGC"];
const operate_type = ["sole_trader", "private_company"];
export default class SetupDetail extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            operate_type:operate_type[0],
            firstname: "", 
            lastname: "", 
            businessname: "",
            minprice: '100',
            maxprice: '500',
            building:"",
            fulladdress:'',
            street: "",
            postalcode: "",
            weburl:"",
            instagramurl:"",
            linkedin:"",
            behance:"",
            services: [],
        }
    }
    componentDidMount() {
        LogBox.ignoreLogs(['Warning: `componentWillReceiveProps`']);
    }
    _singleTapMultipleSelectedButtons = (interest) =>{
        var services = this.state.services;
        if (services.includes(interest)) {
          _.remove(services, ele => {
            return ele === interest;
          });
        } else {
            services.push(interest);
        }
        this.setState({
            services: this.state.services
          });
      }
     _renderBusiness = () => {
        if(this.state.operate_type === operate_type[1]) {
            return (
                <View>
                    <Text>Business Name</Text>
                    <Input 
                        placeholder='Flourich Marketing Ltd'
                        onChangeText={value => {
                            this.setState({"businessname":value})
                        }}
                    />
                </View>
            );
        }else{
            return null;
        }
    };

    _validate = async() => {
        this.props.navigation.navigate('Identity');
        const { type } = this.state;
        if(type === operate_type[1]){
            var validate = this.validate({
                firstname: { required: true },
                lastname: { required: true },
                businessname: { required: true },
                minprice: { required: true },
                maxprice: { required: true },
                building: { required: true },
                fulladdress: { required: true },
                street: { required: true },
                postalcode: { required: true },
                weburl: { required: true },
                instagramurl: { required: true },
                services: { required: true },
            });
        }else{
            var validate = this.validate({
                firstname: { required: true },
                lastname: { required: true },
                minprice: { required: true },
                maxprice: { required: true },
                building: { required: true },
                fulladdress: { required: true },
                street: { required: true },
                postalcode: { required: true },
                weburl: { required: true },
                instagramurl: { required: true },
                services: { required: true },
            });
        }
        
        if(validate) {
            var currentuser = await getStorage('@user');
            var user = JSON.parse(currentuser);
            var userid = user.cid;
            this.setState({'userid': userid});
            var res = await createProfile(this.state);
            console.log(res);
            if(res != null) {
                this.props.navigation.navigate('Identity');
            }
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
            <View style={{
                marginVertical: 30
            }}>
                <Text style={styles.headerTitle}>Continue Set Up</Text>
                <View style={styles.separate}>
                    <Text>You operate as</Text>
                    <Picker
                        selectedValue={this.state.operate_type}
                        style={{ textAlign: 'right' }}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({"operate_type":itemValue})
                        }}
                    >
                        <Picker.Item label="SOLE TRADER" value={operate_type[0]} />
                        <Picker.Item label="PRIVATE COMP" value={operate_type[1]} />
                    </Picker>

                </View>
                <View style={styles.separate}>
                    <Text style={styles.subTitle}>Add you name*</Text>
                    <Text>First Name</Text>
                    <Input 
                        placeholder='Leteechia'
                        value={this.state.firstname}
                        onChangeText={value => {
                            this.setState({"firstname":value})
                        }}
                    />
                    {this.isFieldInError('firstname') && this.getErrorsInField('firstname').map(errorMessage => <Text key="firstname" style={{ color:'red',marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                    <Text>Last Name</Text>
                    <Input 
                        placeholder='Rungasamy' 
                        onChangeText={value => {
                            this.setState({"lastname":value})
                        }}
                    />
                    {this.isFieldInError('lastname') && this.getErrorsInField('lastname').map(errorMessage => <Text key="lastname" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                    { this._renderBusiness()}

                    <Text>Industry/Services</Text>
                    <View
                        style={{
                            flex: 3,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            padding: 10
                        }}
                        >
                        {services.map(interest => (
                            <SelectMultipleButton
                            key={interest}
                            buttonViewStyle={styles.btnStyle}
                            textStyle={{
                                fontSize: 16
                            }}
                            highLightStyle={{
                                borderColor: "gray",
                                backgroundColor: "transparent",
                                textColor: "gray",
                                borderTintColor: ios_blue,
                                backgroundTintColor: ios_blue,
                                textTintColor: "white"
                            }}
                            value={interest}
                            selected={this.state.services.includes(interest)}
                            singleTap={valueTap =>
                                this._singleTapMultipleSelectedButtons(interest)
                            }
                            />
                        ))}
                    </View>
                    {this.isFieldInError('services') && this.getErrorsInField('services').map(errorMessage => <Text key="services" style={{ color:'red', marginTop: -15, marginLeft: 25}}>{errorMessage}</Text>) }

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
                                left:3,
                                fontSize:18,
                                fontWeight:'bold',
                                zIndex:1,
                                top:7
                            }}>£</Text>
                            <TextInput
                                style={{ height: 40,
                                     borderColor: 'gray', 
                                     borderWidth: 1, 
                                     borderRadius: 5, 
                                     paddingLeft:20,
                                     }}
                                onChangeText={value => {
                                    var minprice = value.replace(/[^0-9]/g, '');
                                    this.setState({"minprice":minprice})
                                }}
                                value={ this.state.minprice }
                                keyboardType={'numeric'}
                            />
                        </View>
                        <Text>to</Text>
                        <View>
                            <Text style={{
                                position: 'absolute',
                                left:3,
                                fontSize:18,
                                fontWeight:'bold',
                                color:'white',
                                zIndex:1,
                                top:7
                            }}>£</Text>
                            <TextInput
                                style={{ height: 40,
                                     borderColor: 'gray', 
                                     borderWidth: 1, 
                                     borderRadius: 5, 
                                     paddingLeft:20,
                                     backgroundColor: 'black',
                                      color: "white" }}
                                onChangeText={ value => {
                                    var maxprice = value.replace(/[^0-9]/g, '');
                                    this.setState({"maxprice":maxprice})
                                }}
                                value={ this.state.maxprice }
                                keyboardType={'numeric'}
                            />
                        </View>
                    </View>
                    {this.isFieldInError('minprice') && this.getErrorsInField('minprice').map(errorMessage => <Text key="minprice" style={{ color:'red', marginLeft: 10}}>{errorMessage}</Text>) }
                    {this.isFieldInError('maxprice') && this.getErrorsInField('maxprice').map(errorMessage => <Text key="maxprice" style={{ color:'red', marginLeft: 10}}>{errorMessage}</Text>) }

                </View>

                <View style={styles.separate}>
                    <Text style={styles.subTitle}>Add your Address*</Text>
                    <Text>Full Address</Text>
                    <Input placeholder='Full address displays here' 
                        value={this.state.fulladdress}
                        onChangeText={ value => {
                            this.setState({"fulladdress":value})
                        }}
                    />
                    {this.isFieldInError('fulladdress') && this.getErrorsInField('fulladdress').map(errorMessage => <Text key="fulladdress" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                    <Text>Business or Building Name</Text>
                    <Input placeholder='Business or building name goes here' 
                        value={this.state.building}
                        onChangeText={ value => {
                            this.setState({"building":value})
                        }}
                    />
                    {this.isFieldInError('building') && this.getErrorsInField('building').map(errorMessage => <Text key="building" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                    <Text>Street Address</Text>
                    <Input placeholder='street address goes here'
                        value={this.state.street}
                        onChangeText={ value => {
                            this.setState({"street":value})
                        }}
                    />
                    {this.isFieldInError('street') && this.getErrorsInField('street').map(errorMessage => <Text key="street" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                    <Text>Post Code</Text>
                    <Input placeholder='123456789UK' 
                        value={this.state.postalcode}
                        onChangeText={ value => {
                            this.setState({"postalcode":value})
                        }}
                    />
                    {this.isFieldInError('postalcode') && this.getErrorsInField('postalcode').map(errorMessage => <Text key="postalcode" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                </View>

                <View style={styles.separate}>
                    <Text>Website</Text>
                    <Input placeholder='www.flourich.co.uk' 
                        value={this.state.weburl}
                        onChangeText={ value => {
                            this.setState({"weburl":value})
                        }}
                    />
                    {this.isFieldInError('weburl') && this.getErrorsInField('weburl').map(errorMessage => <Text key="weburl" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                    <Text>Instagram URL</Text>
                    <Input placeholder='Instagram Link goes here' 
                        value={this.state.instagramurl}
                        onChangeText={ value => {
                            this.setState({"instagramurl":value})
                        }}
                    />
                    {this.isFieldInError('instagramurl') && this.getErrorsInField('instagramurl').map(errorMessage => <Text key="instagramurl" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                    <Text>Linked in (optional)</Text>
                    <Input placeholder='Link to linked in profile goes here' 
                        value={this.state.linkedin}
                        onChangeText={ value => {
                            this.setState({"linkedin":value})
                        }}
                    />

                    <Text>Behance (optional)</Text>
                    <Input placeholder='Link to behance profile goes here' 
                        value={this.state.behance}
                        onChangeText={ value => {
                            this.setState({"behance":value})
                        }}
                    />

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
                    title="Next"
                    onPress={() => {
                        // navigation.navigate('Identity')
                        this._validate();
                    }}
                />

            </View>

        </ScrollView>
        )
    }
}

// export default SetupDetail;