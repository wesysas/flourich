import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    btnSecondary:{
        borderRadius:15,
        color: 'red',

    },
    error: {
        color:'red'
    }
})
export const btnGradientProps = {
    colors: ["#c84e77", "#f13e3a"],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
};
export const bottomSheetStyle = {
    backgroundColor:"white",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,

    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
};
export const multiBtnGroupStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    alignItems:'center',
    justifyContent:'center'
};


export const ios_red_color = "#eb3f55";
export const ios_green_color = "#1ddb56";