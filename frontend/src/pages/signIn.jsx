import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../context';

export default function SignIn() {
  const { setToken, setRole, setUserId } = useContext(MyContext);
  const navigate = useNavigate(); // Initialize navigate hook

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData }),
    })
      .then((response) => {
        console.log(response);
        if (response.status >= 500) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        if(res.success===false){
          alert(res.message);
          return;
        }
        console.log('Response:', res);
        setToken(res.data.access_token);
        setRole(res.data.role);
        setUserId(res.data.userId);
        sessionStorage.setItem('role', res.data.role);
        sessionStorage.setItem('userId', res.data.userId);
        sessionStorage.setItem('token', res.data.access_token);
        if (res.data.role === 'seller') navigate('/sellerHome');
        else navigate('/buyerHome');
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  return (
    <>
      <div className="container-fluid">
        <div
          className="row justify-content-center align-items-center"
          style={{ height: '90vh' }}
        >
          <div className="col-md-6">
            <p className="text-primary fs-1">signIn</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  value={Form.email}
                  type="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  required={true}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  value={Form.password}
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required={true}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                SignIn
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
