import React, { useEffect, useState} from 'react'
import './App.css'

import axios from 'axios';
import Header from './compontents/Header';
import Footer from '../src/compontents/Footer';
import Home from './compontents/Home';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import {HelmetProvider} from 'react-helmet-async'
import { ToastContainer } from 'react-toastify';
import'react-toastify/dist/ReactToastify.css';
import store from './store';
import ProductDetail from './compontents/ProductDetail';
import ProductSearch from './compontents/ProductSearch';
import Login from './compontents/User/Login';
import Register from './compontents/User/Register';
import {loadUser} from './Actions/userActions';
import Profile from './compontents/User/Profile';
import ProtectedRoute from './compontents/Route/ProtectedRoute';
import UpdateProfile from './compontents/User/UpdateProfile';
import { loadStripe } from '@stripe/stripe-js';
import ForgetPassword from './compontents/User/ForgetPassword';
import ResetPassword from './compontents/User/ResetPassword';
import Cart from './compontents/cart/Cart';
import Shipping from './compontents/cart/Shipping';
import ConfirmOrder from './compontents/cart/ConfirmOrder';
import Payment from './compontents/cart/Payment';
import { Elements } from '@stripe/react-stripe-js';
import OrderSuccess from './compontents/cart/OrderSuccess';
import UserOrders from './compontents/order/UserOrders';
import OrderDetail from './compontents/order/OrderDetail';
import Dashboard from './compontents/Admin/Dashboard';
import ProductList from './compontents/Admin/ProductList';
import NewProduct from './compontents/Admin/NewProduct';
import UpdateProduct from './compontents/Admin/UpdateProduct';
import OrderList from './compontents/Admin/OrderList';
import UpdateOrder from './compontents/Admin/UpdateOrder';
import UserList from './compontents/Admin/UserList';
import UpdateUser from './compontents/Admin/UpdateUser';
import ReviewList from './compontents/Admin/ReviewList';
import { useDispatch } from 'react-redux';










function App() {
 
 const dispatch = useDispatch();
const [stripeApiKey, setStripeApiKey] = useState();
  useEffect(() => {
    // Dispatch the loadUser action
    store.dispatch(loadUser);
    const getStripeApiKey = async () => {
      try {
        // Retrieve user info from localStorage and extract the token
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo ? userInfo.token : null;
    
        // If no token, log an error and stop the API request
        if (!token) {
          console.error('No token found');
          return;
        }
    
        // Send the GET request to fetch the Stripe API key
        const { data } = await axios.get('https://e-comm-ulev.onrender.com/api/v1/stripeapi', {
          headers: {
            Authorization: `Bearer ${token}`, // Correctly use the token in the Authorization header
            'Content-Type': 'application/json',
          },
        });
    
        // Set the Stripe API key to state
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.error('Error fetching Stripe API key:', error);
        // Handle error accordingly (e.g., show a message or redirect)
      }
    };
    
    // Call the function to get the Stripe API key
    getStripeApiKey();
    
  }, [dispatch]);
  return (
    <Router>
 <div className='App'>
  <HelmetProvider>
    

  
     <Header />
    <ToastContainer  />

    <div className='container container-fluid'>
    <Routes>
        <Route path ='/' element={<Home />} />
        <Route path ='/search/:keyword' element={<ProductSearch/>} />
        <Route path ='/product/:id' element={<ProductDetail />} />
        <Route path ='/login' element={<Login />} />
        <Route path ='/register' element={<Register />} />
        <Route path ='/myProfile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path ='/myProfile/update' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>} />
       
        <Route path ='/password/forget' element={<ForgetPassword />} />
        <Route path ='/password/reset/:token' element={<ResetPassword />} />
        <Route path ='/cart' element={<Cart />} />
        <Route path ='/Shipping' element={<ProtectedRoute><Shipping/></ProtectedRoute>} />
        <Route path ='/order/confirm' element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>} />
        <Route path ='/order/success' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>} />
        <Route path ='/orders' element={<ProtectedRoute><UserOrders/></ProtectedRoute>} />
        <Route path ='/order/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute>} />
        {stripeApiKey && <Route path='/payment' element={<ProtectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements></ProtectedRoute> } />
}
  
       
      </Routes>

    </div>
      
{/*******************************Admin Routes ***************************************************/}
   
   <Routes>
   <Route path ='/admin/dashboard' element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
   <Route path ='/admin/products' element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
   <Route path ='/admin/products/create' element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
   <Route path ='/admin/product/:id' element={<ProtectedRoute isAdmin={true}><UpdateProduct/></ProtectedRoute>} />
   <Route path ='/admin/orders' element={<ProtectedRoute isAdmin={true}><OrderList/></ProtectedRoute>} />
   <Route path ='/admin/order/:id' element={<ProtectedRoute isAdmin={true}><UpdateOrder/></ProtectedRoute>} />
   <Route path ='/admin/users' element={<ProtectedRoute isAdmin={true}><UserList/></ProtectedRoute>} />
   <Route path ='/admin/user/:id' element={<ProtectedRoute isAdmin={true}><UpdateUser/></ProtectedRoute>} />
   <Route path ='/admin/reviews' element={<ProtectedRoute isAdmin={true}><ReviewList/></ProtectedRoute>} />
   </Routes>
   
      
      <Footer />
      </HelmetProvider>

    </div>
    </Router>
   
  )
}

export default App
