import axios from 'axios';
import { adminProductsFail, adminProductsRequest, 
    adminProductsSuccess, 
    productsFail, productsRequest, 
    productsSuccess } from "../Slices/ProductsSlice"
import { createReviewFail, 
    createReviewRequest, 
    createReviewSuccess, 
    deleteProductFail, 
    deleteProductRequest, 
    deleteProductSuccess, 
    deleteReviewFail, 
    deleteReviewRequest, 
    deleteReviewSuccess, 
    newProductFail, 
    newProductRequest, 
    newProductSuccess, 
    productFail, 
    productRequest, 
    productSuccess, 
    reviewFail, 
    reviewRequest, 
    reviewSuccess, 
    updateProductFail, 
    updateProductRequest,
    updateProductSuccess} from "../Slices/ProductSlice"

 export const getProducts =  (keyword,price,category, rating, currentPage) =>async (dispatch) => {
    try{
        dispatch(productsRequest())
        let link=`https://e-comm-ulev.onrender.com/api/v1/products?page=${currentPage}`;
        
        if(keyword){
            link+=`&keyword=${keyword}`

        }
        if(price){
            link+=`&price[gte]=${price[0]}&price[lte]=${price[1]}`
       
        }
        if(category){
            link+=`&category=${category}`
        }
        if(rating){
            link+=`&ratings=${rating}`
        }

       
         
        const { data} = await axios.get((link));
        dispatch(productsSuccess(data))
    }catch(error){
        dispatch(productsFail(error.response.data.message));
    }
 }
 

 export const getProduct = id => async (dispatch) => {
    try{
        dispatch(productRequest())
        const { data} = await axios.get(`https://e-comm-ulev.onrender.com/api/v1/product/${id}`);
        dispatch(productSuccess(data))
    }catch(error){
        dispatch(productFail(error.response.data.message));
    }
 }

//new review//....................................... 
export const createReview = (reviewData) => async (dispatch) => {
    try {
        // Dispatch the review request action
        dispatch(createReviewRequest());

        // Get the token from localStorage and parse it
        const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Assuming it's stored as an object
        const token = userInfo ? userInfo.token : null;  // Extract the token, or null if not found

        // If there's no token, throw an error
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Configure the headers
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Add the Authorization header with token
            },
        };

    
        const { data } = await axios.put('https://e-comm-ulev.onrender.com/api/v1/review', reviewData, config);

        
        dispatch(createReviewSuccess(data));
    } catch (error) {
        
        const errorMessage = error.response 
            ? error.response.data.message 
            : error.message; 

        
        dispatch(createReviewFail(errorMessage));

    
        console.error('Error creating review:', errorMessage);
    }
};

// admin products// ............................................
export const getAdminProducts = async (dispatch) => {
    try {
        // Dispatch the request action
        dispatch(adminProductsRequest());

        // Get the token from localStorage and parse it safely
        const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Assuming 'userInfo' is an object
        const token = userInfo ? userInfo.token : null;  // Extract token, or null if not found

        // If no token is found, throw an error
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Make the GET request with the Authorization header
        const { data } = await axios.get('https://e-comm-ulev.onrender.com/api/v1/admin/product', {
            headers: {
                'Content-Type': 'application/json', // Optional, can be removed if unnecessary for GET
                'Authorization': `Bearer ${token}`,  // Pass the token in the Authorization header
            },
        });

        // Dispatch the success action with the fetched data
        dispatch(adminProductsSuccess(data));

    } catch (error) {
        // Handle errors and dispatch the failure action
        const errorMessage = error.response
            ? error.response.data.message // If error.response exists, use its message
            : error.message; // If error.response is undefined, fallback to a generic message

        // Dispatch failure action with the error message
        dispatch(adminProductsFail(errorMessage));

        // Optionally, log the error for debugging purposes
        console.error('Error fetching admin products:', errorMessage);
    }
};


 //create new product//  .............................................
 
 // Ensure the export is correct
export const createNewProduct = (productData) => async (dispatch) => {
    try {
        dispatch(newProductRequest());
        
        const userInfo = localStorage.getItem('userInfo');
        const token = userInfo ? JSON.parse(userInfo).token : null;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const formData = new FormData();
        for (const key in productData) {
            if (productData[key] && key !== 'images') {
                formData.append(key, productData[key]);
            }
        }

        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const { data } = await axios.post('https://e-comm-ulev.onrender.com/api/v1/admin/product/new', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        dispatch(newProductSuccess(data));

    } catch (error) {
        const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message || 'Something went wrong';

        dispatch(newProductFail(errorMessage));
        console.error('Error creating new product:', errorMessage);
    }
};

 // delete product//....................................//
 export const deleteProduct = (id) => async (dispatch) => {
    try {
        // Dispatch delete request action
        dispatch(deleteProductRequest());

        // Get token from localStorage (ensure proper parsing of the userInfo object)
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo ? userInfo.token : null;

        // If there's no token, handle the error (optional)
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Make the API call to delete the product
        await axios.delete(`https://e-comm-ulev.onrender.com/api/v1/admin/product/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Pass token in the header
            },
        });

        // Dispatch success action after the product is deleted
        dispatch(deleteProductSuccess());

    } catch (error) {
        // Dispatch failure action with the error message
        const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message || 'Something went wrong';
        
        dispatch(deleteProductFail(errorMessage));

        // Log error for debugging
        console.error('Error deleting product:', errorMessage);
    }
};
 //update product//..............................................//
 export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        // Dispatch request action to start loading state
        dispatch(updateProductRequest());

        // Retrieve the token from localStorage
        const userInfo = localStorage.getItem('userInfo');
        const token = userInfo ? JSON.parse(userInfo).token : null;

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Make the PUT request to update the product
        const { data } = await axios.put(
            `https://e-comm-ulev.onrender.com/api/v1/admin/product/${id}`, 
            productData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add the Authorization header with the token
                },
            }
        );

        // Dispatch success action with the updated product data
        dispatch(updateProductSuccess(data));
        
    } catch (error) {
        // If there's an error, dispatch the failure action
        const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message || 'Something went wrong';
        
        dispatch(updateProductFail(errorMessage));
    }
};
 //get reviews//..................................................

export const getReviews = (id) => async (dispatch) => {
    try {
        // Dispatch the review request action
        dispatch(reviewRequest());

        // Get user info from localStorage, parse it, and get the token
        const userInfo = localStorage.getItem('userInfo');
        
        if (!userInfo) {
            throw new Error('No user information found in localStorage');
        }

        const token = JSON.parse(userInfo).token;
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Make the GET request to fetch reviews with the Authorization header
        const { data } = await axios.get('https://e-comm-ulev.onrender.com/api/v1/admin/reviews', {
            params: { id },  // Add 'id' as a query parameter
            headers: {
                'Authorization': `Bearer ${token}`,  // Add the token to the headers
            }
        });

        // Dispatch the success action with the fetched data
        dispatch(reviewSuccess(data));

    } catch (error) {
        // Handle errors gracefully, checking if error.response exists
        const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message; // Default to generic message if no response

        // Dispatch the failure action with the error message
        dispatch(reviewFail(errorMessage));

        // Optionally, log the error for debugging purposes
        console.error('Error fetching reviews:', errorMessage);
    }
};

export const deleteReview = (productId, id) => async (dispatch) => {
    try {
        // Dispatch the delete review request action
        dispatch(deleteReviewRequest());

        // Retrieve user info from localStorage and parse it
        const userInfo = localStorage.getItem('userInfo');
        
        if (!userInfo) {
            throw new Error('No user information found. Please log in.');
        }

        const token = JSON.parse(userInfo).token;
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Make the DELETE request to delete the review
        await axios.delete('https://e-comm-ulev.onrender.com/api/v1/admin/review', {
            params: { productId, id },  // Send the productId and id as query parameters
            headers: {
                'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
            },
        });

        // Dispatch the success action if the review is deleted successfully
        dispatch(deleteReviewSuccess());

    } catch (error) {
        // Handle errors gracefully, checking if error.response exists
        const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;  // Default to generic message if no response

        // Dispatch the failure action with the error message
        dispatch(deleteReviewFail(errorMessage));

        // Optionally, log the error for debugging purposes
        console.error('Error deleting review:', errorMessage);
    }
};
