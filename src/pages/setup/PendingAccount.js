import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Slider } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 'auto'
    },
    txtPart: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },
});

export default class PendingAccount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            progress: 0,
            indeterminate: true,
        };
    }

    componentDidMount() {       
        let progress = 0;
        this.setState({ progress });
        setTimeout(() => {
            this.setState({ indeterminate: false });
            var loading = setInterval(() => {
                progress += Math.random() / 20;
                if (progress > 1) {
                    progress = 1;
                    clearInterval(loading);
                    this.props.navigation.navigate('Welcome');
                }
                this.setState({ progress });
            }, 100);
        }, 500);
    }
    render() {

        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/img/pending.jpg')} />
                <View style={styles.txtPart}>
                    <Text style={{ fontSize: 30, fontWeight: '500', color: '#000022', marginBottom:10 }}>{global.user.first_name}</Text>
                    <Text style={{ textAlign: 'center' }}>Your profile verification is pending. We will inform you when complete in 1-2 business days</Text>

                </View>
                <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', marginHorizontal: 30 }}>
                    <Slider
                        value={this.state.progress}
                        maximumTrackTintColor='#c7e0dc' 
                        minimumTrackTintColor='#76c371'
                        trackStyle={{ height:8}}
                        thumbStyle={{ backgroundColor: 'transparent' }}
                        disabled
                    // onValueChange={(value) => this.setState({ value })}
                    />
                    {/* <Text>Value: {this.state.value}</Text> */}
                </View>
            </View>
        )

    }
}