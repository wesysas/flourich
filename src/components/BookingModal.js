import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import { Card, Button, CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {updateBooking} from "../shared/service/api";
import {SERVER_URL} from "../globalconfig";
import Moment from 'moment';
import Popover from "react-native-popover-view";
import {ios_green_color} from "../GlobalStyles";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const IconText = ({ iconName, size, txt }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={iconName} size={size} />
            <Text style={{ paddingLeft: 5}}>{txt}</Text>
        </View>
    );
};
const CustomCheckBox = ({ title, checked, onPress }) => {
    return (
        <CheckBox
            containerStyle ={{backgroundColor: 'transparent', borderWidth:0}}
            textStyle={{fontWeight:'normal', color:checked?ios_green_color:'grey'}}
            checkedColor={ios_green_color}
            uncheckedColor={'grey'}
            checkedIcon='check-square'
            uncheckedIcon='square-o'
            title={title} checked={checked}
            onPress={onPress}
        />
    );
};

const styles = StyleSheet.create({
    new: {
        flex: 1,
        flexDirection: 'row'
    },
    newImage: {
        width: 100,
        height: 100,
        borderRadius: 5
    },
    newSideTxt: {
        flexDirection: 'column',
        paddingLeft: 20
    },
    name: {
        fontSize: 18,
        marginVertical: 10
    },
    title: {
        fontSize: 15,
        marginVertical: 10
    },
    summaryTxt: {
        fontSize: 13
    },
    desc: {
        fontSize: 12,
        color:'grey'
    },
});

const BookingModal = ({ parent }) => {
    return (
        <Popover
            isVisible={parent.state.showPopover}
            onRequestClose={() => parent.setState({ showPopover: false })}>
            <Card containerStyle={{margin:0, borderWidth: 0}}>
                <View style={styles.new}>
                    <Image
                        style={styles.newImage}
                        resizeMode="cover"
                        source={{uri: SERVER_URL+parent.state.booking.avatar}}
                    />
                    <View style={styles.newSideTxt}>
                        <Text style={styles.name}>{parent.state.booking.first_name} {parent.state.booking.last_name}</Text>
                        <IconText iconName="map-marker" size={15} txt={parent.state.booking.customer_location} />
                        <Text style={styles.summaryTxt}>{Moment(parent.state.booking.start_at).format(("D MMM"))}  |  {Moment(parent.state.booking.start_at).format(("HH:mm"))}  |  £ {parent.state.booking.price}</Text>
                    </View>
                </View>
                <View>
                    {parent.state.booking.service_type&&<Text style={styles.title}>{parent.state.booking.service_type.replace(",", " - ")}</Text>}
                    <Text style={styles.desc}>
                        {parent.state.booking.content}
                    </Text>
                </View>
                {parent.state.check_type=='accept'&&
                <View style={{ flexDirection: 'row', alignItems:'center', marginVertical:20 }}>
                    <Text style={styles.title}>Insert your ETA</Text>
                    <Button
                        titleStyle={{
                            color: '#696969',
                            paddingVertical:0
                        }}
                        containerStyle={{
                            borderColor:'grey',
                            borderWidth:1, paddingHorizontal:20, paddingVertical:0, marginLeft:30
                        }}
                        type='clear'
                        title={Moment(parent.state.from_time).format('HH:mm')}
                        onPress={() => {
                            parent.setState({isFromTimePickerVisible:true});
                        }}
                    />
                    <DateTimePickerModal
                        isVisible={parent.state.isFromTimePickerVisible}
                        date={parent.state.from_time}
                        mode="time"
                        is24Hour={true}
                        onConfirm={(date) => {
                            parent.setState({isFromTimePickerVisible:false});
                            parent.setState({from_time:date});
                        }}
                        onCancel={() => {
                            parent.setState({isFromTimePickerVisible:false});
                        }}
                    />
                </View>}
                {parent.state.check_type=='postpone'&&

                <View>
                    <Text style={{fontSize:18, textAlign:'center', marginTop:20}}>Availability</Text>
                    <Button
                        titleStyle={{
                            color: '#696969',
                            paddingVertical:0
                        }}
                        containerStyle={{
                            borderColor:'grey',
                            borderWidth:0, paddingHorizontal:20
                        }}
                        type='clear'
                        title={Moment(parent.state.from_time).format('ddd D MMM')}
                        onPress={() => {
                            parent.setState({isDatePickerVisible:true});
                        }}
                    />
                    <DateTimePickerModal
                        isVisible={parent.state.isDatePickerVisible}
                        date={parent.state.from_time}
                        mode="date"
                        onConfirm={(date) => {
                            parent.setState({isDatePickerVisible:false});
                            parent.setState({from_time:date});
                            parent.setState({isFromTimePickerVisible:true});
                        }}
                        onCancel={() => {
                            parent.setState({from_time:date});
                            parent.setState({isDatePickerVisible:false});
                        }}
                    />
                    <View style={{ flexDirection: 'row', alignItems:'center',justifyContent:'center' }}>
                        <Text style={styles.title}>from</Text>
                        <Button
                            titleStyle={{
                                color: '#696969',
                                paddingVertical:0
                            }}
                            containerStyle={{
                                borderColor:'grey',
                                borderWidth:0, paddingHorizontal:20
                            }}
                            type='clear'
                            title={Moment(parent.state.from_time).format('HH:mm')}
                            onPress={() => {
                                parent.setState({isFromTimePickerVisible:true});
                            }}
                        />
                        <DateTimePickerModal
                            isVisible={parent.state.isFromTimePickerVisible}
                            date={parent.state.from_time}
                            mode="time"
                            is24Hour={true}
                            onConfirm={(date) => {
                                parent.setState({isFromTimePickerVisible:false});
                                parent.setState({from_time:date});
                                parent.setState({to_time:date});
                                parent.setState({isToTimePickerVisible:true});
                            }}
                            onCancel={() => {
                                parent.setState({isFromTimePickerVisible:false});
                            }}
                        />
                        <Text style={styles.title}>to</Text>
                        <Button
                            titleStyle={{
                                color: '#696969',
                                paddingVertical:0
                            }}
                            containerStyle={{
                                borderColor:'grey',
                                borderWidth:0, paddingHorizontal:20
                            }}
                            type='clear'
                            title={Moment(parent.state.to_time).format('HH:mm')}
                            onPress={() => {
                                parent.setState({isToTimePickerVisible:true});
                            }}
                        />
                        <DateTimePickerModal
                            isVisible={parent.state.isToTimePickerVisible}
                            date={parent.state.to_time}
                            mode="time"
                            is24Hour={true}
                            onConfirm={(date) => {
                                parent.setState({isToTimePickerVisible:false});
                                parent.setState({to_time:date});
                            }}
                            onCancel={() => {
                                parent.setState({isToTimePickerVisible:false});
                            }}
                        />
                    </View></View>}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <CustomCheckBox title='Accept' checked={parent.state.booking.status_id==3?true:false}
                                    onPress={async () => {
                                        if (parent.state.check_type=='accept'){
                                            var booking = parent.state.booking;
                                            booking.status_id = 3;
                                            parent.setState({booking});

                                            var bookings = parent.state.bookings;
                                            var index = bookings.findIndex(function(c) {
                                                return c.bid == booking.bid;
                                            });

                                            bookings[index].status_id = 3;
                                            bookings[index].eta = parent.state.from_time;
                                            parent.setState({bookings});
                                            parent.setState({ showPopover: false });
                                            var newBooking = await updateBooking({booking:bookings[index]});

                                        }
                                    }}
                    />
                    <CustomCheckBox title='Decline' checked={parent.state.booking.status_id==10?true:false}/>
                    <CustomCheckBox title='Postpone' checked={parent.state.booking.status_id==2?true:false}
                                    onPress={async () => {
                                        if (parent.state.check_type=='postpone'){
                                            var booking = parent.state.booking;
                                            booking.status_id = 2;
                                            parent.setState({booking});

                                            var bookings = parent.state.bookings;
                                            var index = bookings.findIndex(function(c) {
                                                return c.bid == booking.bid;
                                            });

                                            bookings[index].status_id = 2;
                                            bookings[index].postpone_from = parent.state.from_time;
                                            bookings[index].postpone_to = parent.state.to_time;
                                            parent.setState({bookings});
                                            parent.setState({ showPopover: false });
                                            var newBooking = await updateBooking({booking:bookings[index]});
                                        }
                                    }}
                    />
                </View>
            </Card>
        </Popover>
    )
}

export default BookingModal;
