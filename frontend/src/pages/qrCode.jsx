import { useEffect } from 'react';

export default function QrCode(props) {
  const imgUrl = props.qrcodedata;
  
  useEffect(() => {
    console.log(props.formData, props.food);
  });

  return (
    <div
      className="row justify-content-center align-items-center  mx-1 my-3"
      style={{ height: '88vh', backgroundColor: 'white' }}
    >
      <div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
        <p> {'<'} Your QR code has been generated</p>
        <div style={{ border: '2px solid black' }} className="mt-4">
          <img src={imgUrl} height={200} width={200} alt="qr loading" />
        </div>
        <div className="d-flex justify-content-between my-5">
          <img
            src={require(`../../../uploads/${props.food.img}`)}
            height={100}
            width={100}
            alt="qr loading"
          />
          <div className="d-flex flex-column px-2">
            <span>
              {props.formData.quantity} X {props.formData.name}
            </span>
            {/* <span>{props.formData.onset}{props.formData.offset}</span> */}
            <span>
              from: {props.formData.onset.toString()}
            </span>
            <span>
              to: {props.formData.offset.toString()}
            </span>
            <span>{props.formData.reducedPrice}</span>
          </div>
        </div>
        <p>Please print the QR Code and stick it to your meal</p>
        <div className="my-3">
          <button
            className="btn text-light"
            style={{ backgroundColor: 'orange', width: '200px' }}
            onClick={() => {
              window.location.reload();
            }}
          >
            Finish
          </button>
          <button
            className="btn mx-3"
            style={{
              border: '1px solid orange',
              width: '200px',
              color: 'orange',
            }}
            onClick={() => {
              props.setMAP(false);
              props.setQrcode(false);
              props.setFormData({
                address: props.address,
                category: '',
                productId: '',
                quantity: '',
                name: '',
                reducedPrice: '',
                originalPrice: '',
                onset: new Date(),
                offset: new Date(),
              });
              props.setFood(null);
            }}
          >
            Finish and Add new
          </button>
          <button
            className="btn"
            style={{ color: 'orange' }}
            onClick={() => {
              window.location.reload();
            }}
          >
            Add to print Queue
          </button>
        </div>
      </div>
    </div>
  );
}
