import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Slider } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height:'100%'
    },
    txtPart: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },
});

export default class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            progress: 0,
            indeterminate: true,
        };
    }

    componentDidMount() {       
        let progress = 0;
        console.log(global.user);
        this.setState({ progress });
        setTimeout(() => {
            this.setState({ indeterminate: false });
            var loading = setInterval(() => {
                progress += Math.random() / 20;
                if (progress > 1) {
                    progress = 1;
                    clearInterval(loading);
                    this.props.navigation.navigate('Home');
                }
                this.setState({ progress });
            }, 100);
        }, 500);
    }
    render() {

        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/img/welcome.png')} />                
                <View style={{
                    position: 'absolute', 
                    top: 0, left: 0, 
                    right: 0, bottom: 0, 
                    justifyContent: 'center', 
                    alignItems: 'center'}}>
                <Text style={{color: 'black', fontSize:40, marginTop:140, backgroundColor:'white', width:300, textAlign:'center'}}> {global.user.first_name} </Text>
                </View>          
            </View>
        )

    }
}