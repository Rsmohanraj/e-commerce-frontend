import axios from "axios"
import { addCartItemRequest, addCartItemSuccess } from "../Slices/CartSlice"


export const addToCart =(id, quantity) => async(dispatch) => {
    try {
        dispatch(addCartItemRequest())
        const { data } = await axios.get(`/api/v1/product/${id}`)
        dispatch(addCartItemSuccess({
            product:data.product._id,
            name: data.product.name,
            image: data.product.images[0].image,
            price: data.product.price,
            stock: data.product.stock,
            quantity
           
        }
            

        ))
        
        
    } catch (error) {
        
    }
}

