import React, { Component } from 'react';
import { StyleSheet,Text,View, SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import SocketIOClient from 'socket.io-client';
import Icon from "react-native-vector-icons/FontAwesome";
import {Avatar} from "react-native-elements";
import {SERVER_URL, CHAT_URL} from "../../globalconfig";
import BackButton from "../../components/BackButton";

export default class ChatBox extends Component {

    constructor(props){
        super(props);

        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.onSend = this.onSend.bind(this);

        this.state={
            messages:[],
            userId:global.user.cid,
            username:global.user.first_name + ' ' + global.user.last_name,
            avatar: SERVER_URL + global.user.avatar,
            isReady:false,
        };

        this.socket = SocketIOClient(CHAT_URL); //This should be your ip or local
        this.socket.on('messages', this.onReceivedMessage);
        this.socket.on('userId', this.getUserId);
    }

    getUserId(data){
        const { userId } = data;
        this.setState({userId});
    }

    onReceivedMessage(mes){
        const arrMes = [{...mes.messages}];
        let filterMsg = arrMes.filter((msg, key) => msg.from == global.user.cid || msg.to == global.user.cid);

        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, filterMsg),
        }));
    }

    onSend(messages){
        const mes = messages[0];
        const { username, avatar } = this.state;
        mes['username'] = username;
        mes['avatar'] = avatar;
        mes['from'] = global.user.cid;
        mes['to'] = global.booking.customer_id;
        mes['booking_id'] = global.booking.id;
        this.socket.emit('messages',mes)
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
                            <Text style={{fontWeight:'bold', fontSize:18}}>{global.booking.first_name} {global.booking.last_name}</Text>
                            <Text>Online Now</Text>
                        </View>
                    </View>
                    <Icon name="phone" size={40} />
                </View>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.onSend}
                    onPressAvatar={ (user)=> alert(user.name)}
                    user={{
                        _id: this.state.userId,
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
