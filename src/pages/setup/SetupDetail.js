import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Picker, TextInput } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 30,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black'
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'gray',
        marginVertical: 10
    },
    separate: {
        marginVertical: 20
    },
    btnStyle: {
        width: 90,
        borderRadius: 50,
        borderColor: 'gray',
        margin: 10
    }
});

const SetupDetail = ({navigation}) => {
    const [selectedValue, setSelectedValue] = useState("private_company");
    const [value1, onChangeText1] = useState('100');
    const [value2, onChangeText2] = useState('500');
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{
                marginVertical: 30
            }}>
                <Text style={styles.headerTitle}>Continue Set Up</Text>
                <View style={styles.separate}>
                    <Text>You operate as</Text>
                    <Picker
                        selectedValue={selectedValue}
                        style={{ textAlign: 'right' }}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="Private Company" value="private_company" />
                        <Picker.Item label="Public Business" value="public_business" />
                    </Picker>
                </View>
                <View style={styles.separate}>
                    <Text style={styles.subTitle}>Add you name*</Text>
                    <Text>First Name</Text>
                    <Input placeholder='Leteechia' />

                    <Text>Last Name</Text>
                    <Input placeholder='Rungasamy' />

                    <Text>Business Name</Text>
                    <Input placeholder='Flourich Marketing Ltd' />

                    <Text>Please Upload a valid Identification</Text>

                    <View style={{ flex: 1, alignItems: 'center', borderColor: 'black', padding: 50 }}>
                        <Button
                            buttonStyle={{ width: 200, borderRadius: 50, backgroundColor: 'gray' }}
                            title="Upload ID"
                        />
                    </View>
                    <CheckBox title='I confirmed ID is valid until expiry date.'
                        checked={true} />

                    <Text>Industry/Services</Text>
                    <View style={{
                        flex: 3,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        padding: 10
                    }}>

                        <Button
                            buttonStyle={styles.btnStyle}
                            titleStyle={{
                                color: 'gray'
                            }}
                            title="Photos"
                            type='outline'
                        />

                        <Button
                            buttonStyle={styles.btnStyle}
                            titleStyle={{
                                color: 'gray'
                            }}
                            title="Videos"
                            type='outline'
                        />

                        <Button
                            buttonStyle={styles.btnStyle}
                            titleStyle={{
                                color: 'gray'
                            }}
                            title="Graphics"
                            type='outline'
                        />

                        <Button
                            buttonStyle={styles.btnStyle}
                            titleStyle={{
                                color: 'gray'
                            }}
                            title="Editor"
                            type='outline'
                        />

                        <Button
                            buttonStyle={styles.btnStyle}
                            titleStyle={{
                                color: 'gray'
                            }}
                            title="UGC"
                            type='outline'
                        />

                    </View>
                    <Text>Price Range</Text>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        paddingHorizontal: 20
                    }}>
                        <Text>form</Text>
                        <View>
                            <Text style={{
                                position: 'absolute',
                                left:3,
                                fontSize:18,
                                fontWeight:'bold',
                                zIndex:1,
                                top:7
                            }}>£</Text>
                            <TextInput
                                style={{ height: 40,
                                     borderColor: 'gray', 
                                     borderWidth: 1, 
                                     borderRadius: 5, 
                                     paddingLeft:20,
                                     }}
                                onChangeText={text => onChangeText1(text)}
                                value={value1}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <Text>to</Text>
                        <View>
                            <Text style={{
                                position: 'absolute',
                                left:3,
                                fontSize:18,
                                fontWeight:'bold',
                                color:'white',
                                zIndex:1,
                                top:7
                            }}>£</Text>
                            <TextInput
                                style={{ height: 40,
                                     borderColor: 'gray', 
                                     borderWidth: 1, 
                                     borderRadius: 5, 
                                     paddingLeft:20,
                                     backgroundColor: 'black',
                                      color: "white" }}
                                onChangeText={text => onChangeText2(text)}
                                value={value2}
                                keyboardType={'numeric'}
                            />
                        </View>

                    </View>
                </View>

                <View style={styles.separate}>
                    <Text style={styles.subTitle}>Add your Address*</Text>
                    <Text>Full Address</Text>
                    <Input placeholder='Full address displays here' />
                    <Text>Business or Building Name</Text>
                    <Input placeholder='Business or building name goes here' />
                    <Text>Street Address</Text>
                    <Input placeholder='street address goes here' />
                    <Text>Post Code</Text>
                    <Input placeholder='123456789UK' />
                    <Text>Business Name</Text>
                    <Input placeholder='Flourich Marketing Ltd' />
                </View>

                <View style={styles.separate}>
                    <Text>Website</Text>
                    <Input placeholder='www.flourich.co.uk' />

                    <Text>Instagram URL</Text>
                    <Input placeholder='Instagram Link goes here' />

                    <Text>Linked in (optional)</Text>
                    <Input placeholder='Link to linked in profile goes here' />

                    <Text>Behance (optional)</Text>
                    <Input placeholder='Link to behance profile goes here' />
                </View>

                <Button
                    buttonStyle={{ marginVertical: 20, borderRadius: 8 }}
                    ViewComponent={LinearGradient}
                    titleStyle={styles.btnTitle}
                    linearGradientProps={{
                        colors: ["#c84e77", "#f13e3a"],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    title="Continue"
                    onPress={() => navigation.navigate('Identity')}
                />

            </View>

        </ScrollView>
    )


}

export default SetupDetail;