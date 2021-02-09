
import axios from 'axios';
import {API_URL} from '../../globalconfig';
import { saveStorage, getStorage } from './storage';
import { local } from '../const/local';

const _post = async (url, data)=> {
    const token = await getStorage('@token');
    const options = {
        headers: {'Authorization': `Bearer ${token}`},
      };
    return new Promise((resolve, reject) =>{
        axios.post(API_URL + url, data, options)
            .then(response => {
                resolve(response.data);
          }).catch(error => {
              reject(error);
            });

    });
} 

const _handleError = (err) => {

    if( err.response == null) {
        alert(err);
    }else{
        const message = err.response.data.message;
        const status = err.response.status;
        if(status == 401) {
            saveStorage(local.user, null);
            saveStorage(local.token, null);
            alert("Token expired, Please login again.");
        }else{
            alert(message);
        }
    }
}


export const createProfile = async (data) => {
    try {
        var resp = await _post('/v1/profile/create', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const updateProfile = async (data) => {
    try {
        var resp = await _post('/v1/profile/update', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const uploadCard = async (data) => {
    try {
        var resp = await _post('/v1/profile/uploadcard', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const uploadAvatar = async (data) => {
    try {
        var resp = await _post('/v1/profile/uploadavatar', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const getMe = async (data) => {
    try {
        var res = await _post('/v1/profile/getme', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const needApprove = async (data) => {
    try {
        var res = await _post('/v1/profile/needapprove', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const verifyCode = async (data) => {
    try {
        var res = await _post('/v1/profile/verifycode', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

/**
 * get creator review, story, portfolio
 */

 export const getCreatorMediaData = async (data) => {
    try {
        var res = await _post('/v1/profile/getmediadata', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
 }

 /**
  * upload portfolio image
  */
 export const uploadPortfolio = async (data) => {
    try {
        var resp = await _post('/v1/profile/uploadportfolio', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

 /**
  * upload story
  */
 export const uploadStory = async (data) => {
    try {
        const token = await getStorage('@token');

        const  options = 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                body: data,
            };

        let response = await fetch(
            API_URL + '/v1/profile/uploadstory',options
        );
        return response;
      } catch (error) {
        console.error(error);
        _handleError(error);
      }
}