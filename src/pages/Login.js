import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient/index';
import BackButton from "../components/BackButton";
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { loginWithGoogle, loginWithEmail} from '../shared/service/auth';
import { getMe } from '../shared/service/api';
import { saveStorage } from '../shared/service/storage';
import ValidationComponent from 'react-native-form-validator';
import { local } from '../shared/const/local';
import Spinner from 'react-native-loading-spinner-overlay';
import {btnGradientProps} from "../GlobalStyles";
import { isIphoneX } from "react-native-iphone-x-helper";
import { HEIGHT, DefaultBtnHeight } from '../globalconfig';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 'auto'
    },
    btnContainer: {
        height:HEIGHT / 1.6,
        flexDirection:'column',
        justifyContent: 'space-evenly',
        paddingHorizontal: 30,
        marginVertical: 10,
    },
    txtInputStyle: {
        borderWidth:1, 
        borderRadius:10, 
        borderColor:'gray', 
        padding:14, 
        fontSize: 18, 
    },
    touchableBtn:{
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        justifyContent:'center',
        borderRadius: 8,
        borderWidth: 1,
        height: DefaultBtnHeight,
        marginBottom:10
    },
    btn: {
        paddingVertical:14,
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

export default class LoginPage extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            spinner:false,
        }
            // const [selectedValue, setSelectedValue] = useState("java");
        // const [value, onChangeText] = useState('');
    }
    componentDidMount() {
        // GoogleSignin.configure({
        //     webClientId: googleConfig.clientID,
        //     offlineAccess: false,
        // });
    };
    
    componentWillUnmount() {
        // Remove event listener
    };

    _loginWithGoogle = async()=> {
        try{
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            //console.log(userInfo);
            // {
            //     idToken: string,
            //     serverAuthCode: string,
            //     scopes: Array<string>, // on iOS this is empty array if no additional scopes are defined
            //     user: {
            //       email: string,
            //       id: string,
            //       givenName: string,
            //       familyName: string,
            //       photo: string, // url
            //       name: string // full name
            //     }
            //   }
            var res = await loginWithGoogle({"googletoken":userinfo.idToken});
            if(res != null) {
                // go next page
                await saveStorage(local.isLogin, 'true');
                await saveStorage(local.token, res.token);
                await saveStorage(local.user, JSON.stringify(res.user));
                global.user = JSON.stringify(res.user);
                this.props.navigation.navigate('Home');
            }
        }catch(error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // when user cancels sign in process,
                var res = await loginWithGoogle({"googletoken":'userinfo.idToken'});
                if(res != null) {
                    // go next page
                    await saveStorage(local.isLogin, 'true');
                    await saveStorage(local.token, res.token);
                    await saveStorage(local.user, JSON.stringify(res.user));
                    this.props.navigation.navigate('Home');
                }
                alert('Process Cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // when in progress already
              alert('Process in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // when play services not available
              alert('Play services are not available');
            } else {
              // some other error
              alert('Something else went wrong... ', error.toString());
            //   setError(error);
            }
        }
    }

    // need to check
    // _loginWithFacebook = async() => {
    //     LoginManager.logInWithPermissions(["public_profile"]).then(
    //         function(result) {
    //           if (result.isCancelled) {
    //             console.log("Login cancelled");
    //             alert('login cancelled')
    //           } else {
    //             console.log(
    //               "Login success with permissions: " +
    //                 result.grantedPermissions.toString()
    //             );
    //             AccessToken.getCurrentAccessToken().then(accessToken =>
    //                 console.log(accessToken),
    //                );
    //           }
    //         },
    //         function(error) {
    //           console.log("Login fail with error: " + error);
    //         }
    //     );
    // }
    _loginWithEmail = async() => {
        var validate = this.validate({
            email: {required:true, email: true},
            password: { required: true,minlength:6},
        });
        if(validate) {
            console.log("----trying to login----");
            this.setState({spinner: true});
            var res = await loginWithEmail(this.state);
            this.setState({spinner: false});
            if(res != null) {
                // go next page
                await saveStorage(local.isLogin, 'true');
                await saveStorage(local.token, res.token);
                await saveStorage(local.user, JSON.stringify(res.user));
                global.user = res.user;
                var userid = res.user.cid;
                this._getMe(userid);
                console.log("----trying to login----");
            }
        }
    }

    /**
     * This is redundent function.
     * Can optimize with login function by getting user with user profile.
     */
    _getMe = (userid) => {
        this.setState({spinner: true});
        var data = {userid: userid};
        getMe(data).then( data => {
            console.log(data);
            this.setState({spinner: false});
            if(data != null ){
                var confirm_approved = data.confirm_approved;
                var approved = data.approved;
                var finish_setup = data.finish_setup;

                this.props.navigation.navigate("Home");
                // if(confirm_approved == 1) {
                //     this.props.navigation.navigate("Home");
                // }else if( approved == 1){
                //     // get verify code
                //     this.props.navigation.navigate("Verify");
                // }else if(finish_setup == 1){
                //     // else get finish, go to pending
                //     this.props.navigation.navigate("SignUpStacks", {screen: "PendingAccount"});
                // }
            }
        })
    }

    render() {
        // const { user } = this.state;
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
                    <Text style={{ textAlign: 'center' }}>New User?   
                        <Text 
                            style={{ 
                                color:'#03489c',
                            }}
                            onPress={()=> {
                                this.props.navigation.navigate('Signup',{transition:'vertical'})
                            }}
                            > Create an account
                        </Text>
                    </Text>
                </View>

                <TextInput
                    style={styles.txtInputStyle}
                    placeholder="Email"
                    value={this.state.email}
                    onChangeText={value => {
                        this.setState({"email":value});
                    }}
                ></TextInput>
                {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage => <Text style={styles.error}>{errorMessage}</Text>) }

                <TextInput
                    style={styles.txtInputStyle}
                    placeholder="Password"
                    value={this.state.password}
                    onChangeText={value => {
                        this.setState({"password":value});
                    }}
                    secureTextEntry={true}
                ></TextInput>
                {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage => <Text style={styles.error}>{errorMessage}</Text>) }

                <View>
                    <Button
                    buttonStyle={ styles.btn }
                        titleStyle={styles.btnTitle}
                        ViewComponent={LinearGradient}
                        linearGradientProps={btnGradientProps}
                        title="Continue"
                        onPress={() => {
                            this._loginWithEmail();
                        }}
                    />
                </View>
                <Text style={{ marginVertical:10, textAlign:'center'}}>Or</Text>

                <TouchableOpacity
                    style={styles.touchableBtn}
                    onPress={() => this._loginWithGoogle()}
                >
                    <Image
                        style={{
                            position:'absolute',
                            left:10,
                            resizeMode: 'contain'
                        }}
                        source={require('../assets/img/google.png')} />
                    <Text>Connect with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[{backgroundColor:'black'}, styles.touchableBtn]}
                    onPress={() => {}}
                >
                    <Icon style={{
                            position:'absolute',
                            left:12
                        }}
                            name="apple"
                            size={25}
                            color="white"
                        />
                    <Text style={{color:'white'}}>Connect with Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[{backgroundColor:'#39559f'}, styles.touchableBtn]}                        
                    onPress={() => {}}
                >
                    <Icon style={{
                            position:'absolute',
                            left:12
                        }}
                            name="facebook-square"
                            size={25}
                            color="white"
                        />
                    <Text style={{color:'white'}}>Connect with Facebook</Text>
                </TouchableOpacity>   
            </View>
        </ScrollView>
        )
    }

}