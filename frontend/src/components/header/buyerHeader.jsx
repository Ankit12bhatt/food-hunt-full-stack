import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { MyContext } from '../../context';
import { useNavigate } from 'react-router-dom';

function BuyerHeader() {
  const {user,setRole} = useContext(MyContext);
  const navigate = useNavigate(); // Initialize navigate hook
  return (
    <Navbar expand="lg" style={{ backgroundColor: '#04292A' }}>
      <Container fluid>
        <img src={require('../../assets/Logo.png')} alt="loading" width="10%" />
        <Navbar.Collapse
          id="navbarScroll"
          className="d-flex justify-content-end"
        >
          <Nav className="d-flex align-items-center mx-2">
            <Link to="/buyerHome" className="nav-link active text-light px-4">
              Home
            </Link>
            <Link to="/discover" className="nav-link active text-light px-4">
              Discover
            </Link>
            <Link to="/myCart" className="nav-link active text-light px-4">
              My Cart
            </Link>
            <Link to="/saved" className="nav-link active text-light px-4">
              Saved
            </Link>
            <Link to="/help" className="nav-link active text-light px-4">
              Help
            </Link>
            <img
              src={require('../../assets/profile.jpg')}
              alt="loading"
              width="45px"
              className="rounded-5"
              style={{ border: '2px solid white' }}
            />
            <button className='btn text-light'>
              {user.businessName} {'||'}
            </button>
            <button className='btn text-light' onClick={()=>{
              setRole('foodio');
              sessionStorage.setItem('role','foodio');
              navigate('/');
              return;
            }}>
              logout
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BuyerHeader;
