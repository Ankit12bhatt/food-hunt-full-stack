import { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import MyGoogleMap from './googleMap';
import QrCode from './qrCode';
import { MyContext } from '../context';

export default function AddNewFood(props) {
  const { token, user } = useContext(MyContext);
  const [formData, setFormData] = useState({
    address: user.address,
    category: '',
    productId: '',
    quantity: '',
    name: '',
    reducedPrice: '',
    originalPrice: '',
    onset: new Date(),
    offset: new Date(),
  });
  const [map, setMap] = useState(false);
  const [qrcode, setQrcode] = useState(false);
  const [qrcodedata, setQrCodeData] = useState(null);
  const [food, setFood] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === 'productId') {
      const selectedProductId = e.target.value;
      const selectedItem = props.foodItems.find(
        (item) => item._id === selectedProductId,
      );
      if (selectedItem) {
        setFormData({
          ...formData,
          [e.target.name]: selectedProductId,
          category: selectedItem.category,
          name: selectedItem.productName,
          originalPrice: selectedItem.price,
        });
        setFood(selectedItem);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    fetch('http://localhost:4000/leftovers', {
      method: 'POST',
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
        if (response.status>=500) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((res) => {
        console.log('Response:', res);
        if(res.success===false){
          alert(res.message);
          return;
        }
        setQrCodeData(res.data);
        setMap(true);
        setQrcode(true);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  useEffect(() => {
    console.log('re-render', qrcode);
  });

  return !map ? (
    <div className="col-md-12 mt-2 py-3" style={{ backgroundColor: 'white' }}>
      <div
        className="row justify-content-center align-items-center"
        style={{ height: '100%' }}
      >
        <div className="col-md-6">
          <p className="fs-5 fw-semibold">Add New</p>
          <form onSubmit={handleSubmit}>
            {/* location  */}
            <div className="form-group">
              <div className="d-flex justify-content-between align-items-center">
                <label for="location">select your location</label>
                <button
                  className="btn"
                  style={{ color: 'darkorange' }}
                  onClick={() => {
                    setMap(true);
                  }}
                >
                  change location
                </button>
              </div>
              <input
                type="text"
                className="form-control"
                id="location"
                name="address"
                placeholder={user.address}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            {/* foodItem  */}
            <div className="form-group">
              <label for="foodItem">choose your food Item</label>
              <div className="container-fluid">
                <div
                  className="row rounded-3"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid lightgrey',
                  }}
                >
                  {props.foodItems.map((element) => {
                    
                    return (
                      // <option>
                      <div className="col-md-6 my-2 d-flex align-items-center">
                        <input
                          type="radio"
                          name="productId"
                          value={String(element._id)}
                          onChange={handleChange}
                          required
                        />
                        <div className="mx-3">
                          <img src={require(`../../../uploads/${element.img}`)} alt="loading" height={50} width={50} />
                        </div>
                        <div>{element.productName}</div>
                      </div>
                      // </option>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="my-2">Enter details</div>
            {/* name  */}
            <div className="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder={formData.name}
                value={formData.name}
                onChange={handleChange}
                name="name"
                required
              />
            </div>
            {/* category  */}
            <div className="form-group">
              <label for="category">Choose your category</label>
              <select
                className="form-control"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option>Starter</option>
                <option>Beverage</option>
                <option>Dessert</option>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Fastfood</option>
              </select>
            </div>
            {/* originalPrice */}
            <div className="form-group">
              <label for="originalPrice">Original Price</label>
              <input
                type="text"
                className="form-control"
                id="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                name="originalPrice"
                placeholder={formData.originalPrice}
                required
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
                required
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
                required
              />
            </div>
            {/* pickup */}
            <div className="d-flex flex-column">
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
                  required
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
                  required
                />
              </div>
            </div>
            <button
              className="btn text-light"
              style={{ backgroundColor: 'orange', width: '200px' }}
              type="submit"
            >
              Next
            </button>
            <button
              className="btn mx-3"
              style={{
                border: '1px solid orange',
                width: '200px',
                color: 'orange',
              }}
              onClick={() => {
                window.location.reload();
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : !qrcode ? (
    <MyGoogleMap setMAP={setMap} />
  ) : (
    <QrCode
      setQrcode={setQrcode}
      setMAP={setMap}
      setAddPage={props.setAddPage}
      qrcodedata={qrcodedata}
      food={food}
      setFood={setFood}
      formData={formData}
      setFormData={setFormData}
    />
  );
}
