import {Image, Text, StyleSheet, View, SafeAreaView, TouchableOpacity} from "react-native";
import React from "react";
import Moment from 'moment';
import ValidationComponent from 'react-native-form-validator';
import {bottomSheetStyle, ios_red_color} from "../../GlobalStyles";
import BackButton from "../../components/BackButton";
import { Slider } from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";


const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        height:'100%',
        justifyContent:'center'
    },
    date: {
        marginVertical: 20,
        marginHorizontal: 20
    },
    subTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 10
    },
    btnStyle:{
        alignItems: 'center',
        backgroundColor:'#f7f9fc',
        paddingVertical:10,
        marginHorizontal:40,
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

export default class SetupDetail extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
        };
        this.RBSheetR = null;
    }

    async componentDidMount() { 
        let progress = 0;
        console.log(global.user);
        this.setState({ progress });
        setTimeout(() => {
            this.setState({ indeterminate: false });
            var loading = setInterval(() => {
                progress += Math.random() / 5;
                this.setState({ progress });
                if (progress > 1) {
                    progress = 1;
                    clearInterval(loading);
                    this.RBSheetR.open();
                }
            }, 100);
        }, 500);
    }

    render() {
        return (
            <SafeAreaView  style={{
                flex: 1, justifyContent:'center'
            }}>
                <BackButton navigation={this.props.navigation} />
                <Image style={{
                    width:'80%',
                    alignSelf: 'center',
                    resizeMode: 'contain'}}
                    source={require('../../assets/img/report.png')} />

                { this.state.progress >= 1 &&<Image style={{    
                    marginTop:-50,                        
                    width:60,
                    alignSelf: 'center',
                    resizeMode: 'contain'}}
                    source={require('../../assets/img/check.png')} />}
                { this.state.progress < 1 &&<View>
                <Text style={{
                    marginTop:-50,
                    textAlign:'center',
                    fontSize: 30,
                    color: ios_red_color
                }}>Generating report</Text>

                <Slider
                    style={{marginHorizontal:40}}
                    value={this.state.progress}
                    maximumTrackTintColor='#c7e0dc' 
                    minimumTrackTintColor='#76c371'
                    trackStyle={{ height:5}}
                    thumbStyle={{ backgroundColor: 'transparent' }}
                    disabled
                /></View>
                }
                <RBSheet
                    ref={ref => {
                        this.RBSheetR = ref;
                    }}
                    height={120}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{ 
                        wrapper: {
                            backgroundColor: "transparent"
                        },
                        container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            borderColor:'lightgrey',
                            borderWidth:1
                        },
                        draggableIcon: {
                            backgroundColor: "lightgrey",
                            width:100
                        }
                    }}
                >
                    <TouchableOpacity style={{marginTop:10}}
                                      onPress={async () => {
                                          this.RBSheetR.close();
                                          this.props.navigation.navigate('Wallet');     
                                        }}
                    >
                        <Text style={styles.btnStyle}>Download report</Text>
                    </TouchableOpacity>
                </RBSheet>
            </SafeAreaView>
        )
    }
}