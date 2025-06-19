import React, { useContext } from 'react';
import { HomeContext } from '../Context/HomeContext';
import { useParams } from 'react-router-dom';
// import Breadcrub from '../Components/Breadcrumb/Breadcrub';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
// import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProduct from '../Components/RelatedProducts/RelatedProduct';




function Product() {

  const {all_product} = useContext(HomeContext);
  const {productId} = useParams();
  const product = all_product.find((e)=> e.id === Number(productId));


  return (
    <div>

      {/* <Breadcrub product={product}/> */}
      <ProductDisplay product={product} />
      {/* <DescriptionBox /> */}
      <RelatedProduct />

    </div>
  )
}

export default Product
