import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient/index';
import { btnGradientProps } from '../GlobalStyles';
import { checkEmail, resetPassword } from '../shared/service/auth';
import { saveStorage } from '../shared/service/storage';
import ValidationComponent from 'react-native-form-validator';
import { local } from '../shared/const/local';
import Spinner from 'react-native-loading-spinner-overlay';
import BackButton from "../components/BackButton";
import { HEIGHT, DefaultBtnHeight } from '../globalconfig';
import Toast from 'react-native-simple-toast';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 'auto'
    },
    btnContainer: {
        height: HEIGHT / 1.6,
        flexDirection: 'column',
        // justifyContent: 'space-evenly',
        paddingHorizontal: 30,
        marginVertical: 10,
    },
    txtInputStyle: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        paddingHorizontal: 14,
        fontSize: 18,
        height: DefaultBtnHeight,
        marginVertical: 10
    },
    btn: {
        // paddingVertical:14,
        height: DefaultBtnHeight,
        borderRadius: 8,
        marginVertical: 10
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
        alignItems: 'center'
    },
    error: {
        color: 'red'
    }
});

export default class ForgotPassword extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            email: '',//'test9@t.com',
            password: '',//'123123',
            confirmPassword: '',//'123123',
            spinner: false,
            checked: false,
            btnDisabled: false
        }
    }
    componentDidMount() {
    };

    componentWillUnmount() {
    };

    checkEmail = async () => {
        var validate = this.validate({
            email: { email: true, required: true },
            // password: {minlength:6},
            // confirmPassword : {equalPassword : this.state.password}
        });
        if (validate) {
            this.setState({ spinner: true });
            var res = await checkEmail({ email: this.state.email, user: 'creator' });
            console.log(res);
            this.setState({ spinner: false });
            if (res != null && res.message != '401') {
                this.setState({ checked: true })

            } else {
                Toast.show('Your email is not registered')
            }
        }
    }

    resetPassword = async () => {
        var validate = this.validate({
            password: { required: true, minlength: 6 },
            confirmPassword: { required: true, equalPassword: this.state.password }
        });
        if (validate) {
            this.setState({ spinner: true });
            var res = await resetPassword({ email: this.state.email, user: 'creator', password: this.state.password })
            this.setState({ spinner: false });
            if (res != null && res.message != '401') {
                Toast.show('Successfully Updated');
                this.setState({ btnDisabled: true });
                setTimeout(() => {
                    this.props.navigation.navigate('Login');
                }, 1000);
            } else {
                Toast.show('Error Happens');
            }
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                />
                <BackButton navigation={this.props.navigation} />
                <Image style={styles.image} source={require('../assets/img/get_started_logo.jpg')} />
                <View style={styles.btnContainer}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 25, marginVertical:10 }}>Forgot Password
                        </Text>
                    </View>

                    {!this.state.checked && <View>
                        <TextInput
                            style={styles.txtInputStyle}
                            placeholder="email@address.com"
                            value={this.state.email}
                            onChangeText={value => {
                                this.setState({ "email": value });
                            }}
                        ></TextInput>
                        {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage => <Text style={styles.error}>{errorMessage}</Text>)}

                        <Button
                            buttonStyle={styles.btn}
                            ViewComponent={LinearGradient}
                            titleStyle={styles.btnTitle}
                            linearGradientProps={btnGradientProps}
                            title="Continue"
                            onPress={() => {
                                // navigation.navigate('Verify')
                                this.checkEmail();
                            }}
                        />
                    </View>}

                    {this.state.checked && <View>
                        <Text style={{ textAlign: 'center', fontSize: 17 }}>Please Check Your Email.{"\n"}System just sent new password through your email address.{"\n"}
                            <Text
                                style={{ textDecorationLine: 1, color: 'blue' }}
                                onPress={() => {
                                    this.setState({ checked: false });
                                    this.checkEmail();
                                }}>
                                Resend
                    </Text>
                        </Text>
                        <Button
                            buttonStyle={styles.btn}
                            ViewComponent={LinearGradient}
                            titleStyle={styles.btnTitle}
                            linearGradientProps={btnGradientProps}
                            title="Go To Login"
                            disabled={this.state.btnDisabled}
                            onPress={() => {
                                this.props.navigation.navigate('Login');
                            }}
                        />
                    </View>}


                </View>
            </ScrollView>
        )
    }

}