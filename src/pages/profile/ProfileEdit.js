import { SelectMultipleButton } from "react-native-selectmultiple-button";
import _ from "lodash";
import ValidationComponent from 'react-native-form-validator';
import { getStorage, saveStorage } from '../../shared/service/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import React from 'react'
import DatePicker from 'react-native-date-picker'
import { View, Text, StyleSheet, ScrollView, TextInput, LogBox , Image } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateProfile } from '../../shared/service/api';
import BackButton from '../../components/BackButton';
import ProfileAvatar from '../../components/ProfileAvatar';


import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { local } from '../../shared/const/local';

const ios_blue = "#007AFF";

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
    }
});
const services = ["Photos", "Videos", "Graphics", "Editor", "UGC"];
const operate_type = ["sole_trader", "private_company"];
export default class SetupDetail extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
            spinner:false,
            user:{}
        }
    }
    async componentDidMount() {
        LogBox.ignoreLogs(['Warning: `componentWillReceiveProps`']);
        var user = await getStorage(local.user);
        this.setState({user:JSON.parse(user)});
        this.setState({services:this.state.user.services.split(',')});
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
                    <Input 
                        placeholder='Flourich Marketing Ltd'
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

        console.log(this.state.user);        

        this.setState({spinner:true});
        var res = await updateProfile(this.state.user);
        this.setState({spinner:false});
        if(res != null) {            
            await saveStorage(local.user, JSON.stringify(this.state.user));
            console.log(local.user);
        }
        
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{}}>
                <Spinner
                    visible={this.state.spinner}
                />
                <View style={{ alignItems: 'stretch' }}>
                    <BackButton navigation={this.props.navigation} />
                    <Image style={styles.image} source={require('../../assets/img/profile_logo.jpg')} />
                    <ProfileAvatar />
                </View>
                <View style={styles.container}>
                    <Text style={styles.headerTitle}>Edit your profile</Text>
                    
                    <Collapse style={{ marginVertical: 10 }}>
                        <CollapseHeader>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: 'lightgray', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18 }}>Profile Setting</Text>
                                <Icon name="user-circle" size={18} />
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                            <Text>First Name</Text>
                            <Input 
                                placeholder='Leteechia'
                                value={this.state.user.first_name}
                                onChangeText={value => {
                                    this.state.user.first_name = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('first_name') && this.getErrorsInField('first_name').map(errorMessage => <Text key="first_name" style={{ color:'red',marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            <Text>Last Name</Text>
                            <Input 
                                placeholder='Rungasamy' 
                                value={this.state.user.last_name}
                                onChangeText={value => {
                                    this.state.user.last_name = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('lastname') && this.getErrorsInField('lastname').map(errorMessage => <Text key="lastname" style={{ color:'red', textAlign: 'center'}}>{errorMessage}</Text>) }
                            
                            <Text>Birth Date</Text>
                            <DatePicker
                                date={this.state.user.birthday == null ? new Date() : new Date(this.state.user.birthday.replace(/-/g, '\/')) }
                                mode="date"
                                onDateChange={(date) => {                                    
                                    var d = date.getDate();
                                    var m = date.getMonth() + 1;
                                    var y = date.getFullYear();
                                    var dateString = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
                                    this.state.user.birthday = dateString;
                                    this.setState({user:this.state.user});
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
                            <Input placeholder="(99) 99999-9999"
                                value={this.state.user.phone}
                                onChangeText={value => {
                                    this.state.user.phone = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('phone') && this.getErrorsInField('phone').map(errorMessage => <Text key="phone" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

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
                                        value={this.state.user.minprice}
                                        onChangeText={value => {
                                            this.state.user.minprice = value.replace(/[^0-9]/g, '');
                                            this.setState({user:this.state.user});
                                        }}
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
                                        value={this.state.user.maxprice}
                                        onChangeText={value => {
                                            this.state.user.maxprice = value.replace(/[^0-9]/g, '');
                                            this.setState({user:this.state.user});
                                        }}
                                        keyboardType={'numeric'}
                                    />
                                </View>
                            </View>
                            {this.isFieldInError('minprice') && this.getErrorsInField('minprice').map(errorMessage => <Text key="minprice" style={{ color:'red', marginLeft: 10}}>{errorMessage}</Text>) }
                            {this.isFieldInError('maxprice') && this.getErrorsInField('maxprice').map(errorMessage => <Text key="maxprice" style={{ color:'red', marginLeft: 10}}>{errorMessage}</Text>) }
                       
                            <Text>Website</Text>
                            <Input placeholder='www.flourich.co.uk' 
                                value={this.state.user.weburl}
                                onChangeText={value => {
                                    this.state.user.weburl = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('weburl') && this.getErrorsInField('weburl').map(errorMessage => <Text key="weburl" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            <Text>Instagram URL</Text>
                            <Input placeholder='Instagram Link goes here' 
                                value={this.state.user.instagramurl}
                                onChangeText={value => {
                                    this.state.user.instagramurl = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('instagramurl') && this.getErrorsInField('instagramurl').map(errorMessage => <Text key="instagramurl" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            <Text>Linked in (optional)</Text>
                            <Input placeholder='Link to linked in profile goes here' 
                                value={this.state.user.linkedin}
                                onChangeText={value => {
                                    this.state.user.linkedin = value;
                                    this.setState({user:this.state.user});
                                }}
                            />

                            <Text>Behance (optional)</Text>
                            <Input placeholder='Link to behance profile goes here' 
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
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: 'lightgray', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18 }}>Address</Text>
                                <Icon name="map-marker" size={18} />
                            </View>
                        </CollapseHeader>
                        <CollapseBody style={{ margin: 10 }}>
                            <Text>Full Address</Text>
                            <Input placeholder='Full address displays here' 
                                value={this.state.user.fulladdress}
                                onChangeText={value => {
                                    this.state.user.fulladdress = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('fulladdress') && this.getErrorsInField('fulladdress').map(errorMessage => <Text key="fulladdress" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                            <Text>Business or Building Name</Text>
                            <Input placeholder='Business or building name goes here' 
                                value={this.state.user.building}
                                onChangeText={value => {
                                    this.state.user.building = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('building') && this.getErrorsInField('building').map(errorMessage => <Text key="building" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

                            <Text>Street Address</Text>
                            <Input placeholder='street address goes here'
                                value={this.state.user.street}
                                onChangeText={value => {
                                    this.state.user.street = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('street') && this.getErrorsInField('street').map(errorMessage => <Text key="street" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }
                            <Text>Post Code</Text>
                            <Input placeholder='123456789UK' 
                                value={this.state.user.postalcode}
                                onChangeText={value => {
                                    this.state.user.postalcode = value;
                                    this.setState({user:this.state.user});
                                }}
                            />
                            {this.isFieldInError('postalcode') && this.getErrorsInField('postalcode').map(errorMessage => <Text key="postalcode" style={{ color:'red', marginTop: -25, marginLeft: 10}}>{errorMessage}</Text>) }

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
                        onPress={() => {
                            // navigation.navigate('Identity')
                            this._validate();
                        }}
                    />
                <   Text style={{ alignSelf: 'center' }}>Flourich Version 3.0 (01012021)</Text>

                </View>

        </ScrollView>
        )
    }
}

// export default SetupDetail;