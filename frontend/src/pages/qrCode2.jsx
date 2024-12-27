import { useEffect } from 'react';
import Countdown from '../components/timer/countdown';

export default function QrCode2(props) {
  useEffect(() => {
    console.log(1212, props.editMeal);
  });

  return (
    <div
      className="row justify-content-center align-items-center  mx-1 my-3"
      style={{ height: '88vh', backgroundColor: 'white' }}
    >
      <div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
        <p> {'<'} Your QR code has been generated</p>
        <div style={{ border: '2px solid black' }} className="mt-4">
          <img
            src={props.editMeal.qrCodeBuffer}
            height={200}
            width={200}
            alt="qr loading"
          />
        </div>
        <div className="col-md-6 p-4">
          <div
            className="row p-3 rounded-2 justify-content-between"
            style={{ border: '1px solid darkorange' }}
          >
            <div className="col-md-3">
              <img
                src={require(`../../../uploads/${props.editMealImg}`)}
                alt="food"
                height="120px"
                width="130px"
                className="rounded-2"
              />
            </div>
            <div className="col-md-7">
              <p className="text-dark fs-7">
                {props.editMeal.quantity} X {props.editMeal.name}
              </p>
              <p className="text-dark">
                reducedPrice: {props.editMeal.reducedPrice}
              </p>
              <Countdown timeLeft={props.editMealTimer} />
            </div>
          </div>
        </div>
        <p>Please print the QR Code and stick it to your meal</p>
        <div className="my-3">
          <button
            className="btn text-light"
            style={{ backgroundColor: 'orange', width: '200px' }}
            onClick={() => {}}
          >
            Print QR
          </button>
          <button
            className="btn mx-3"
            style={{
              border: '1px solid orange',
              width: '200px',
              color: 'orange',
            }}
            onClick={() => {
              props.setQrCodePage(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
