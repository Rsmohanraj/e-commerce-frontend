import { createSlice } from "@reduxjs/toolkit";

 const authSlice =createSlice({
    name:'auth',
    initialState:{
        userinfo:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')): [],
        loading: true,
        isAuthenticated: false,
        isUpdated: false,
       
    },
    reducers:{
      loginRequest(state,  action){
            return{
                ...state,
                loading:true,  

            }

        },
        loginSuccess(state, action){
            return{
              
                loading:false,
                isAuthenticated: true,
                  user:action.payload.user

            };

        },
        loginFail(state, action){
            return{
                ...state,
                loading:false,
                error: action.payload
               
            }

        },
        clearError(state, action){
            return{
                ...state,
                error:null
                
               
            }

        },
        registerRequest(state,  action){
            return{
                ...state,
                loading:true,
                

            }

        },
        registerSuccess(state, action){
            return{
                loading:false,
                isAuthenticated: true,
                user: action.payload.user
            }

        },
        registerFail(state, action){
            return{
                ...state,
                loading:false,
                error: action.payload
               
            }

        },
        loadUserRequest(state,  action){
            return{
                ...state,
              loading:true,
              isAuthenticated: false,
            
              

            }

        },
        loadUserSuccess(state, action){
           return{
           
            loading:false,
            isAuthenticated:true,
            user: action.payload.user
           }
        },
        loadUserFail(state, action){
            return{
                ...state,
                loading:false,
                
               
                
               
            }

        },
        logoutSuccess(state, action){
            localStorage.removeItem('userInfo')
            return{
                
                loading:false,
                isAuthenticated: false,
                
            }
        
        },
        logoutFail(state, action){
            return{
                ...state,
         error: action.payload
               
            }
        
        },
        updateProfileRequest(state,  action){
            return{
                ...state,
                loading:true,
                isUpdated:false

            }

        },
        updateProfileSuccess(state, action){
            return{
                ...state,
                loading:false,
                user: action.payload.user,
                isUpdated: true,
            
                
            }

        },
        updateProfileFail(state, action){
            return{
                ...state,
                loading:false,
                error: action.payload
               
            }

        },
        clearUpdateProfile(state, action){
            return{
                ...state,
                isUpdated: false
            }

        },
       
        forgetPasswordRequest(state,  action){
            return{
                ...state,
                loading:true,
                message:null
                
                
                

            }

        },
        forgetPasswordSuccess(state, action){
            return{
                ...state,
                loading:false,
                message:action.payload.message
            }

        },
        forgetPasswordFail(state, action){
            return{
                ...state,
                loading:false,
                error: action.payload
               
            }

        },
        resetPasswordRequest(state,  action){
            return{
                ...state,
                loading:true,
                
                

            }

        },
        resetPasswordSuccess(state, action){
            return{
                ...state,
                loading:false,
                isAuthenticated:true,
                user: action.payload.user
            }

        },
        resetPasswordFail(state, action){
            return{
                ...state,
                loading:false,
                error: action.payload
               
            }

        },
        
        
        
    }
  
});


const {actions,reducer} = authSlice;
 
export const {loginRequest,
    loginSuccess,
    loginFail,
    clearError,
registerRequest,
registerSuccess,
registerFail,
loadUserFail,
loadUserSuccess,
loadUserRequest,
logoutSuccess,
logoutFail,
updateProfileRequest,
updateProfileSuccess,
updateProfileFail,
clearUpdateProfile,

forgetPasswordRequest,
forgetPasswordSuccess,
forgetPasswordFail,
resetPasswordRequest,
resetPasswordSuccess,
resetPasswordFail} = actions;

export default reducer;