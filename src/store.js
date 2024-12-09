import { combineReducers, configureStore, } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

import productsReducer from './Slices/ProductsSlice';
import productReducer from './Slices/ProductSlice';
import authReducer from './Slices/authSlice';
import cartReducer from './Slices/CartSlice';
import orderReducer from './Slices/orderSlice';
import userReducer from './Slices/userSlice';

const reducer = combineReducers({
    productsState:productsReducer,
    productState: productReducer ,
    authState:authReducer,
    cartState: cartReducer,
    orderState: orderReducer,
    userState: userReducer
    
 })




 const store = configureStore({
    reducer,
    applyMiddleware:[thunk]
});

export default  store;
