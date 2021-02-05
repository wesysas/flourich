import AsyncStorage from '@react-native-community/async-storage';
import { local } from '../const/local';
  export const saveStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, data)
      return true;
    } catch (e) {
        return false;
    }
  }

  export const getStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (e) {
        return null;
    }
  }

  export const getUserId = async () => {
    try{
      var currentuser = await AsyncStorage.getItem(local.user);
      var user = JSON.parse(currentuser);
      var userid = user.cid;
      return userid;
    }catch(e) {
      return null;
    }
  }