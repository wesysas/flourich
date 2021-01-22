import React, { useState } from 'react';
import { View, Text, Picker, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Button, SocialIcon, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../GlobalStyles';
import { RectButton } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient/index';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 'auto'
    },
    btnContainer: {
        flexGrow: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 30,
        marginVertical: 10
    },
    btn: {
        borderRadius: 8
    },
    btnText: {
        fontSize: 20
    },
    btnIcon: {
        flex: 0,
        color: 'black',
        margin: 25
    },
    numberPart: {
        flexDirection: 'row',
        alignItems:'center'
    }
});

const LoginPage = ({ navigation }) => {
    const [selectedValue, setSelectedValue] = useState("java");
    const [value, onChangeText] = useState('');
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/img/get_started_logo.jpg')} />
            <ScrollView contentContainerStyle={styles.btnContainer}>
                <Text style={{ textAlign: 'center' }}>create a account to continue</Text>
                <Button
                    icon={
                        <Icon
                            name="google"
                            size={25}
                            color="black"
                        />
                    }
                    type="outline"
                    buttonStyle={{ justifyContent: 'space-evenly', paddingHorizontal: 55, borderRadius: 8, borderColor: 'black' }}
                    titleStyle={{ color: 'black' }}
                    iconContainerStyle={styles.btnIcon}
                    iconLeft
                    title="Connect with Google"
                />
                <Button
                    icon={
                        <Icon
                            name="apple"
                            size={25}
                            color="white"
                        />
                    }
                    buttonStyle={{ backgroundColor: 'black', justifyContent: 'space-evenly', paddingHorizontal: 55, borderRadius: 8 }}

                    iconContainerStyle={styles.btnIcon}
                    title="Connect with Apple"
                />

                <Button
                    icon={
                        <Icon
                            name="facebook-square"
                            size={25}
                            color="white"
                        />
                    }
                    // type="outline"
                    color="blue"
                    buttonStyle={{ backgroundColor: '#39559f', justifyContent: 'space-evenly', paddingHorizontal: 55, borderRadius: 8 }}
                    titleStyle={styles.btnTitle}
                    iconContainerStyle={styles.btnIcon}
                    iconLeft
                    title="Connect with Facebook"
                />
                <Text style={{ textAlign: 'center', paddingTop: 10 }}>or use your phone number</Text>
                <View style={styles.numberPart}>
                    <View style={{
                        width:30,
                        height:30,
                        backgroundColor:'black',
                        borderRadius:15
                    }}>
                    </View>
                    <Picker
                        selectedValue={selectedValue}
                        style={{ width: 100 }}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="+01" value="01"/>
                        <Picker.Item label="+02" value="02" />
                    </Picker>
                    <TextInput
                        style={{ borderColor: 'gray', fontSize: 20 }}
                        onChangeText={text => onChangeText(text)}
                        value={value}
                        placeholder="Enter Phone Number"
                        keyboardType={'numeric'}
                    />
                </View>

                <Button
                    buttonStyle={styles.btn}
                    ViewComponent={LinearGradient}
                    titleStyle={styles.btnTitle}
                    linearGradientProps={{
                        colors: ["#c84e77", "#f13e3a"],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    title="Continue"
                    onPress={()=>navigation.navigate('Verify')}
                />
            </ScrollView>
        </View>
    )
}

export default LoginPage;