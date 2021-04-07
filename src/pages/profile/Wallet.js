import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Spinner from "react-native-loading-spinner-overlay";
import RBSheet from "react-native-raw-bottom-sheet";
import {getTransaction, withdraw} from "../../shared/service/api";
import BackButton from '../../components/BackButton';
import { Button, Input, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import {multiBtnGroupStyle, ios_red_color, ios_green_color, btnGradientProps} from "../../GlobalStyles";
import Moment from 'moment';
import Modal from 'react-native-modalbox';

const AssetFolder = ({ iconSize, fileName }) => {
    return (
        <View>
            <TouchableOpacity >
                <Icon name="folder" size={iconSize} color="#011f6f"/>
                <Icon name="check-circle" size={25} color="green" style={{ position: 'absolute', top: 17, left: 8 }} />
                <Text style={{ alignSelf: 'center', bottom: 0, position: 'absolute' }}>{fileName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: 'center', borderRadius: 15, padding: 2, width: 30, height: 30, alignItems: 'center', borderWidth: 1, borderColor: 'gray' }}>
                <EntypoIcon name="dots-three-vertical" size={24} />
            </TouchableOpacity>
        </View>
    )
};

export default class Studio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            withdraw_amount: '',
            ballance:0,
            spinner:false,
            transactions:[]
        };
        this.RBSheetR = null;
    }   

    async componentDidMount() {
        if (global.user.ballance>0)
            this.setState({ballance:global.user.ballance});
    }

    render() {
        return (
            <SafeAreaView  style={{
                flex: 1,
            }}>
                <Spinner
                    visible={this.state.spinner}
                />
                <BackButton navigation={this.props.navigation} />
                <Text style={{ fontSize: 25, color: 'black', textAlign: 'center', marginTop:20}}>Wallet</Text>
                <ScrollableTabView
                    style={styles.container}
                    renderTabBar={() =>
                        <DefaultTabBar
                            backgroundColor='rgba(255, 255, 255, 0.7)'
                        // tabStyle={{ width: 100 }}
                        />}
                    tabBarPosition='overlayTop'
                    onChangeTab={async({ i, from })=>{
                        if (i == 1 && from == 1){
                            var transactions = await getTransaction({ userid: global.user.cid });
                            this.setState({transactions});
                            console.log("-----transactions----------", transactions);
                        }
                    }}
                >
                    <ScrollView tabLabel='Balance' style={styles.innerTab}>
                        <View style={{ alignItems:'center', marginHorizontal:20, marginVertical:40, borderColor:'lightgrey', borderWidth:1, borderRadius:10, paddingVertical:20, paddingHorizontal:5 }}>
                            <Text style={{fontSize:25, marginTop:40}}>Your Balance</Text>
                            <Text style={{fontSize:50}}>£ {this.state.ballance}</Text>
                            <Button
                                buttonStyle={{ marginVertical: 70, borderRadius: 8, width:200, height:50, alignSelf:'center' }}
                                ViewComponent={LinearGradient}
                                titleStyle={styles.btnTitle}
                                linearGradientProps={btnGradientProps}
                                title="Withdraw"
                                onPress={() => {
                                    if (this.state.ballance>0){
                                        this.setState({withdraw_amount:''});
                                        this.RBSheetR.open();
                                    }
                                }}
                            />
                            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                                <View>
                                <Text style={{color:'grey'}}>Date</Text>
                                <Text style={styles.subTitle}>{Moment().format("D MMM YYYY")}</Text>
                                </View>

                                <View>
                                <Text style={{color:'grey', textAlign:'right'}}>Time</Text>
                                <Text style={styles.subTitle}>{Moment().format('HH:mmA')}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={{alignSelf:'center'}} 
                             onPress={() => {
                                this.props.navigation.navigate('Report');     
                            }}>
                                <Text style={{fontSize:20, textDecorationLine:'underline'}}>Generate Report</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <ScrollView tabLabel='Recent Activities' style={styles.innerTab}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch' }}>
                        {this.state.transactions.map((transaction, i) => {
                                return (
                                    <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between', marginTop:10,
                                        alignItems:'center', borderBottomColor:'grey', borderBottomWidth:1}}>
                                        <View>
                                        <Text style={{fontWeight:'bold'}}>{transaction.amount>0?'Wallet':'Bank account'}</Text>
                                        <Text>{transaction.amount>0?'Payment received from flourich':'Instant transfer from wallet'}</Text>
                                        <Text style={{color:'grey', marginVertical:10, fontSize:12}}>{Moment(transaction.created_at).format("DD MMM")}</Text>
                                        </View>
                                        <View>
                                        <Text style={{fontSize:30, textAlign:'right'}}>{transaction.amount>0?'+':'-'} £ {Math.abs(transaction.amount)}</Text>
                                        </View>
                                    </View>
                                );
                            })}                  
                        </View>
                    </ScrollView>
                </ScrollableTabView>
                <Modal style={styles.modal} position={"center"} ref={"modal3"} >
                    <TouchableOpacity style={{position:'absolute', left:10, top:10}} 
                            onPress={() => {
                            this.refs.modal3.close()
                        }}>
                            <Image style={{
                                width:30,
                                alignSelf: 'center',
                                resizeMode: 'contain'}}
                            source={require('../../assets/img/close.png')} />
                    </TouchableOpacity>
                    
                    <Text style={{fontSize:50, marginTop:50, textAlign:'center'}}>£ {this.state.withdraw_amount}</Text>
                    <Text style={{marginVertical:30, textAlign:'center'}}>Transferred to account no {global.user.account_number}</Text>

                    <TouchableOpacity style={{alignSelf:'center', marginVertical:30}} 
                            onPress={() => {
                            this.refs.modal3.close()
                        }}>
                        <Image style={{
                            
                            width:150,
                            alignSelf: 'center',
                            resizeMode: 'contain'}}
                           source={require('../../assets/img/check.png')} />
                    </TouchableOpacity>    
                </Modal>
                <RBSheet
                    ref={ref => {
                        this.RBSheetR = ref;
                    }}
                    height={320}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            alignItems:'center'
                        },
                        draggableIcon: {
                            backgroundColor: "lightgrey",
                            width:100
                        }
                    }}
                >                    
                    <Spinner
                        visible={this.state.spinner}
                    />
                    <Text style={{fontSize:18, marginVertical:20}}>Withdrawal to your bank account</Text>
                    <Input style={{fontSize:50, textAlign:'center'}} inputContainerStyle ={{ paddingVertical:20, marginHorizontal:20}} placeholder=''
                        value={'£ '+this.state.withdraw_amount}
                        keyboardType='number-pad'
                        onChangeText={value => {
                            this.setState({withdraw_amount:value.replace('£','').trim()})
                        }}
                    />
                    <Text style={{marginTop:-20}}>Input amount</Text>
                    <Button
                        containerStyle={{marginVertical:30}}
                        buttonStyle={{ borderRadius: 8, width:300, height:40, alignSelf:'center' }}
                        ViewComponent={LinearGradient}
                        titleStyle={styles.btnTitle}
                        linearGradientProps={btnGradientProps}
                        title="Confirm"
                        onPress={async() => {
                            if (this.state.ballance>this.state.withdraw_amount && this.state.withdraw_amount>0){
                                this.setState({spinner:true});
                                var result = await withdraw({cid:global.user.cid, account_number:global.user.account_number, amount:this.state.withdraw_amount});
                                this.setState({spinner:false});
                              
                                if(result != null) {
                                    this.setState({ballance:this.state.ballance-this.state.withdraw_amount});
                                    global.user.ballance = this.state.ballance;
                                    this.refs.modal3.open();
                                    this.RBSheetR.close();
                                }
                            }
                        }}
                    />
                </RBSheet>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        zIndex: 1
    },
    modal: {
        height: 500,
        width: 300,
        borderColor:'lightgrey',
        borderWidth:1, 
        borderRadius:10, 
        paddingVertical:20, paddingHorizontal:5 
    },
    innerTab: {
        marginTop:50,
        marginHorizontal: 20
    },
    btnStyle:{
        alignItems: 'center',
        backgroundColor:'#f7f9fc',
        paddingVertical:10,
        marginHorizontal:20,
        borderRadius:5,
        fontSize:16,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
        textAlign:'center'
    }
});