import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io';

export default class IdCardScan1 extends Component {

  UNSAFE_componentWillMount() {
    if (Platform.OS === 'ios') {
      CardIOUtilities.preload();
    }
  }

  scanCard() {
    CardIOModule
      .scanCard()
      .then(card => {
        // the scanned card
        console.log(card);
      })
      .catch((err) => {
        // the user cancelled
        console.log(err);
      })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={this.scanCard.bind(this)}>
          <Text>Scan card!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}