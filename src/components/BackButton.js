import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

const styles = StyleSheet.create({
    btnStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        zIndex: 1,
        borderRadius: 25,
        backgroundColor: "white",
        alignItems: 'center',
        left: 25,
        top: 25
    }
});


const BackButton = ({ navigation }) => {
    return (

        <Button
            type="clear"
            containerStyle={styles.btnStyle}
            icon={( <Icon name="arrow-left" size={30} /> )}
            onPress={()=>navigation.goBack(null)}
        />
    )
}

export default BackButton;