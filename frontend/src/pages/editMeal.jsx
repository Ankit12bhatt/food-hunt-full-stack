import { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Countdown from '../components/timer/countdown';
import { MyContext } from '../context';
import QrCode2 from './qrCode2';

export default function EditMeal(props) {
  const [formData, setFormData] = useState({
    address: props.editMeal.address,
    quantity: props.editMeal.quantity,
    name: props.editMeal.name,
    reducedPrice: props.editMeal.reducedPrice,
    onset: new Date(props.editMeal.onset),
    offset: new Date(props.editMeal.offset),
  });
  const { token } = useContext(MyContext);
  const [qrCodePage, setQrCodePage] = useState(false);
  useEffect(() => {});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    fetch(`http://localhost:4000/leftovers/${props.editMeal._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        ...formData,
        quantity: Number(formData.quantity),
        reducedPrice: Number(formData.reducedPrice),
      }),
    })
      .then((response) => {
        console.log('server response', response);
        if (response.status >= 500) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        console.log('Response:', res);
        if (res.success === false) {
          alert(res.message);
          return;
        }
        alert('food updated');
        window.location.reload();
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  const deleteMeal = (id) => {
    fetch(`http://localhost:4000/leftovers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        console.log('server response', response);
        if (response.status >= 500) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        console.log('Response:', res);
        if(res.success===false){
          alert(res.message);
          return;
        }     
        window.location.reload();
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  return !qrCodePage ? (
    <div className="row mx-1 my-3 p-4" style={{ backgroundColor: 'white' }}>
      <div className="col-md-12 fw-semibold fs-4">Edit</div>
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
          <div className="col-md-9">
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
      <div className="col-md-7">
        <form onSubmit={handleSubmit}>
          {/* location  */}
          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center">
              <label for="location">select your location</label>
              <button
                className="btn"
                style={{ color: 'darkorange' }}
                //   onClick={() => {
                //     setMap(true);
                //   }}
              >
                change location
              </button>
            </div>
            <input
              type="text"
              className="form-control"
              id="location"
              name="address"
              placeholder={props.editMeal.address}
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          {/* enter details  */}
          <div className="d-flex my-2 justify-content-between align-items-center">
            <div>Enter details</div>
            <button
              className="btn text-danger"
              onClick={() => {
                setQrCodePage(true);
              }}
            >
              Print QrCode
            </button>
          </div>
          {/* name  */}
          <div className="form-group">
            <label for="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder={props.editMeal.name}
              value={formData.name}
              onChange={handleChange}
              name="name"
            />
          </div>
          {/* originalPrice */}
          <div className="form-group">
            <label for="originalPrice">Original Price</label>
            <input
              type="text"
              className="form-control"
              id="originalPrice"
              name="originalPrice"
              placeholder={props.editMeal.originalPrice}
              disabled
            />
          </div>
          {/* quantity */}
          <div className="form-group">
            <label for="quantity">Quantity</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={formData.quantity}
              onChange={handleChange}
              name="quantity"
              placeholder={props.editMeal.quantity}
            />
          </div>
          {/* reducedPrice */}
          <div className="form-group">
            <label for="reducedPrice">Reduced Price</label>
            <input
              type="number"
              className="form-control"
              id="reducedPrice"
              value={formData.reducedPrice}
              onChange={handleChange}
              name="reducedPrice"
              placeholder={props.editMeal.reducedPrice}
            />
          </div>
          {/* pickup */}
          <div className="d-flex flex-column mb-4">
            <label for="reducedPrice">Pickup Window</label>
            <div className="my-3">
              from
              <DatePicker
                className="mx-2"
                selected={formData.onset}
                onChange={(date) => {
                  setFormData({ ...formData, onset: date });
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                timeInputLabel="Time:"
                dateFormatCalendar="MMMM yyyy"
                dropdownMode="select"
              />
              to
              <DatePicker
                className="mx-2"
                selected={formData.offset}
                onChange={(date) => {
                  setFormData({ ...formData, offset: date });
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                timeInputLabel="Time:"
                dateFormatCalendar="MMMM yyyy"
                dropdownMode="select"
              />
            </div>
          </div>
          <button
            className="btn text-light"
            style={{ backgroundColor: 'orange', width: '200px' }}
            type="submit"
          >
            Save
          </button>
          <button
            className="btn mx-3"
            style={{
              border: '1px solid orange',
              width: '200px',
              color: 'orange',
            }}
            onClick={() => {
              props.setEditMealPage(false);
            }}
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn mx-3 px-0"
            style={{
              color: 'darkorange',
            }}
            type="button"
            onClick={() => {
              const res = window.confirm('are you sure you want to delete ');
              if (res) {
                deleteMeal(props.editMeal._id);
              }
            }}
          >
            Delete Meal
          </button>
        </form>
      </div>
    </div>
  ) : (
    <QrCode2
      editMeal={props.editMeal}
      editMealImg={props.editMealImg}
      editMealTimer={props.editMealTimer}
      setQrCodePage={setQrCodePage}
    />
  );
}
