import { clearError,
    forgetPasswordFail,
    forgetPasswordRequest,
    forgetPasswordSuccess,
    loginFail,
    loginRequest, 
    loginSuccess, 
    logoutFail, 
    logoutSuccess, 
    registerFail,
    registerRequest,
    registerSuccess, 
    resetPasswordFail, 
    resetPasswordRequest, 
    resetPasswordSuccess, 
    updateProfileFail, 
    updateProfileRequest,
    updateProfileSuccess,
    loadUserFail,
    loadUserRequest,
    loadUserSuccess
 } from "../Slices/authSlice"
      
import axios from "axios";
import { deleteUserFail, 
    deleteUserRequest, 
    deleteUserSuccess, 
    updateUserFail, 
    updateUserRequest, 
    updateUserSuccess, 
    userFail, 
    userRequest, 
    usersFail, usersRequest, usersSuccess, userSuccess } from "../Slices/userSlice";

    export const login = (email, password) => async (dispatch) => {
      try {
        dispatch(loginRequest()); // Dispatch the login request action to set loading state
        
        // Make the POST request to the login API endpoint
        const { data } = await axios.post('https://e-comm-ulev.onrender.com/api/v1/login', { email, password });
        
        // Dispatch the success action with the response data
        dispatch(loginSuccess(data));
    
        // Save the user data in localStorage (this will persist even after page refresh)
        localStorage.setItem('userInfo', JSON.stringify(data));
      } catch (error) {
        // If there's an error, dispatch the fail action with the error message
        // Ensure error handling for cases where response or message might be undefined
        const errorMessage = error.response?.data?.message || 'An error occurred during login';
        dispatch(loginFail(errorMessage));
      }
    };
    
    // Clear authentication error action
    export const clearAuthError = (dispatch) => {
      dispatch(clearError()); // Dispatch the clear error action to reset error state
    };
    export const register = (userData) => async (dispatch) => {
      try {
        // Dispatch the request action to show loading indicator
        dispatch(registerRequest());
    
        // Send POST request to register the user
        const { data } = await axios.post('https://e-comm-ulev.onrender.com/api/v1/register', userData);
    
        // Dispatch the success action with the returned data
        dispatch(registerSuccess(data));
    
        // Store the user info (e.g., token or user details) in localStorage
        localStorage.setItem('userInfo', JSON.stringify(data));  // Corrected line
    
      } catch (error) {
        // If there is an error, dispatch the failure action with the error message
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
    
        dispatch(registerFail(errorMessage));
      }
    };
export const loadUser = async (dispatch) => {
  try {
    dispatch(loadUserRequest());

    // Check if userInfo is available in localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      throw new Error('User not logged in. Token is missing.');
    }

    // Parse userInfo and retrieve the token
    const parsedUserInfo = JSON.parse(userInfo);
    const token = parsedUserInfo?.token;

    if (!token) {
      throw new Error('Token is missing in userInfo.');
    }

    // Proceed with the API call if token is present
    const { data } = await axios.get('https://e-comm-ulev.onrender.com/api/v1/userprofile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(loadUserSuccess(data));
    console.log('User data fetched successfully:', data);

  } catch (error) {
    // Provide a fallback error message if there are issues with the API or token
    const errorMessage = error.response?.data?.message || error.message || 'Network error or server not reachable';
    dispatch(loadUserFail(errorMessage));
    console.error('Error fetching user data:', errorMessage);
  }
};

  

export const logout = async(dispatch)=>{
   try{
      
      await axios.get('https://e-comm-ulev.onrender.com/api/v1/logout');
       dispatch(logoutSuccess());
       localStorage.removeItem('userInfo');
   }catch(error){
       dispatch(logoutFail)

   }


}


export const updateProfile = (userData) => async (dispatch) => {
  try {
    // Dispatch request action to show loading
    dispatch(updateProfileRequest());

    // Retrieve token from localStorage and parse it if needed
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo ? userInfo.token : ''; // Assuming token is stored in userInfo

    // Set up the headers for the request
    const config = {
      headers: {
        'Content-Type': 'application/json',  // Assuming the data is JSON
        Authorization: `Bearer ${token}`,  // Add token in Authorization header
      }
    };

    // Send the PUT request to update the user profile
    const { data } = await axios.put('https://e-comm-ulev.onrender.com/api/v1/update', userData, config);

    // Dispatch success action with the response data
    dispatch(updateProfileSuccess(data));

  } catch (error) {
    // Safely handle error if no response data
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;

    // Dispatch failure action with the error message
    dispatch(updateProfileFail(errorMessage));
  }
};
export const forgetPassword =(formData) => async(dispatch)=>{
   try{
       dispatch(forgetPasswordRequest())
       const config ={
           headers:{
               'content-type': "application/json"
           }
       }
       
   
        const {data}  = await axios.post('https://e-comm-ulev.onrender.com/api/v1//Password/forget',formData,config);
       dispatch(forgetPasswordSuccess(data));
   }catch(error){
       dispatch(forgetPasswordFail(error.response.data.message))

   }


}
export const resetPassword =(formData,token) => async(dispatch)=>{
   try{
       dispatch(resetPasswordRequest())
       const config ={
           headers:{
               'content-type': "application/json"
           }
       }
       
   
        const {data}  = await axios.post(  `https://e-comm-ulev.onrender.com/password/reset/${token}`,formData,config);
       dispatch(resetPasswordSuccess(data));
   }catch(error){
       dispatch(resetPasswordFail(error.response.data.message))

   }


}
export const getUsers = async (dispatch) => {
  try {
      // Dispatch the request action
      dispatch(usersRequest());

      // Get the token from localStorage and parse it safely
      const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Assuming 'userInfo' is stored as an object
      const token = userInfo ? userInfo.token : null;  // Extract token or null if not found

      // If no token, throw an error
      if (!token) {
          throw new Error('No authentication token found');
      }

      // Make the GET request with the Authorization header
      const { data } = await axios.get('https://e-comm-ulev.onrender.com/api/v1/admin/users', {
          headers: {
              Authorization: `Bearer ${token}`,  // Use the token in the Authorization header
          },
      });

      // Dispatch the success action with the fetched data
      dispatch(usersSuccess(data));

  } catch (error) {
      // Handle errors and dispatch the failure action
      const errorMessage = error.response
          ? error.response.data.message // If error.response exists, use its message
          : error.message; // If error.response is undefined, fallback to a generic message

      // Dispatch failure action with the error message
      dispatch(usersFail(errorMessage));

      // Optionally, log the error for debugging purposes
      console.error('Error fetching users:', errorMessage);
  }
};
export const getUser  = id =>  async(dispatch)=>{
   try{
       dispatch(userRequest())
     const {data} = await axios.get(`https://e-comm-ulev.onrender.com/api/v1/admin/user/${id}`,{
       headers:{
           'content-type': "application/json",
           Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token || ''}` // Safely access the token
       }
  
     });
       dispatch(userSuccess(data));
   }catch(error){
       dispatch(userFail(error.response.data.message))

   }


}
export const deleteUser = (id) => async (dispatch) => {
  try {
    // Dispatch the request action to notify that the deletion is in progress
    dispatch(deleteUserRequest());

    // Get the token from localStorage (safely access it)
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token || '';

    // Make the API request to delete the user
    await axios.delete(`/api/v1/admin/user/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // Pass the token in the Authorization header
      },
    });

    // Dispatch success action once the deletion is successful
    dispatch(deleteUserSuccess());
  } catch (error) {
    // Handle the error properly
    const errorMessage =
      error.response?.data?.message || 'An error occurred while deleting the user'; // Fallback message

    // Dispatch fail action with the error message
    dispatch(deleteUserFail(errorMessage));
  }
};
export const updateUser = (id, formData) => async (dispatch) => {
  try {
    // Dispatch request action to indicate the start of the update process
    dispatch(updateUserRequest());

    // Get the token from localStorage (safely access it)
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token || '';

    // Make the PUT request to update the user
    const response = await axios.put(`https://e-comm-ulev.onrender.com/api/v1/admin/user/${id}`, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    // Dispatch success action with the response data
    dispatch(updateUserSuccess(response.data));

  } catch (error) {
    // Handle any error that occurs during the request

    // If error.response exists, take the error message from response data. Otherwise, fallback to a generic error message.
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred while updating the user';

    // Dispatch failure action with the error message
    dispatch(updateUserFail(errorMessage));
  }
};
