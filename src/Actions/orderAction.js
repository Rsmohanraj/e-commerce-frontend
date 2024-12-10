import axios from "axios"
import { adminOrderFail, adminOrderRequest, adminOrderSuccess, createOrderFail, 
    createOrderRequest, 
    createOrderSuccess,
     deleteOrderFail,
     deleteOrderRequest,
     deleteOrderSuccess,
     orderDetailFail,
     orderDetailRequest,
     orderDetailSuccess,
     updateOrderFail,
     updateOrderRequest,
     updateOrderSuccess,
     userOrderFail,
      userOrderRequest,
       userOrderSuccess } from "../Slices/orderSlice"

       export const CreateOrder = (order) => async (dispatch) => {
        try {
          // Dispatch request action to set loading state
          dispatch(createOrderRequest());
          
          // Retrieve token from localStorage
          const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
          if (!token) {
            throw new Error('No authentication token found');
          }
      
          // Log token for debugging
          console.log('Authorization Token:', token);
      
          // Log order data for debugging
          console.log('Sending order data:', order);
      
          // Send POST request to create a new order
          const { data } = await axios.post('https://e-comm-ulev.onrender.com/api/v1/order/new', order, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',  // Ensure Content-Type is set to JSON
            },
          });
      
          // Dispatch success action with the response data
          dispatch(createOrderSuccess(data));
      
        } catch (error) {
          // Handle error, dispatching the failure action to store the error
          const errorMessage = error.response?.data?.message || error.message || 'Error creating order';
          dispatch(createOrderFail(errorMessage));
      
          // Log error for debugging
          console.error('Error creating order:', error);
      
          // Optionally, show a user-friendly alert
          alert(errorMessage);
        }
      };
      
      
      export const userOrders = async (dispatch) => {
        try {
            // Dispatch the request action
            dispatch(userOrderRequest());
    
            // Get the token from localStorage and parse it if it's stored as an object
            const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Assuming it's an object
            const token = userInfo ? userInfo.token : null;
    
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            // Make the GET request with the Authorization header
            const { data } = await axios.get('https://e-comm-ulev.onrender.com/api/v1/my/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Optional: Ensure that the content type is set to JSON
                },
            });
    
            // Dispatch the success action with the data
            dispatch(userOrderSuccess(data));
        } catch (error) {
            // If there's an error, dispatch the fail action
            // Log error message and dispatch
            const errorMessage = error.response ? error.response.data.message : error.message;
            dispatch(userOrderFail(errorMessage));
        }
    };
   
    
    export const orderDetail = (id) => async (dispatch) => {
        try {
            // Dispatch the request action
            dispatch(orderDetailRequest());
    
            // Get the token from localStorage and parse it
            const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Assuming it's stored as an object
            const token = userInfo ? userInfo.token : null; // Get the token, or null if not found
    
            // If there's no token, throw an error
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            // Make the GET request with the Authorization header
            const { data } = await axios.get(`https://e-comm-ulev.onrender.com/api/v1/order/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Optional: Ensure correct content type is set
                },
            });
    
            // Dispatch the success action with the data
            dispatch(orderDetailSuccess(data));
        } catch (error) {
            // Log the error message and dispatch the failure action
            const errorMessage = error.response 
                ? error.response.data.message 
                : error.message;  // Fallback to generic error message if no response
    
            // Dispatch the fail action
            dispatch(orderDetailFail(errorMessage));
    
            // Optionally log the error for debugging purposes
            console.error('Error fetching order details:', errorMessage);
        }
    };
    
    export const adminOrders = async (dispatch) => {
        try {
            // Dispatch the request action
            dispatch(adminOrderRequest());
    
            // Get the token from localStorage and parse it safely
            const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Assuming 'userInfo' is an object
            const token = userInfo ? userInfo.token : null;  // Extract token or null if not found
    
            // If no token is found, throw an error
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            // Make the GET request with the Authorization header
            const { data } = await axios.get('https://e-comm-ulev.onrender.com/api/v1/admin/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,  // Pass the token in the Authorization header
                },
            });
    
            // Dispatch the success action with the fetched data
            dispatch(adminOrderSuccess(data));
    
        } catch (error) {
            // Handle errors and dispatch the failure action
            const errorMessage = error.response
                ? error.response.data.message // If error.response exists, use its message
                : error.message; // If error.response is undefined, fallback to a generic message
    
            
            dispatch(adminOrderFail(errorMessage));
    
           
            console.error('Error fetching admin orders:', errorMessage);
        }
    };
    export const deleteOrder = (id) => async (dispatch) => {
        try {
            dispatch(deleteOrderRequest()); // Dispatch the request action before making the API call
            
            // Get the token from localStorage
            const userInfo = localStorage.getItem('userInfo');
            
            if (!userInfo) {
                throw new Error("User is not authenticated");
            }
    
            const token = JSON.parse(userInfo).token; // Assuming userInfo is stored as a stringified object with a token field
    
            // Make the API call to delete the order
            await axios.delete(`https://e-comm-ulev.onrender.com/api/v1/admin/order/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                }
            });
    
            dispatch(deleteOrderSuccess()); // Dispatch success if the request was successful
    
        } catch (error) {
            // Check if error response exists and handle accordingly
            const errorMessage = error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message; // Default to a general error message if no response data is available
    
            dispatch(deleteOrderFail(errorMessage)); // Dispatch failure with the error message
        }
    };
    export const updateOrder = (id, orderData) => async (dispatch) => {
        try {
            // Dispatch the request action to indicate that the update process has started
            dispatch(updateOrderRequest());
    
            // Retrieve user info from localStorage and parse it to get the token
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) {
                throw new Error('User is not authenticated');
            }
    
            // Parse the user information and get the token
            const { token } = JSON.parse(userInfo);
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            // Make a PUT request to update the order, passing the order data and authorization token
            const { data } = await axios.put(`https://e-comm-ulev.onrender.com/api/v1/admin/order/${id}`, orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include token in the request header
                }
            });
    
            // Dispatch success action with the response data
            dispatch(updateOrderSuccess(data));
    
        } catch (error) {
            // Check if the error response exists and extract the error message
            const errorMessage =
                error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : error.message || 'Something went wrong';
    
            // Dispatch failure action with the error message
            dispatch(updateOrderFail(errorMessage));
        }
    };
