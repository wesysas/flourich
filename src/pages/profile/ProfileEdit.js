import { SelectMultipleButton } from "react-native-selectmultiple-button";
import _ from "lodash";
import ValidationComponent from 'react-native-form-validator';
import { saveStorage } from '../../shared/service/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import React from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity , Image } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

import { updateProfile, getDefaultService, getCategories, getCreatorService } from '../../shared/service/api';
import BackButton from '../../components/BackButton';
import ProfileAvatar from '../../components/ProfileAvatar';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { local } from '../../shared/const/local';
import PhoneInput from "react-native-phone-number-input";
import RBSheet from "react-native-raw-bottom-sheet";
import {multiBtnGroupStyle, ios_red_color, ios_green_color, btnGradientProps} from "../../GlobalStyles";

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
    text: {
        marginVertical: 20,
        marginHorizontal: 20
    },

    headerTitle: {
        fontSize: 18,
        marginBottom: 20,
        marginTop:30
    },
    subTitle: {
        fontSize: 15
    },
    separate: {
        marginVertical: 20
    },
    btnStyle: {
        width: 90,
        borderRadius: 50,
        borderColor: 'gray',
        margin: 5
    },
    collapseHeader:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingBottom: 5,
        borderBottomColor: 'lightgray',
        alignItems: 'center'
    }
});

const operate_type = ["sole_trader", "private_company"];
export default class SetupDetail extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            dateTitle: 'MM/DD/YYYY',
            services: [],
            spinner:false,
            user:{},
            isDatePickerVisible: false,

            service:[],
            selected_service:[],
            selected_service_type:[],
            selected_categories:[],
            default_service:[],
            service_type:[],
            categories:[],
            serviceSheetHeight:'90%',
            serviceAddSheetVisible: false
        }
        this.serviceSheet = null;
    }
    async componentDidMount() {       
        
        if (global.user.birthday != null && global.user.birthday != '0000-00-00') {
            this.setState({date:new Date(global.user.birthday)});
            this.setState({dateTitle:Moment(global.user.birthday).format('DD/MM/YYYY')});
        }
                    
        this.setState({user:global.user});

        var default_service = await getDefaultService();
        var categories = await getCategories();
        var service_type = default_service.map((service) => {
            return service.title;
        });
        this.setState({service_type: [...new Set(service_type)]});
        this.setState({default_service});
        this.setState({categories});
        var service = await getCreatorService({ userid: global.user.cid });
        this.setState({service});

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
        this.state.user.services = services.join(',');
        this.setState({services: services});
        this.setState({user: this.state.user});
      }
     _renderBusiness = () => {
        if(this.state.user.operate_type === operate_type[1]) {
            return (
                <View>
                    <Text>Business Name</Text>
                    <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }}
                        placeholder=''
                        value={this.state.user.businessname}
                        onChangeText={value => {
                            this.state.user.businessname = value;
                            this.setState({user:this.state.user});
                        }}
                    />
                </View>
            );
        }else{
            return null;
        }
    };

    _validate = async() => {

        this.setState({spinner:true});        
        var user = this.state.user;
        user.birthday = this.state.date;
        var res = await updateProfile(user);
        this.setState({spinner:false});
        if(res != null) {            
            await saveStorage(local.user, JSON.stringify(user));
            global.user = user;
        }
        saveStorage(local.user, null);
        saveStorage(local.token, null);
        this.props.navigation.navigate('Index');        
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{}}>
                <Spinner
                    visible={this.state.spinner}
                />
                <View style={{ alignItems: 'stretch' }}>
                    <BackButton navigation={this.props.navigation} />
                    <ProfileAvatar />
                </View>

                <View style={styles.container}>
                    <Text style={styles.headerTitle}>Edit your profile</Text>                    
                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: 'lightgray', alignItems: 'center' }}>
                                <Text style={styles.subTitle}>Profile Setting</Text>
                                <Icon name="user-circle" size={18} />
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                            <Text>First Name</Text>
                            <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }}
                                placeholder=''
                                value={this.state.user.first_name}
                                onChangeText={value => {
                                    this.state.user.first_name = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('first_name') && this.getErrorsInField('first_name').map(errorMessage => <Text key="first_name" style={{ color:'red',marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            <Text>Last Name</Text>
                            <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }}
                                placeholder='' 
                                value={this.state.user.last_name}
                                onChangeText={value => {
                                    this.state.user.last_name = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('lastname') && this.getErrorsInField('lastname').map(errorMessage => <Text key="lastname" style={{ color:'red', textAlign: 'center'}}>{errorMessage}</Text>) }
                            
                            <Text>Birth Date</Text>
                            <Button 
                                buttonStyle={{
                                    borderWidth: 0,
                                    justifyContent: 'flex-start',
                                    borderColor: '#696969',
                                    borderBottomWidth: 1,
                                    paddingHorizontal: 0,
                                    marginBottom:20
                                }}
                                titleStyle={{
                                    color: '#696969'
                                }}
                                type='outline'
                                title={this.state.dateTitle} 
                                onPress={() => {
                                        this.setState({isDatePickerVisible:true});
                                  }} 
                                  />
                            <DateTimePickerModal
                                isVisible={this.state.isDatePickerVisible}
                                date={this.state.date}
                                mode="date"
                                onConfirm={(date) => {   
                                    this.setState({isDatePickerVisible:false});                                 
                                    this.setState({date:date});
                                    this.setState({dateTitle:Moment(this.state.date).format('DD/MM/YYYY')});                                    
                                  }}
                                onCancel={() => {
                                    this.setState({isDatePickerVisible:false});
                                  }}
                            />
                            
                            {this.isFieldInError('birthday') && this.getErrorsInField('birthday').map(errorMessage => <Text key="birthday" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            <Text>Phone Number</Text>
                            <View style={{ marginTop:-10,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{fontSize:12, color:'gray'}}>For notifications, reminders and help logging in</Text>
                                <Button
                                    type="clear"
                                    title="add"
                                    titleStyle={{ textDecorationLine: 'underline' }}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth:1, borderColor:'grey'}}>
                                <PhoneInput
                                    ref={ref => {
                                        this.phoneInput = ref;
                                    }}
                                    defaultValue={this.state.user.phone}
                                    defaultCode="GB"
                                    layout="first"
                                    flagButtonStyle={{paddingVertical:10}}
                                    textContainerStyle={{paddingVertical:0, backgroundColor:'white'}}
                                    onChangeText={(text) => {
                                        this.setState({phone:text});
                                        this.state.user.phone = text;
                                        this.setState({user:this.state.user});

                                        const checkValid = this.phoneInput.isValidNumber(text);
                                        this.setState({valid:(checkValid ? checkValid : false)});
                                    }}
                                    onChangeFormattedText={(text) => {
                                        const checkValid = this.phoneInput.isValidNumber(this.state.user.phone);
                                        this.setState({valid:(checkValid ? checkValid : false)});
                                    }}
                                />
                                {this.state.valid && (
                                    <Icon name="check-circle" size={30} />
                                )}
                                {!this.state.valid && (
                                    <Icon name="times-circle" size={30} />
                                )}
                            </View>
                            {this.isFieldInError('phone') && this.getErrorsInField('phone').map(errorMessage => <Text key="phone" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            { this._renderBusiness()}
                            
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
                                            <View style={{flexDirection: 'row', alignItems:'center'}}>
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
                                <View style={{flex: 1, flexDirection: 'row', margin:10, alignItems:'center'}}>
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
                            <Text>Website</Text>
                            <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder=''
                                value={this.state.user.weburl}
                                onChangeText={value => {
                                    this.state.user.weburl = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('weburl') && this.getErrorsInField('weburl').map(errorMessage => <Text key="weburl" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            <Text>Instagram URL</Text>
                            <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder=''
                                value={this.state.user.instagramurl}
                                onChangeText={value => {
                                    this.state.user.instagramurl = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('instagramurl') && this.getErrorsInField('instagramurl').map(errorMessage => <Text key="instagramurl" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            <Text>Linked in (optional)</Text>
                            <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder=''
                                value={this.state.user.linkedin}
                                onChangeText={value => {
                                    this.state.user.linkedin = value;
                                    this.setState({user:this.state.user});
                                }}
                            />

                            <Text>Behance (optional)</Text>
                            <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder=''
                                value={this.state.user.behance}
                                onChangeText={value => {
                                    this.state.user.behance = value;
                                    this.setState({user:this.state.user});
                                }}
                            />

                        </CollapseBody>
                    </Collapse>

                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={styles.collapseHeader}>
                                <Text style={styles.subTitle}>Payment Methods</Text>
                                <Icon name="credit-card" size={18} />
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                        </CollapseBody>
                    </Collapse>
                                       
                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: 'lightgray', alignItems: 'center' }}>
                                <Text style={styles.subTitle}>Address</Text>
                                <Icon name="map-marker" size={18} />
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                            <Text>Full Address</Text>
                            <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder=''
                                value={this.state.user.fulladdress}
                                onChangeText={value => {
                                    this.state.user.fulladdress = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('fulladdress') && this.getErrorsInField('fulladdress').map(errorMessage => <Text key="fulladdress" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                            <Text>Business or Building Name</Text>
                            <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder=''
                                value={this.state.user.building}
                                onChangeText={value => {
                                    this.state.user.building = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('building') && this.getErrorsInField('building').map(errorMessage => <Text key="building" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            <Text>Street Address</Text>
                            <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder=''
                                value={this.state.user.street}
                                onChangeText={value => {
                                    this.state.user.street = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('street') && this.getErrorsInField('street').map(errorMessage => <Text key="street" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                                                        
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <View style={{flex:1}}>
                                    <Text>Post Code</Text>
                                    <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder=''
                                        value={this.state.user.postalcode}
                                        onChangeText={value => {
                                            this.state.user.postalcode = value;
                                            this.setState({user:this.state.user});
                                        }}
                                    />
                                    {this.isFieldInError('postalcode') && this.getErrorsInField('postalcode').map(errorMessage => <Text key="postalcode" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                                </View>
                                <View style={{flex:0.5}}></View>
                                <View style={{flex:1}}>
                                    <Text>City</Text>
                                    <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }} placeholder=''
                                        value={this.state.city}
                                        onChangeText={ value => {
                                            this.setState({"city":value})
                                        }}
                                    />  
                                    {this.isFieldInError('street') && this.getErrorsInField('street').map(errorMessage => <Text key="street" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                                </View>
                            </View>
                        </CollapseBody>
                    </Collapse>

                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={styles.collapseHeader}>
                                <Text style={styles.subTitle}>Notification Settings</Text>
                                <Icon name="bell-o" size={18} />
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                        </CollapseBody>
                    </Collapse>
                    
                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={styles.collapseHeader}>
                                <Text style={styles.subTitle}>Wallet</Text>
                                <FontAwesomeIcon name="wallet" size={18} />
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                        </CollapseBody>
                    </Collapse>
                    
                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={styles.collapseHeader}>
                                <Text style={styles.subTitle}>Settings</Text>
                                <Icon name="gear" size={18} />
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                        </CollapseBody>
                    </Collapse>
                    
                    <Text style={styles.headerTitle}>SUPPORT</Text>                    
                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={styles.collapseHeader}>
                                <Text style={styles.subTitle}>How Flourich Works</Text>
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                        </CollapseBody>
                    </Collapse>

                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={styles.collapseHeader}>
                                <View>
                                    <Text style={styles.subTitle}>Safety Center</Text>
                                    <Text style={{fontSize:12, color:'gray'}}>Get support tools and information you need to be safe</Text>
                                </View> 
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                        </CollapseBody>
                    </Collapse>

                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={styles.collapseHeader}>
                                <Text style={styles.subTitle}>Get Help/Support</Text>
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                        </CollapseBody>
                    </Collapse>                    
                    
                    <Text style={styles.headerTitle}>LEGAL</Text>                    
                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={styles.collapseHeader}>
                                <Text style={styles.subTitle}>Terms of Service</Text>
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                        </CollapseBody>
                    </Collapse>
                    
                    <Button
                        buttonStyle={{ marginVertical: 20, borderRadius: 8, width:150, alignSelf:'center' }}
                        ViewComponent={LinearGradient}
                        titleStyle={styles.btnTitle}
                        linearGradientProps={btnGradientProps}
                        title="Log out"
                        onPress={() => {
                            this._validate();
                        }}
                    />
                    <Text style={{ alignSelf: 'center' }}>Flourich Version 3.0 (01012021)</Text>
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
                        <Text style={{fontSize:22, fontWeight:'bold'}}>{this.state.selected_service.item}</Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent:'space-between',
                            marginTop:20,
                        }}>
                            <Text style={styles.subTitle}>Description</Text>                           
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
                        <TextInput style={{ height: 60,
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        paddingLeft:5,
                                        marginTop:5
                                    }}
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
                                    left:5,
                                    fontSize:18,
                                    zIndex:1,
                                    top:9
                                }}>£</Text>
                                <TextInput
                                    style={{ height: 40,
                                        minWidth:80,
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        paddingLeft:20,
                                        textAlign:'center'
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
                                        minWidth: 90,
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