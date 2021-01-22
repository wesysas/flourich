import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import GlobalStyles from '../GlobalStyles';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    image:{
        width: 'auto'
    },
    text:{
        fontSize:25,
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 20,
        color: 'black'
    },
    btnContainer:{
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    btn:{
        width:150,
        borderRadius:8
    },
    btnText:{
        color: 'black'
    }
});

const Index = ({ navigation }) =>{
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/img/login_signup.jpg')} />
            <Text style={styles.text}>Make money on the go{"\n"}doing what you love.</Text>
            <View style={styles.btnContainer}>
            <Button
                    type="outline"
                    buttonStyle={styles.btn}
                    titleStyle={styles.btnText}
                    title="Log In"
                    onPress={() => navigation.navigate('Home')}
                />
                <Button
                    buttonStyle={styles.btn}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ["#c84e77", "#f13e3a"],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                      }}
                    title="Sign Up"
                    onPress={() => navigation.navigate('SignUpStacks')}
                />
            </View>
        </View>
    )
}

export default Index;