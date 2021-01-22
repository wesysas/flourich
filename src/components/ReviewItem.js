import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        borderBottomColor: 'gray', 
        borderBottomWidth: 1, 
        paddingBottom: 10
    },
    description:{
        paddingHorizontal: 20
    }
});


const ReviewItem = ({ user, description, time }) => {
    return (

        <View style={styles.container}>
            <ListItem>
                <Avatar
                    rounded
                    size="medium"
                    source={require('../assets/img/test.jpg')}
                />
                <ListItem.Content>
                    <ListItem.Title>Argin</ListItem.Title>
                    <ListItem.Subtitle>
                        Last month
                        </ListItem.Subtitle>

                </ListItem.Content>
                <ListItem.Chevron />

            </ListItem>
            <Text style={styles.description}>You are very good supervisor. You are very good supervisor.</Text>
        </View>
    )
}

export default ReviewItem;