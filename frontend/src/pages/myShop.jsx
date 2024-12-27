import Dropdown from 'react-bootstrap/Dropdown';
import HorizontalHeader from '../components/header/horizontalHeader';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../context';
import Countdown from '../components/timer/countdown';
import EditMeal from './editMeal';

export default function MyShop() {
  const { leftovers, foodItems } = useContext(MyContext);
  const [editMealPage, setEditMealPage] = useState(false);
  const [editMeal, setEditMeal] = useState(null);
  const [editMealImg, setEditMealImg] = useState(null);
  const [editMealTimer, setEditMealTimer] = useState(null);
  const { token } = useContext(MyContext);

  useEffect(() => {
    console.log('arr', leftovers);
  }, [leftovers]);

  const deleteMeal = (id) => {
    fetch(`http://localhost:4000/leftovers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        if (response.status >= 500) {
          throw new Error(response.statusText);
        }
        console.log('server response', response);
        return response.json();
      })
      .then((res) => {
        if (res.success === true) {
          console.log('Response:', res);
          window.location.reload();
        } else if (res.success === false) {
          alert('something went wrong');
          return;
        }
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  return (
    <div
      className="container-fluid pb-2"
      style={{ backgroundColor: '#FBCEB1', height: '100vh' }}
    >
      <HorizontalHeader />
      {!editMealPage ? (
        <div className="row mx-1 my-3 p-2" style={{ backgroundColor: 'white' }}>
          <div className="col-md-12">
            <p>My Shop</p>
            <div className="d-flex align-items-center">
              <div
                style={{ width: '50%', border: '1px solid lightgrey' }}
                className="p-2 rounded-3"
              >
                <input
                  type="text"
                  style={{
                    width: '92%',
                    marginRight: '10px',
                    borderWidth: '0px',
                  }}
                  placeholder="search here..."
                />
                <img src={require('../assets/Search icon.png')} alt="loading" />
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="mx-3 border"
                >
                  Sort by
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Something else
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="border"
                >
                  Show top
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Something else
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="d-flex justify-content-between my-3">
              <button className="btn text-danger">All</button>
              <button className="btn">Confirm Pickup</button>
              <button className="btn">Upcoming Pickups</button>
              <button className="btn">Window TimeOut</button>
              <button className="btn">Add new meal</button>
            </div>
          </div>
          <div className="row">
            {leftovers.map((element) => {
              const selectedItem = foodItems.find(
                (item) => item._id === element.productId,
              );
              if (!selectedItem) {
                return null;
              }
              const timeLeft = Math.floor(
                (new Date(element.offset) - new Date()) / 1000,
              );
              return (
                <div className="col-md-6 p-4" key={element._id}>
                  <div
                    className="row p-3 rounded-2 justify-content-between"
                    style={{ border: '1px solid darkorange' }}
                  >
                    <div className="col-md-3">
                      <img
                        src={require(`../../../uploads/${selectedItem.img}`)}
                        alt="food"
                        height="120px"
                        width="130px"
                        className="rounded-2"
                      />
                    </div>
                    <div className="col-md-7">
                      <p className="text-dark fs-7">
                        {element.quantity} X {element.name}
                      </p>
                      {/* <p className="text-dark">type: {selectedItem.type}</p> */}
                      {/* <p className="text-dark">category: {element.category}</p> */}
                      <p className="text-dark">
                        reducedPrice: {element.reducedPrice}
                      </p>
                      <Countdown timeLeft={timeLeft} />
                    </div>
                    <div className="col-md-1 d-flex flex-column justify-content-between px-0">
                      <div
                        className="d-flex justify-content-between"
                        style={{ width: '100%' }}
                      >
                        <img
                          src={require('../assets/edit icon.png')}
                          alt="food"
                          height="20"
                          width="20"
                          className=""
                          onClick={() => {
                            // alert('edit');
                            setEditMealPage(true);
                            setEditMeal(element);
                            setEditMealImg(selectedItem.img);
                            setEditMealTimer(timeLeft);
                          }}
                        />
                        <img
                          src={require('../assets/delete icon.png')}
                          alt="food"
                          height="20"
                          width="20"
                          className=""
                          onClick={() => {
                            const res = window.confirm(
                              'are you sure you want to delete ',
                            );
                            if (res) deleteMeal(element._id);
                          }}
                        />
                      </div>

                      <div>{element.reducedPrice}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EditMeal
          editMeal={editMeal}
          editMealImg={editMealImg}
          editMealTimer={editMealTimer}
          setEditMealPage={setEditMealPage}
        />
      )}
    </div>
  );
}
