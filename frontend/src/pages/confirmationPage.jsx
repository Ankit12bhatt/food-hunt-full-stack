import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../context';

export default function ConfirmatioPage(props) {
  const { token } = useContext(MyContext);
  const [confirmationCode, setConfirmationCode] = useState('..retreving code');

  useEffect(() => {
    fetch('http://localhost:4000/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        leftoverId: props.confirmFood._id,
        quantity: props.quantity,
      }),
    })
      .then((response) => {
        console.log('res', response);
        if (response.status >= 500) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((res) => {
        console.log('confirmation', res);
        if (res.success === false) {
          alert(res.message);
          return;
        }
        setConfirmationCode(res.data);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }, [token, props.confirmFood._id]);

  return (
    <div className="col-md-12 p-5" style={{ height: '90vh' }}>
      <div className="row">
        <div className="col-md-6 ">
          <h4>Collection Confirmed</h4>
          <br />
          <span
            className="p-2 text-danger"
            style={{ backgroundColor: '#FAD5A5' }}
          >
            {confirmationCode}
          </span>
          <br />
          <br />
          <p className="text-success">
            Email will be sent with Confirmation Code !{' '}
          </p>
        </div>
        <div className="col-md-12 p-4">
          <div
            className="row p-3 rounded-2 justify-content-between my-5"
            style={{ border: '1px solid darkorange' }}
          >
            <div className="col-md-2">
              <img
                src={require(
                  `../../../uploads/${props.confirmFood.productId.img}`,
                )}
                alt="food"
                height="120px"
                width="130px"
                className="rounded-2"
              />
            </div>
            <div className="col-md-10">
              <p className="text-dark fs-7">
                {props.confirmFood.quantity} X {props.confirmFood.name}
              </p>
              <p className="text-dark">
                reducedPrice: {props.confirmFood.reducedPrice}
              </p>
            </div>
          </div>
          {confirmationCode !== '..retreving code' ? (
            <button
              className="btn btn-success"
              onClick={() => {
                props.setOrderPage(false);
              }}
            >
              Continue
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
