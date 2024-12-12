import {  Fragment,useEffect,useState} from 'react'
import MetaData from './MetaData';
import Loader from '../compontents/Loader';
import { getProducts } from '../Actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../compontents/Products';
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination'
import { useParams } from 'react-router-dom';


  export default function Home() {
    const dispatch = useDispatch();
    const {products,  loading , error,productsCount, resPerPage}=  useSelector((state) =>state.productsState)
    const [currentPage, setCurrentPage] = useState(1);

   const {keyword} =useParams();
    const setCurrentPageNo = (pageNo) => {

      setCurrentPage(pageNo)
    }


    
 useEffect(() =>{
  if(error){
 return  toast.error(error,{
  position:"bottom-center"
 })
  }
 
   dispatch(getProducts(keyword))

 },[ error,dispatch,currentPage])

 

  return (
    <Fragment>

      {loading ? <Loader /> : 
<Fragment>
    
    <MetaData title={'Buying Best Products'} />
  <h1 id="products_heading">Search Products</h1>

  <section id="products" className="container mt-5">
     <div className="row">
    {products && products.map(product =>(
      <Product  col={3}key={product._id} product={product}/>


    ))}
     
   </div>
   </section>
   {productsCount > 0  && productsCount> resPerPage?
   <div className='d-flex justify-content-center mt-5'>
    <Pagination
      activePage={currentPage}
      totalItemsCount={productsCount}
      onChange={setCurrentPageNo }
      itemsCountPerPage={ resPerPage}
      nextPageText={'Next'}
      firstPageText={'First'}
      lastPageText={'last'}
      itemClass={'page-item'}
      linkClass={'page-link'}
    />

   </div> :null }
  
  

   </Fragment>
  }
    </Fragment>
    
  )
}


