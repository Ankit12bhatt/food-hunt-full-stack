import { useState } from 'react';
import FoodSearchBar from '../components/buyerSearch';
import FoodMap from './foodMap';
import Order from './order';

export default function Discover() {
  const [orderPage, setOrderPage] = useState(false);
  const [selectedFood,setSelectedFood]=useState({});
  return (
    <div className="container-fluid" style={{ backgroundColor: '#FBCEB1' }}>
      {!orderPage ? (
        <div
          className="row justify-content-center p-4"
          style={{ width: '80%', margin: 'auto', backgroundColor: 'white' }}
        >
          <FoodSearchBar setSelectedFood={setSelectedFood} setOrderPage={setOrderPage}/>
          <hr />
          <FoodMap setOrderPage={setOrderPage} setSelectedFood={setSelectedFood}/>
        </div>
      ) : (
        <Order selectedFood={selectedFood} setOrderPage={setOrderPage}/>
      )}
    </div>
  );
}
