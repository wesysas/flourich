import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import SocketIOClient from 'socket.io-client';
import {SERVER_URL} from "../../globalconfig";

export default class ChatBox extends Component {

    constructor(props){
        super(props);

        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.onSend = this.onSend.bind(this);

        this.state={
            messages:[],
            userId:global.creator.cid,
            username:global.creator.first_name + ' ' + global.creator.last_name,
            avatar: SERVER_URL + global.creator.avatar,
            isReady:false,
        };

        this.socket = SocketIOClient('http://10.0.2.2:3000'); //This should be your ip or local
        this.socket.on('messages', this.onReceivedMessage);
        this.socket.on('userId', this.getUserId);
    }

    getUserId(data){
        const { userId } = data;

        this.setState({userId});
    }

    onReceivedMessage(mes){
        const arrMes = [{...mes.messages}];
        let filterMsg = arrMes.filter((msg, key) => msg.from == global.creator.cid || msg.to == global.creator.cid);

        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, filterMsg),
        }));
    }

    onSend(messages){
        const mes = messages[0];
        const { username, avatar } = this.state;
        mes['username'] = username;
        mes['avatar'] = avatar;
        mes['from'] = global.creator.cid;
        mes['to'] = global.booking.from;
        mes['booking_id'] = global.booking.id;
        this.socket.emit('messages',mes)
    }

    render() {
        const { userId, isReady } = this.state;
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={this.onSend}
                onPressAvatar={ (user)=> alert(user.name)}
                user={{
                    _id: userId,
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    textInput:{
        height:50,
        alignSelf:'stretch',
        textAlign:'center',
    },
    textInputContainer:{
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'rgba(0,0,0,0.2)',
        alignSelf:'stretch',
        marginHorizontal:40,
    },
    button:{
        alignSelf:'stretch',
        height:50,
        marginTop:40,
        marginBottom:40,
        marginHorizontal:50,
        backgroundColor:'#778DA9',
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonText:{
        color:'white',
        fontWeight:'400',
        fontSize:18,
    }
});
