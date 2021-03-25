import {Dimensions} from "react-native";
export const API_URL = 'http://10.99.4.49:4000/api';
export const SERVER_URL = 'http://10.99.4.49:4000/';
// export const API_URL = 'http://leti.flourich.co.uk/api';
// export const SERVER_URL = 'http://leti.flourich.co.uk/';

export const facebook = {
    clientID: 'INSERT-CLIENT-ID-HERE',
    clientSecret: 'INSERT-CLIENT-SECRET-HERE',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'name', 'displayName', 'picture', 'email'],
};
export const googleConfig = {
    clientID: '480486651054-nl4a9102sg8o379st8nts3qmr5kv2c30.apps.googleusercontent.com',
    clientSecret: 'zajv66K53Yj7PAqRxEyIydLb',
    callbackURL: 'http://localhost:4000/api/auth/google/callback',
};
export const GOOGLE_MAPS_APIKEY = 'AIzaSyAKXQN4GlcQgn3qmtsZDpFCuVHqtkf4whk';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
export const ASPECT_RATIO = WIDTH / HEIGHT;
export const DefaultBtnHeight = 50;

export const LATITUDE_DELTA = 0.14;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const LATITUDE = 51.51787711384368;
export const LONGITUDE = -0.12632345145763088;