import { useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../context";
import { useNavigate } from 'react-router-dom';

export default function UserHeader() {
  const navigate = useNavigate(); // Initialize navigate hook
  const {setRole}=useContext(MyContext);
  return (
    <div
      style={{ height: "100vh", backgroundColor: "#04292A"}}
      className=" d-flex flex-column p-4 position-fixed col-md-1"
    >
      <img
        src={require("../../assets/logo short.png")}
        alt="loading"
        width="80%"
        className="pb-5 align-self-center"
      />
      <Link to="/sellerHome" className="nav-link  text-light py-3">
        Home
      </Link>
      <Link to="/myshop" className="nav-link  text-light py-3">
        My shop
      </Link>
      <Link to="/delivery" className="nav-link  text-light py-3">
        Delivery
      </Link>
      <Link to="/coupons" className="nav-link  text-light py-3">
        Coupons
      </Link>
      <Link to="/review" className="nav-link  text-light py-3">
        Review
      </Link>
      <button className=" btn text-light py-5 position-absolute bottom-0" onClick={()=>{
          setRole('foodio');
          sessionStorage.setItem('role','foodio');
          navigate('/');
          return;
      }}>
        LogOut
      </button>
    </div>
  );
}
