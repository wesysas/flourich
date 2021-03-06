
import axios from 'axios';
import {API_URL} from '../../globalconfig';

const _post = async (url, data)=> {
    return new Promise((resolve, reject) =>{
        axios.post(API_URL + url, data)
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

export const loginWithGoogle = async (data) => {
    try {
        var resp = await _post('/auth/googled', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const loginWithEmail = async (data) => {
    try {
        var resp = await _post('/auth/login', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const registerWithEmail = async (data) => {
    try {
        var res = await _post('/auth/register', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const checkEmail = async (data) => {
    try {
        var res = await _post('/auth/checkemail', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const resetPassword = async (data) => {
    try {
        var res = await _post('/auth/resetpassword', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const saveSocialUser = async (data) => {
    try {
        var resp = await _post('/v1/auth/savesocialuser', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

