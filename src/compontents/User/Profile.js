
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import Loader from "../Loader";
export default function Profile(){
 const {user={},loading,error} = useSelector(state =>  state.authState);

    return(
        loading? <Loader /> : error? <h4>{error}</h4> :  <div>
      <div className="row justify-content-around mt-5 user-info">
       <div class="col-12 col-md-3">
                
                <Link to= "/myProfile/update"id="edit_profile" class="btn btn-primary btn-block my-5">
                    Edit Profile
                </Link>
            </div>
 
        <div className="col-12 col-md-5">
             <h4>Full Name</h4>
             <p>{user.name}</p>
 
             <h4>Email Address</h4>
             <p>{user.email}</p>
             <h4>Joined</h4>
             <p>{String(user.createAt).substring(0,10)}</p>

             <a href='/orders' className="btn btn-danger btn-block mt-5">
                My Orders
            </a>

            
        </div>
    </div>
        </div>
  
    )
}
