import React, {  useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Picker, TextInput } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient/index';
import Cardscan from 'react-native-cardscan';
import { CardView } from 'react-native-credit-card-input';

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
        marginVertical: 10, borderRadius: 8
    }
});

const Identity = ({ navigation }) => {
    const [compatible, setCompatible] = useState(null);
    const [card, setCard] = useState(null);
    const [recentAction, setRecentAction] = useState('none');

    const scanCard = useCallback(async () => {
        const { action, scanId, payload, canceledReason } = await Cardscan.scan();
        setRecentAction(action);
        if (action === 'scanned') {
            var issuer = payload.issuer || '??';
            if (issuer === 'MasterCard') {
                issuer = 'master-card';
            } else if (issuer === 'American Express') {
                issuer = 'american-express';
            } else {
                issuer = issuer.toLowerCase();
            }
            setCard({
                number: payload.number,
                expiryDay: payload.expiryDay || '',
                expiryMonth: payload.expiryMonth || '??',
                expiryYear: payload.expiryYear || '??',
                issuer: issuer,
                cvc: payload.cvc || '??',
                cardholderName: payload.cardholderName || '??',
                error: payload.error || ''
            });
        }

        if (action === 'canceled') {
            if (canceledReason === 'enter_card_manually') {
                alert('Enter card manually');
            }

            if (canceledReason === 'user_canceled') {
                alert('User canceled scan');
            }

            if (canceledReason === 'camera_error') {
                alert('Camera error during scan');
            }

            if (canceledReason === 'fatal_error') {
                alert('Processing error during scan');
            }

            if (canceledReason === 'unknown') {
                alert('Unknown reason for scan cancellation');
            }
        }
    }, [setCard, setRecentAction]);

    const checkCompatible = useCallback(async () => {
        const isCompatible = await Cardscan.isSupportedAsync();
        setCompatible(isCompatible);
    }, [setCompatible]);

    useEffect(() => {
        checkCompatible();
    }, []);

    const [selectedValue, setSelectedValue] = useState("uk");
    const [value1, onChangeText1] = useState('100');
    const [value2, onChangeText2] = useState('500');
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{
                marginVertical: 30
            }}>
                <Text style={styles.headerTitle}>Continue Set Up</Text>
                <View style={styles.separate}>
                    <Text style={styles.subTitle}>Select the type of ID to proceed</Text>
                    <Text>Country</Text>
                    <Picker
                        selectedValue={selectedValue}
                        style={{ textAlign: 'right' }}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="United Kingdom" value="uk" />
                        <Picker.Item label="France" value="fr" />
                    </Picker>
                </View>

                <View style={styles.separate}>
                    <Button
                        buttonStyle={styles.btnStyle}
                        ViewComponent={LinearGradient}
                        titleStyle={styles.btnTitle}
                        linearGradientProps={{
                            colors: ["#c84e77", "#f13e3a"],
                            start: { x: 0, y: 0.5 },
                            end: { x: 1, y: 0.5 },
                        }}
                        title="Identity Card"
                        onPress={scanCard}
                    />
                    <Button
                        buttonStyle={styles.btnStyle}
                        titleStyle={styles.btnTitle}
                        title="Passport"
                        type="outline"
                        // () => navigation.navigate('IdCardScan')
                        onPress={() => {}}
                    />
                    <Button
                        buttonStyle={styles.btnStyle}
                        titleStyle={styles.btnTitle}
                        title="Drivers License"
                        type="outline"
                        onPress={() => navigation.navigate('PendingAccount')}
                    />
                </View>
                {card &&
                    <View style={{ margin: 20, flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                    <CardView
                        number={card.number}
                        expiry={`${card.expiryMonth.padStart(2, '0')}/${card.expiryYear.slice(-2)}`}
                        brand={card.issuer.toLowerCase()}
                        name={card.cardholderName}
                        cvc={card.cvc}
                    />
                    </View>
                }

                <View style={{ marginVertical: 20, alignItems: 'center' }}>
                    <Text>For security reasons, you will be required</Text>
                    <Text>to complete the verification process within 10 minutes</Text>
                </View>

            </View>

        </ScrollView>
    )


}

export default Identity;