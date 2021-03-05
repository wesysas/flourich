import React, { useState } from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList, LogBox, TouchableOpacity, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';

import {Button, Input, CheckBox, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import { SelectMultipleButton, SelectMultipleGroupButton } from "react-native-selectmultiple-button";
import _ from "lodash";
import ValidationComponent from 'react-native-form-validator';
import {multiBtnGroupStyle, ios_red_color, ios_green_color, btnGradientProps} from "../../GlobalStyles";
import {createProfile, getDefaultService, getCategories} from '../../shared/service/api';
import { getUserId } from '../../shared/service/storage';
import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from "react-native-raw-bottom-sheet";

const ios_blue = "#007AFF";

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginTop:30,
        paddingHorizontal: 30,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black'
    },
    subTitle: {
        fontSize: 20,
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
            building:"",
            fulladdress:'',
            street: "",
            postalcode: "",
            weburl:"",
            instagramurl:"",
            linkedin:"",
            behance:"",
            spinner:false,

            service:[],
            selected_service:[],
            selected_service_type:[],
            selected_categories:[],
            default_service:[],
            service_type:[],
            categories:[],
            serviceSheetHeight:'90%',
            serviceAddSheetVisible: false
        };
        this.serviceSheet = null;
    }
    async componentDidMount() {
        LogBox.ignoreLogs(['Warning: `componentWillReceiveProps`']);

        var default_service = await getDefaultService();
        var categories = await getCategories();
        var service_type = default_service.map((service) => {
            return service.title;
        });
        this.setState({service_type: [...new Set(service_type)]});
        this.setState({default_service});
        this.setState({categories});
    }

     _renderBusiness = () => {
        if(this.state.operate_type === operate_type[1]) {
            return (
                <View>
                    <Text>Business Name</Text>
                    <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }}
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
        const { type } = this.state;
        if(type === operate_type[1]){
            var validate = this.validate({
                firstname: { required: true },
                lastname: { required: true },
                businessname: { required: true },
                building: { required: true },
                fulladdress: { required: true },
                street: { required: true },
                postalcode: { required: true },
                weburl: { required: true },
                instagramurl: { required: true },
            });
        }else{
            var validate = this.validate({
                firstname: { required: true },
                lastname: { required: true },
                building: { required: true },
                fulladdress: { required: true },
                street: { required: true },
                postalcode: { required: true },
                weburl: { required: true },
                instagramurl: { required: true },
            });
        }
        
        if(validate) {
            this.setState({spinner:true});
            var userid = await getUserId();
            this.setState({'userid': userid});
            var res = await createProfile(this.state);
            this.setState({spinner:false});
            if(res != null) {
                this.props.navigation.navigate('Identity');
            }else{
                this.props.navigation.navigate('Home');
            }
        }
    };

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                />

                <View style={{marginVertical: 30}}>
                    <Text style={styles.headerTitle}>Continue Set Up</Text>
                    <View style={{marginVertical: 20, minHeight:80}}>
                        <Text>You operate as</Text>
                        <DropDownPicker
                            items={  [
                            {label: 'Private Company', value: 'private_company', icon: () => <Icon name="users" size={18} color={ios_red_color} />},
                            {label: 'Sole Trader', value: 'sole_trader', icon: () => <Icon name="user" size={18} color={ios_red_color} />}]}
                            //defaultValue={this.state.operate_type}
                            style={{borderWidth:0, borderBottomWidth:1, paddingHorizontal:0}}
                            placeholder="Select an operate"
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            onChangeItem={item => this.setState({
                                operate_type: item.value
                            })}
                        />

                    </View>
                    <View style={styles.separate}>
                        <Text style={styles.subTitle}>Add you name*</Text>
                        <Text>First Name</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }}
                            placeholder='Leteechia'
                            value={this.state.firstname}
                            onChangeText={value => {
                                this.setState({"firstname":value})
                            }}
                        />
                        {this.isFieldInError('firstname') && this.getErrorsInField('firstname').map(errorMessage => <Text key="firstname" style={{ color:'red',marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                        <Text>Last Name</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }}
                            placeholder='Rungasamy' 
                            onChangeText={value => {
                                this.setState({"lastname":value})
                            }}
                        />
                        {this.isFieldInError('lastname') && this.getErrorsInField('lastname').map(errorMessage => <Text key="lastname" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                        { this._renderBusiness()}
                    </View>

                    <View style={styles.separate}>
                        <Text style={styles.subTitle}>Add your services*</Text>
                        <View style={multiBtnGroupStyle}>
                            {this.state.service_type.map(interest => (
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
                                    borderTintColor: ios_red_color,
                                    backgroundTintColor: ios_red_color,
                                    textTintColor: "white"
                                }}
                                value={interest}
                                selected={this.state.selected_service_type.includes(interest)}
                                singleTap={valueTap =>{
                                        var selected_service_type = this.state.selected_service_type;
                                        if (selected_service_type.includes(interest)) {
                                            _.remove(selected_service_type, ele => {
                                                return ele === interest;
                                            });
                                        } else {
                                            selected_service_type.push(interest);
                                        }
                                        this.setState({selected_service_type});
                                    }
                                }
                                />
                            ))}
                        </View>
                        {this.isFieldInError('services') && this.getErrorsInField('services').map(errorMessage => <Text key="services" style={{ color:'red', marginTop: -15, marginLeft: 25}}>{errorMessage}</Text>) }
                        {this.state.service.map((service, i) => {
                            return (
                                <View key={i} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin:10}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Button
                                            icon={<Icon name="minus" size={9} color="white" />}
                                            type="outline"
                                            containerStyle={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 12,
                                                backgroundColor: ios_red_color,
                                                alignItems: 'center',
                                            }}
                                            buttonStyle={{borderWidth:0}}
                                            onPress={()=>{
                                                let service = this.state.service.filter((service, key) => key != i);
                                                this.setState({service});
                                            }}
                                        />
                                        <Text style={{marginLeft:10}}>{service.item}</Text>
                                    </View>
                                    <Text>£{service.price}</Text>
                                </View>
                            );
                        })}
                        <View style={{flex: 1, flexDirection: 'row', margin:10}}>
                            <Button
                                icon={<Icon name="plus" size={9} color="white" />}
                                type="outline"
                                containerStyle={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: ios_green_color,
                                    alignItems: 'center',
                                }}
                                buttonStyle={{borderWidth:0}}
                                onPress={()=>{
                                    if(this.state.selected_service_type.length>0) {                                        
                                        this.serviceSheet.open();
                                    }
                                }}
                            />
                            <Text style={{marginLeft:10}}>Add a service</Text>
                        </View>

                    </View>
                    <View style={styles.separate}>
                        <Text style={styles.subTitle}>Add your Address*</Text>
                        <Text>Full Address</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder='Full address displays here'
                            value={this.state.fulladdress}
                            onChangeText={ value => {
                                this.setState({"fulladdress":value})
                            }}
                        />
                        {this.isFieldInError('fulladdress') && this.getErrorsInField('fulladdress').map(errorMessage => <Text key="fulladdress" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                        <Text>Business or Building Name</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder='Business or building name goes here'
                            value={this.state.building}
                            onChangeText={ value => {
                                this.setState({"building":value})
                            }}
                        />
                        {this.isFieldInError('building') && this.getErrorsInField('building').map(errorMessage => <Text key="building" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                        <Text>Street Address</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder='street address goes here'
                            value={this.state.street}
                            onChangeText={ value => {
                                this.setState({"street":value})
                            }}
                        />
                        {this.isFieldInError('street') && this.getErrorsInField('street').map(errorMessage => <Text key="street" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                        <Text>Post Code</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder='123456789UK'
                            value={this.state.postalcode}
                            onChangeText={ value => {
                                this.setState({"postalcode":value})
                            }}
                        />
                        {this.isFieldInError('postalcode') && this.getErrorsInField('postalcode').map(errorMessage => <Text key="postalcode" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                    </View>

                    <View style={styles.separate}>
                        <Text>Website</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder='www.flourich.co.uk'
                            value={this.state.weburl}
                            onChangeText={ value => {
                                this.setState({"weburl":value})
                            }}
                        />
                        {this.isFieldInError('weburl') && this.getErrorsInField('weburl').map(errorMessage => <Text key="weburl" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                        <Text>Instagram URL</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder='Instagram Link goes here'
                            value={this.state.instagramurl}
                            onChangeText={ value => {
                                this.setState({"instagramurl":value})
                            }}
                        />
                        {this.isFieldInError('instagramurl') && this.getErrorsInField('instagramurl').map(errorMessage => <Text key="instagramurl" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                        <Text>Linked in (optional)</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder='Link to linked in profile goes here'
                            value={this.state.linkedin}
                            onChangeText={ value => {
                                this.setState({"linkedin":value})
                            }}
                        />

                        <Text>Behance (optional)</Text>
                        <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder='Link to behance profile goes here'
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
                        linearGradientProps={btnGradientProps}
                        title="Next"
                        onPress={() => {
                            // navigation.navigate('Identity')
                            this._validate();
                        }}
                    />

                </View>
               
                <RBSheet
                    ref={ref => {
                        this.serviceSheet = ref;
                    }}
                    onOpen={()=>{
                        var serviceSheetHeight = 350;
                        if(this.state.selected_service_type.length == 2) serviceSheetHeight = 550;
                        if(this.state.selected_service_type.length >= 3) serviceSheetHeight = '95%';
                        this.setState({serviceSheetHeight});
                        this.setState({serviceAddSheetVisible:false});
                    }}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    openDuration={250}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            height:this.state.serviceSheetHeight
                        }
                    }}
                >
                    
                    {this.state.serviceAddSheetVisible === false && <ScrollView>
                        <Text style={{fontSize: 20,marginTop: 20, textAlign:'center', fontWeight: 'bold'}}>Add a service</Text>
                        {this.state.selected_service_type.map((selected_service_type, i) => {
                            return (
                                <View key={i} style={{marginHorizontal:20}}>
                                    <Text style={{fontSize:17, marginVertical:10}}>{selected_service_type}</Text>
                                    <View>
                                        {this.state.default_service.filter((service) => {return service.title===selected_service_type? service:'';}).map((selected_service, i) => {
                                            return (
                                                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-around', padding:8, margin:2, backgroundColor:'#f7f9fc'}} key={selected_service.service_id}
                                                                  onPress={() => {
                                                                      this.setState({selected_service});
                                                                      this.setState({serviceSheetHeight:400});
                                                                      this.setState({serviceAddSheetVisible:true});
                                                                  }}>
                                                    <Text style={{width:'70%'}}>{selected_service.item}</Text>
                                                    <Text>£{selected_service.price}</Text>
                                                    <Icon name="chevron-right" size={15} />
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>}
                    {this.state.serviceAddSheetVisible&& <View style={{flex:1, padding:20}}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent:'space-between',
                            marginVertical:20,
                        }}>
                            <Text style={{fontSize:22, fontWeight:'bold'}}>{this.state.selected_service.item}</Text>
                            <Button
                                buttonStyle={ styles.btn }
                                titleStyle={{fontSize:20, marginHorizontal:10, marginVertical:0}}
                                ViewComponent={LinearGradient}
                                linearGradientProps={btnGradientProps}
                                title="ADD"
                                onPress={() => {
                                    this.state.selected_service.categories = this.state.selected_categories;
                                    this.state.service.push(this.state.selected_service);
                                    this.setState({selected_categories:[]});
                                    this.setState({service: [...new Set(this.state.service)]});
                                    this.setState({serviceAddSheetVisible:false});
                                    this.serviceSheet.close();
                                }}
                            />
                        </View>
                        <Text style={styles.subTitle}>Description</Text>
                        <TextInput
                            value={this.state.selected_service.description}
                            multiline={true}
                            onChangeText={value => {
                                this.state.selected_service.description = value;
                                this.setState({selected_service:this.state.selected_service});
                            }}
                        />
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{fontSize:18, marginRight:30}}>Price</Text>
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
                                    value={this.state.selected_service.price}
                                    onChangeText={value => {
                                        this.state.selected_service.price = value.replace(/[^0-9]/g, '');
                                        this.setState({selected_service:this.state.selected_service});
                                    }}
                                    keyboardType={'numeric'}
                                />
                            </View>
                        </View>

                        <View style={[multiBtnGroupStyle, {marginHorizontal:-20}]}>
                            {this.state.categories.map(interest => (
                                <SelectMultipleButton
                                    key={interest.id}
                                    buttonViewStyle={{
                                        width: 120,
                                        borderRadius: 50,
                                        borderColor: 'gray',
                                        margin: 5}}
                                    textStyle={{
                                        fontSize: 16
                                    }}
                                    highLightStyle={{
                                        borderColor: "gray",
                                        backgroundColor: "transparent",
                                        textColor: "gray",
                                        borderTintColor: ios_red_color,
                                        backgroundTintColor: ios_red_color,
                                        textTintColor: "white"
                                    }}
                                    value={interest.title}
                                    selected={this.state.selected_categories.includes(interest.id)}
                                    singleTap={valueTap =>{
                                        var selected_categories = this.state.selected_categories;
                                        if (selected_categories.includes(interest.id)) {
                                            _.remove(selected_categories, ele => {
                                                return ele === interest.id;
                                            });
                                        } else {
                                            selected_categories.push(interest.id);
                                        }
                                        this.setState({selected_categories});
                                    }
                                    }
                                />
                            ))}
                        </View>
                    </View>
                    }
                </RBSheet> 
        </ScrollView>
        )
    }
}

// export default SetupDetail;