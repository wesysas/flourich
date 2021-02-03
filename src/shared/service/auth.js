
import axios from 'axios';
import {API_URL} from '../../globalconfig';

const _post = async (url, data)=> {
    return new Promise((resolve, reject) =>{
        axios.post(API_URL + url, data)
            .then(response => {
                resolve(response.data);
          }).catch(error => {
              console.log(error)
              reject(error);
            });

    });
} 

const _handleError = (err) => {
    const message = err.response.data.message;
    alert(message);
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

