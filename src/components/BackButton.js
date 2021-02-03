import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

const styles = StyleSheet.create({
    btnStyleW: {
        position: 'absolute',
        width: 50,
        height: 50,
        zIndex: 1,
        borderRadius: 25,
        backgroundColor: "white",
        alignItems: 'center',
        left: 25,
        top: 25,
    },
    btnStyleB: {
        position: 'absolute',
        width: 50,
        height: 50,
        zIndex: 1,
        borderRadius: 25,
        backgroundColor: "gray",
        alignItems: 'center',
        left: 25,
        top: 25,
    }

});


const BackButton = ({ navigation, iconColor="black" }) => {
    return (

        <Button
            type="clear"
            containerStyle={iconColor=="black"? styles.btnStyleW : styles.btnStyleB}
            icon={( <Icon name="arrow-left" size={30}  color={iconColor}/> )}
            onPress={()=>navigation.goBack(null)}
        />
    )
}

export default BackButton;