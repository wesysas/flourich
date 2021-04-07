import React, { Component } from 'react';
import { StyleSheet,Text,View, SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Icon from "react-native-vector-icons/FontAwesome";
import {Avatar} from "react-native-elements";
import {SERVER_URL} from "../../globalconfig";
import BackButton from "../../components/BackButton";
import {getMessage, leaveChat} from "../../shared/service/api";

export default class ChatBox extends Component {

    constructor(props){
        super(props);
        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.onSend = this.onSend.bind(this);

        this.state={
            messages:[],
            username:global.user.first_name + ' ' + global.user.last_name,
            avatar: SERVER_URL + global.user.avatar,
            isReady:false,
        };
        
        global.socket.on('messages', this.onReceivedMessage);
    }

    onReceivedMessage(mes){
        const arrMes = [{...mes.messages}];
        let filterMsg = arrMes.filter((msg, key) => msg.booking_id == global.booking.bid);

        filterMsg = filterMsg.map((m, key) => { 
            if (m.from == "creator"+global.user.cid) m.user._id = "creator"+global.user.cid;
            return m;
        });
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, filterMsg),
        }));
    }

    onSend(messages){
        const mes = messages[0];
        const { username, avatar } = this.state;
        mes['username'] = username;
        mes['avatar'] = avatar;
        mes['from'] = "creator"+global.user.cid;
        mes['to'] = "customer"+global.booking.customer_id;
        mes['booking_id'] = global.booking.bid;
        global.socket.emit('messages',mes)
    }

    async componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            var message_result = await getMessage({booking_id:global.booking.bid});
            if (message_result && message_result.length>0){
                var stored_messages = JSON.parse('[' + message_result[0].text.substring(1) + ']');
                var messages = stored_messages.map((m, key) => { 
                    if (m.from == "creator"+global.user.cid) m.user._id = "creator"+global.user.cid;
                    return m;
                });
                messages.reverse();
                this.setState({messages});                
            }
        });
        this._unsubscribe = this.props.navigation.addListener('blur', async () => {
            var result = await leaveChat({booking_id:global.booking.bid});
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        return (
            <SafeAreaView style={{height:'100%'}}>
                <BackButton navigation={this.props.navigation} />
                <View style={styles.topbarStyle}>
                    <View style={{flexDirection:'row'}}>
                        <Avatar
                            rounded
                            size="medium"
                            source={{uri: SERVER_URL+global.booking.avatar}}
                        />
                        <View style={{justifyContent:'center', marginLeft:10}}>
                            <Text style={{fontWeight:'bold', fontSize:18}}>{global.booking.first_name}</Text>
                            <Text>{global.booking.login_status =='on'?'Online Now':'Offline Now'}</Text>
                        </View>
                    </View>
                    <Icon name="phone" size={40} />
                </View>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.onSend}
                    onPressAvatar={ (user)=> alert(user.name)}
                    user={{
                        _id: 'creator'+global.user.cid,
                    }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    topbarStyle:{
        flexDirection: 'row', justifyContent: 'space-between',
        paddingLeft:100, paddingVertical:20,paddingRight:30, borderBottomWidth: 1,
        paddingBottom: 10, borderBottomColor: 'lightgray', alignItems: 'center'
    },
});
