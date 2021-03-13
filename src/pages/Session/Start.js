import {Image, Text, StyleSheet, View} from "react-native";
import React from "react";
import ValidationComponent from 'react-native-form-validator';
import { ios_green_color, ios_red_color} from "../../GlobalStyles";
import { CheckBox} from "react-native-elements";
import BackButton from '../../components/BackButton';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height:'100%'
    },
    chbStyle:{
        backgroundColor: 'transparent',
        borderWidth:0,
        alignSelf: 'center',
        width:180
    },
    btnStyle:{
        width:300,
        alignSelf:'center',
        paddingVertical:12,
        borderRadius:5
    }
});

export default class SetupDetail extends ValidationComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View contentContainerStyle={styles.container}>
                <BackButton navigation={this.props.navigation} />
                <Image style={{
                    width:'80%',
                    height:330,
                    marginTop:30,
                    alignSelf: 'center',
                    resizeMode: 'contain',}}
                       source={require('../../assets/img/shot3.png')} />

                <Text style={{
                    textAlign:'center',
                    fontSize: 35,
                    fontWeight: 'bold',
                    color: ios_red_color
                }}>Content creation{"\n"}session has begun.</Text>

                <CheckBox
                    containerStyle ={styles.chbStyle}
                    textStyle={{fontWeight:'normal', color:ios_green_color}}
                    checkedColor={ios_green_color}
                    uncheckedColor={'grey'}
                    checkedIcon='check-square'
                    uncheckedIcon='square-o'
                    title={'Session Started'}
                    checked={true}
                />
                <CheckBox
                    containerStyle ={styles.chbStyle}
                    textStyle={{fontWeight:'normal', color:'grey'}}
                    checkedColor={ios_green_color}
                    uncheckedColor={'grey'}
                    checkedIcon='check-square'
                    uncheckedIcon='square-o'
                    title={'Editing in progress'}
                    checked={false}
                />
                {/*<Button*/}
                    {/*buttonStyle={styles.btnStyle}*/}
                    {/*ViewComponent={LinearGradient}*/}
                    {/*linearGradientProps={btnGradientProps}*/}
                    {/*title="Complete Session"*/}
                    {/*onPress={() => this.props.navigation.navigate('Signup')}*/}
                {/*/>*/}
            </View>
        )
    }
}