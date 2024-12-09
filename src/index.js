import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store'
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode >
    <ToastContainer />
   
   <Provider store={store}>

   
    <App />
    </Provider>
   
   
  
  </React.StrictMode>
);

