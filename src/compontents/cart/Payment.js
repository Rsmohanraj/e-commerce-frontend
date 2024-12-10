import { useElements, useStripe } from "@stripe/react-stripe-js"
import { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";
import {validateShipping} from '../cart/Shipping';
import { orderCompleted } from "../../Slices/CartSlice";
import{CreateOrder} from '../../Actions/orderAction';
import { clearError as clearOrderError } from "../../Slices/orderSlice";


export default function Payment() {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))
    const { user } = useSelector(state => state.authState)
    const {items:cartItems, shippingInfo } = useSelector(state => state.cartState)
    const {error:orderError} = useSelector(state => state.orderState)
   
    const paymentData = {
      
     amount : orderInfo && orderInfo.totalPrice ? Math.round(orderInfo.totalPrice * 100) : 0,

        shipping :{
            name: user.name,
            address:{
                city: shippingInfo.city,
                postal_code : shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state,
                line1 : shippingInfo.address
            },
            phone: shippingInfo.phoneNo
        }
    }

    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    if(orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
        
    }

    useEffect(() => {
        validateShipping(shippingInfo, navigate)
        if(orderError) {
            toast(orderError,{
                position: "bottom-center",
                type:'error',
                onOpen: () => {
                  dispatch(clearOrderError())
                }
               
            })
            return
        }
        
    },[dispatch,navigate,orderError])

    const submitHandler = async (e) => {
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true; // Disable button while processing payment
      
        try {
          // Retrieve user info from localStorage and extract the token
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          const token = userInfo ? userInfo.token : null;
      
          if (!token) {
            console.error('No token found');
            document.querySelector('#pay_btn').disabled = false; // Re-enable button if no token
            return;
          }
      
          
      
          // Send payment request to the backend to process payment
          const { data } = await axios.post(
            'https://e-comm-ulev.onrender.com/api/v1/payment/process',
            paymentData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
      
          const clientSecret = data.client_secret;
      
          // Stripe payment confirmation logic (same as in your previous code)
          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardNumberElement),
              billing_details: {
                name: userInfo.name,
                email: userInfo.email,
              },
            },
          });
      
          if (result.error) {
            toast(result.error.message, {
              type: 'error',
              position: 'bottom-center',
            });
            document.querySelector('#pay_btn').disabled = false; // Re-enable button
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              toast('Payment Success!', {
                type: 'success',
                position: 'bottom-center',
              });
              order.paymentInfo = {
                id: result.paymentIntent.id,
                status: result.paymentIntent.status,
                amount: result.paymentIntent.amount_received,
                currency: result.paymentIntent.currency,
                created: result.paymentIntent.created,
                clientSecret,
              }
              
             dispatch(orderCompleted())
             dispatch(CreateOrder(order))
              navigate('/order/success');
            } else {
              toast('Payment failed. Please try again!', {
                type: 'warning',
                position: 'bottom-center',
              });
            }
          }
        } catch (error) {
          console.error('Error during payment processing:', error);
          toast('Error during payment processing. Please try again.', {
            type: 'error',
            position: 'bottom-center',
          });
          document.querySelector('#pay_btn').disabled = false; // Re-enable button
        }
      };
      
      
     return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-4">Card Info</h1>
                    <div className="form-group">
                    <label htmlFor="card_num_field">Card Number</label>
                    <CardNumberElement
                        type="text"
                        id="card_num_field"
                        className="form-control"
                       
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="card_exp_field">Card Expiry</label>
                    <CardExpiryElement
                        type="text"
                        id="card_exp_field"
                        className="form-control"
                       
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="card_cvc_field">Card CVC</label>
                    <CardCvcElement
                        type="text"
                        id="card_cvc_field"
                        className="form-control"
                        value=""
                    />
                    </div>
        
                
                    <button
                    id="pay_btn"
                    type="submit"
                    className="btn btn-block py-3"
                    >
                    Pay - { ` $${orderInfo && orderInfo.totalPrice}` }
                    </button>
        
                </form>
            </div>
        </div>
    )
}
