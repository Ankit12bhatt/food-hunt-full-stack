import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavScrollExample from './components/header/header';
import { MyContext } from './context';
import Home from './pages/home';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import SellerHome from './pages/sellerHome';
import UserHeader from './components/header/userheader';
import MyShop from './pages/myShop';
import BuyerHeader from './components/header/buyerHeader';
import BuyerHome from './pages/buyerHome';
import Discover from './pages/discover';
import Help from './pages/help';

function App() {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('foodio');
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState({});
  const [foodItems, setfoodItem] = useState([]);
  const [leftovers, setLeftovers] = useState([]);
  const [nearByLeftovers, setNearbyLeftovers] = useState([]);

  useEffect(() => {
    const user = sessionStorage.getItem('role');
    if (user) {
      setRole(sessionStorage.getItem('role'));
      setToken(sessionStorage.getItem('token'));
      setUserId(sessionStorage.getItem('userId'));
    }
    const headers = {
      Authorization: 'Bearer ' + token,
    };

    if (role === 'seller') {
      //get leftovers
      fetch(`http://localhost:4000/leftovers`, { headers })
        .then((response) => {
          if (response.status>=500) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((res) => {
          if(res.success===false){
            alert(res.message);
            return;
          }
          setLeftovers(res.data);
          console.log('leftovers:', res);
        })
        .catch((error) => {
          console.error(
            'There was a problem with your fetch operation:',
            error,
          );
        });

      //get menu food
      fetch(`http://localhost:4000/product/${userId}`, { headers })
        .then((response) => {
          if (response.status>=500) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((res) => {
          if(res.success===false){
            alert(res.message);
            return;
          }
          setfoodItem(res.data);
          console.log('menu items:', res);
        })
        .catch((error) => {
          console.error(
            'There was a problem with your fetch operation:',
            error,
          );
        });
    }
  }, [token, userId]);

  if (role === 'foodio') {
    return (
      <MyContext.Provider value={{ role, setToken, setRole, setUserId }}>
        <NavScrollExample />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="signIn" element={<SignIn />} />
        </Routes>
      </MyContext.Provider>
    );
  } else if (role === 'seller') {
    console.log('sellerRoute');
    return (
      <div className="container-fluid">
        <div className="row">
          <MyContext.Provider
            value={{
              setRole,
              token,
              setToken,
              userId,
              user,
              setUser,
              foodItems,
              leftovers,
              setLeftovers,
              setfoodItem,
            }}
          >
            <div className="col-md-1  px-0 bg-success">
              <UserHeader />
            </div>
            <div className="col-md-11  px-0">
              <Routes>
                <Route path="/sellerHome" element={<SellerHome />} />
                <Route path="/myShop" element={<MyShop />} />
              </Routes>
            </div>
          </MyContext.Provider>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <MyContext.Provider
          value={{
            token,
            userId,
            user,
            setUser,
            setRole,
            nearByLeftovers,
            setNearbyLeftovers,
          }}
        >
          <BuyerHeader />
          <Routes>
            <Route path="/buyerHome" element={<BuyerHome />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </MyContext.Provider>
      </div>
    );
  }
}

export default App;
