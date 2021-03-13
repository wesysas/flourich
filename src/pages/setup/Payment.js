import React, { Component  } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import { btnGradientProps } from '../../GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        marginVertical: 10
    },
    separate: {
        marginVertical: 20
    },
    btnStyle: {
        marginVertical: 10, borderRadius: 8
    }
});

export default class Identity extends Component {
    constructor(props) {
        super(props);        
    }

    render() {
        return (
            <SafeAreaView>
            <ScrollView style={styles.container}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={styles.headerTitle}>Continue Set Up</Text>
                    <Button
                        type="clear"
                        titleStyle={{ color: 'gray',textDecorationLine: 'underline', fontSize:15}}
                        title="Skip"
                        onPress={() => {
                            this.props.navigation.navigate('Home');
                        }}
                    />
                </View>
                <View style={styles.separate}>
                    <Text style={styles.subTitle}>Add account details</Text>
                </View>

                <View style={styles.separate}>
                    <Button
                        buttonStyle={styles.btnStyle}
                        ViewComponent={LinearGradient}
                        titleStyle={styles.btnTitle}
                        linearGradientProps={btnGradientProps}
                        title="Add Bank Details"
                        onPress = {() => {
                            this.props.navigation.navigate('BankDetail');
                        }}                        
                    />                
                    <Button
                        icon={
                            <Icon
                                name="wallet-outline"
                                size={25}
                                color="gray"
                            />
                        }
                        type="outline"
                        buttonStyle={{ 
                            borderRadius: 8, 
                            borderColor: 'gray' ,
                            marginVertical:10
                        }}
                        titleStyle={{ color: 'gray', marginLeft:5 }}
                        iconContainerStyle={styles.btnIcon}
                        iconLeft
                        title="Flourich Wallet"
                        onPress={() => {}}
                    />
                </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
