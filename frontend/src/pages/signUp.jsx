import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function SignUp() {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    contactNumber: 0,
    address: '',
    role: 'seller',
    password: '',
  });
  const [login, setLogin] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    fetch('http://localhost:4000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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
        setLogin(true);
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
          {!login ? (
            <div className="col-md-6">
              <p className="text-primary fs-1">signUp</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>I'm</Form.Label>
                  <Form.Select
                    name="role"
                    value={Form.role}
                    onChange={handleChange}
                  >
                    <option>seller</option>
                    <option>buyer</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="your name or Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required={true}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    name="contactNumber"
                    value={Form.contactNumber}
                    type="number"
                    placeholder="Phone number"
                    onChange={handleChange}
                    required={true}
                    onInput={(e) => {
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                  />
                </Form.Group>
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
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    name="address"
                    value={Form.address}
                    type="text"
                    placeholder="your name or Business Name"
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
                    placeholder="min length 8 containing atleast 1 upperCase, 1 lowercase, 1 number and 1 special char ......"
                    onChange={handleChange}
                    required={true}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  SignUp
                </Button>
              </Form>
            </div>
          ) : (
            <div className="col-md-3">
              <p className="text-success">Registration successful !!! </p>
              <p className="text-primary">Continue to signIn</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
