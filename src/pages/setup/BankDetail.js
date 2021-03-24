import React, { Component  } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import { btnGradientProps } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackButton from "../../components/BackButton";
import {uploadBankDetail} from '../../shared/service/api';
import Spinner from 'react-native-loading-spinner-overlay';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'
    },
    subTitle: {
        fontSize: 20,
        marginTop: 15,
        marginLeft:50,
        marginBottom:50
    },
    btnIconStyle: {
        flexDirection:'row' ,
         alignItems:'center', 
         borderWidth:1,
         padding:10,
         marginVertical:10,
         borderColor:'grey', 
         borderRadius:8, 
         justifyContent:'space-between'
    },
    btnStyle: {
        marginVertical: 10, borderRadius: 8
    }
});

export default class Identity extends Component {
    constructor(props) {
        super(props);      
        this.state = {
            cid: global.user.cid,
            bank_name: '',
            account_number: '',
            short_code: '',
            spinner: false,
        }  
    }

    render() {
        return (
            <SafeAreaView>
                <Spinner
                    visible={this.state.spinner}
                />
                <BackButton navigation={this.props.navigation} />   
                <View style={styles.container}>             
                    <Text style={styles.subTitle}>Add bank details</Text>

                    <View style={styles.btnIconStyle}>
                        <TextInput
                            style={{fontSize:18}}
                            placeholder="Bank Name"
                            onChangeText={value => {
                                this.setState({"bank_name":value});                              
                            }}
                        />
                        <Icon name="check-circle" size={25} />
                    </View>

                    <View style={styles.btnIconStyle}>
                        <TextInput
                            style={{fontSize:18}}
                            placeholder="Account Number"
                            onChangeText={value => {
                                this.setState({"account_number":value});                              
                            }}
                        />
                        <Icon name="check-circle" size={25} />
                    </View>

                    <View style={styles.btnIconStyle}>
                        <TextInput
                            style={{fontSize:18}}
                            placeholder="Sort Code"
                            keyboardType={'numeric'}
                            onChangeText={value => {
                                this.setState({"short_code":value});                              
                            }}
                        />
                        <Icon name="check-circle" size={25} />
                    </View>

                    <Button
                        containerStyle={{marginTop:100}}
                        buttonStyle={styles.btnStyle}
                        ViewComponent={LinearGradient}
                        titleStyle={styles.btnTitle}
                        linearGradientProps={btnGradientProps}
                        title="Continue"
                        onPress = { async() => {
                            this.setState({spinner:true});
                            var res = await uploadBankDetail(this.state);
                            this.setState({spinner:false});
                           
                            if(res != null) {
                               this.props.navigation.navigate('PendingAccount');
                            }
                        }}                        
                    />
                </View>
            </SafeAreaView>
        )
    }
}
