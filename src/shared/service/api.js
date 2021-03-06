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
        // console.log(err);
    }else{
        const message = err.response.data.message;
        const status = err.response.status;
        if(status == 401) {
            saveStorage(local.user, null);
            saveStorage(local.token, null);
        }else{
            // console.log(message);
        }
    }
}

export const logout = async (data) => {
    try {
        var resp = await _post('/v1/profile/logout', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
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

export const withdraw = async (data) => {
    try {
        var resp = await _post('/v1/profile/withdraw', data);
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

export const uploadBankDetail = async (data) => {
    try {
        var resp = await _post('/v1/profile/bank_detail', data);
        return resp;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const savelogfromapp = async (data) => {
    try {
        var res = await _post('/v2/auth/savelogfromapp', data);
        return res;
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

export const getCreatorProfile = async (data) => {
    try {
        var res = await _post('/v1/profile/getcreatorprofile', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const getNewBookings = async (data) => {
    try {
        var res = await _post('/v1/booking/get-new-bookings', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}
export const unreadMessage = async (data) => {
    try {
        var res = await _post('/v1/booking/unread_message', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const getReviews = async (data) => {
    try {
        var res = await _post('/v1/profile/get_reviews', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}
export const getTransaction = async (data) => {
    try {
        var res = await _post('/v1/profile/get_transaction', data);
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
        return [];
    }
 }

 /**
  * upload portfolio image
  */
 export const uploadPortfolio = async (data) => {
    
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
            API_URL + '/v1/profile/uploadportfolio',options
        );
        return response;
    } catch (error) {
        console.error(error);
        _handleError(error);
    }
}

/** remove portfolio */
export const removePortfolio = async (data) => {
    try {
        var res = await _post('/v1/profile/removeportfolio', data);
        return res;
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

/** remove story */
export const removeStory = async (data) => {
    try {
        var res = await _post('/v1/profile/removestory', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
}

export const getDefaultService = async (data) => {
    try {
        var res = await _post('/v1/profile/get_default_service', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};
export const getCreatorService = async (data) => {
    try {
        var res = await _post('/v1/profile/get_service', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
};

export const getCategories = async (data) => {
    try {
        var res = await _post('/v1/profile/get_categories', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const getBookings = async (data) => {
    try {
        var res = await _post('/v1/booking/get_bookings', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const updateBooking = async (data) => {
    try {
        var res = await _post('/v1/booking/update', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
};

export const updateLocation = async (data) => {
    try {
        var res = await _post('/v1/profile/update_location', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
};

export const changeCreatorStatus = async (data) => {
    try {
        var res = await _post('/v1/profile/change_status', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return null;
    }
};
/**
 * upload assets
 */
export const uploadAsset = async (data) => {
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
            API_URL + '/v1/booking/upload_asset',options
        );
        return response;
    } catch (error) {
        console.error(error);
        _handleError(error);
    }
};

export const saveStudioData = async (data) => {
    try {
        var res = await _post('/v1/booking/save_studio_data', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const finishJob = async (data) => {
    try {
        var res = await _post('/v1/booking/studio_finish_job', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const shareToCustomer = async (data) => {
    try {
        var res = await _post('/v1/booking/studio_share_to_customer', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const renameFolderAndFile = async (data) => {
    try {
        var res = await _post('/v1/booking/studio_rename_folder_file', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const deleteFolderAndFile = async (data) => {
    try {
        var res = await _post('/v1/booking/studio_delete_folder_file', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const shareToStoryAndPortfolio = async (data) => {
    try {
        var res = await _post('/v1/booking/studio_share_to_story_portfolio', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const getAssets = async (data) => {
    try {
        var res = await _post('/v1/booking/get_assets', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const getMessage = async (data) => {
    try {
        var res = await _post('/v1/booking/get_message', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const leaveChat = async (data) => {
    try {
        var res = await _post('/v1/booking/leave_chat', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const lastMessage = async (data) => {
    try {
        var res = await _post('/v1/booking/last_message', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};

export const deleteContact = async (data) => {
    try {
        var res = await _post('/v1/booking/delete_contact', data);
        return res;
    } catch (err) {
        // Handle Error Here
        _handleError(err);
        return [];
    }
};
