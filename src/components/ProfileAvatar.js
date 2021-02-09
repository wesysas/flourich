import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SERVER_URL } from '../globalconfig';

const ProfileAvatar = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Avatar
                rounded
                size="xlarge"
                avatarStyle={styles.avatar}
                containerStyle={styles.avatarContainer}
                source={require('../assets/img/test.jpg')}
                source={{uri: SERVER_URL+ global.user.avatar }}
            />
            <View style={styles.markContainer}>
                <Icon name="star" color="green" size={15} />
                <Text>4.5 (123)</Text>
            </View>
        </View>
    )
}

export default ProfileAvatar;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 30,
        bottom: -70,
    },
    avatar: {
        borderColor: 'white',
        borderWidth: 3
    },
    avatarContainer: {
        padding: 10
    },
    markContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'white',
        bottom: 0,
        width: 100,
        borderRadius: 10,
        borderColor: 'transparent',
        borderWidth: 1,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.9,
        shadowRadius: 8,
        elevation: 1,
        padding: 2
    }
});