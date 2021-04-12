import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { btnGradientProps } from '../GlobalStyles';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import { getCurrentUser } from '../shared/service/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { WIDTH, DefaultBtnHeight } from '../globalconfig';
import Toast from 'react-native-simple-toast';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
        }
    }
    
    onClickLoginBtn = async () => {
        this.setState({ spinner: true })
        var user = await getCurrentUser();
        this.setState({ spinner: false })
        if (user) {
            global.user = user;
            Toast.show('Your Session is Existing Now.', Toast.SHORT);
            this.props.navigation.navigate('Home');
        } else {
            Toast.show('There\'s no Session.', Toast.SHORT);
            this.props.navigation.navigate('Login');
        }
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={"Checking Your Session \n Just Minutes ..."} 
                    textStyle={{color:'white', textAlign:'center'}}
                    />
                <Image style={styles.image} source={require('../assets/img/login_signup.jpg')} />
                <View style={styles.container}>
                    <Text style={styles.text}>Make money on the go{"\n"}doing what you love.</Text>
                    <View style={styles.btnContainer}>
                        <Button
                            type="outline"
                            buttonStyle={[styles.btn, { borderColor: 'black' }]}
                            titleStyle={styles.btnText}
                            title="Log In"
                            onPress={() => this.onClickLoginBtn()}
                        />
                        <Button
                            buttonStyle={styles.btn}
                            ViewComponent={LinearGradient}
                            linearGradientProps={btnGradientProps}
                            title="Sign Up"
                            onPress={() => this.props.navigation.navigate('Signup')}
                        />
                    </View>

                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: isIphoneX() ? 30 : 0,
    },
    image: {
        flex: 2.5,
        width: '100%',
        resizeMode: 'cover',
    },
    text: {
        fontSize: 28,
        textAlign: 'center',
        padding: 20,
        color: 'black'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    btn: {
        width: WIDTH / 2.5,
        borderRadius: 8,
        height: DefaultBtnHeight
    },
    btnText: {
        color: 'black'
    }
});
