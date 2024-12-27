import { useContext, useEffect, useState } from 'react';
import FoodSearchBar from '../components/buyerSearch';
import { MyContext } from '../context';
import Countdown from '../components/timer/countdown';
import Order from './order';
import Modal from 'react-modal';
import ReactStars from 'react-rating-stars-component';

export default function BuyerHome() {
  const [openModal, setOpenModal] = useState({});
  const [review, setReview] = useState('');
  const [star, setStar] = useState(0);
  const [orders, setOrders] = useState([]);
  const [nonVeg, setNonVeg] = useState([]);
  const [foodItemDetailPage, setFoodItemDetailPage] = useState(false);
  const [selectedFood, setSelectedFood] = useState([]);
  const { token, userId, setUser, nearByLeftovers, setNearbyLeftovers } =
    useContext(MyContext);

  useEffect(() => {
    // preventing navigation through browser navigation button
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function (event) {
      window.history.pushState(null, null, window.location.href);
    };

    const headers = {
      Authorization: 'Bearer ' + token,
    };

    //get profile and get nearby and  get non veg
    fetch(`http://localhost:4000/user`, { headers })
      .then((response) => {
        console.log(response);
        if (response.status >= 500) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        console.log('userProfileeee:', res);
        if (res.success === false) {
          alert(res.message);
          return;
        }
        setUser(res.data);

        //get nearby
        fetch(
          `http://localhost:4000/leftovers?latitude=${res.data.location.coordinates[0]}&longitude=${res.data.location.coordinates[1]}`,
          { headers },
        )
          .then((response) => {
            console.log(response);
            if (response.status >= 500) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then((res) => {
            console.log('nearbyfoodddddddddd:', res);
            if (res.success === false) {
              alert(res.message);
              return;
            }
            setNearbyLeftovers(res.data);
          })
          .catch((error) => {
            console.error(
              'There was a problem with your fetch operation:',
              error,
            );
          });

        //get Veg leftovers
        fetch(`http://localhost:4000/leftovers?type=Non Veg`, { headers })
          .then((response) => {
            console.log(response);
            if (response.status >= 500) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then((res) => {
            console.log('nearbyNonVegfoodddddddddd:', res);
            if (res.success === false) {
              alert(res.message);
              return;
            }
            setNonVeg(res.data);
          })
          .catch((error) => {
            console.error(
              'There was a problem with your fetch operation:',
              error,
            );
          });
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });

    //get orders
    fetch(`http://localhost:4000/order/${userId}`, { headers })
      .then((response) => {
        console.log(response);
        if (response.status >= 500) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        console.log('orders:', res);
        if (res.success === false) {
          alert(res.message);
          return;
        }
        setOrders(res.data);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }, [token, userId, setUser, setNearbyLeftovers]);

  const addReview = (id) => {
    fetch('http://localhost:4000/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        leftoverId: id,
        review: review,
        star: star,
      }),
    })
      .then((response) => {
        console.log('qqqq', response);
        if (response.status >= 500) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((res) => {
        console.log('review added', res);
        if (res.success === false) {
          alert(res.message);
          return;
        }
        setOpenModal(false);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#FBCEB1' }}>
      {!foodItemDetailPage ? (
        <div
          className="row justify-content-center p-4"
          style={{ width: '80%', margin: 'auto', backgroundColor: 'white' }}
        >
          <FoodSearchBar
            setFoodItemDetailPage={setFoodItemDetailPage}
            setSelectedFood={setSelectedFood}
            isHome={true}
          />
          <hr />
          <h6>Previously Bought</h6>
          {orders.map((element) => {
            const timeLeft = Math.floor(
              (new Date(element.offset) - new Date()) / 1000,
            );
            return (
              <div
                className="col-md-12 p-4"
                key={element._id}
                onClick={() => {
                  setSelectedFood(element);
                  setFoodItemDetailPage(true);
                }}
              >
                <div
                  className="row p-3 rounded-2 justify-content-between"
                  style={{ border: '1px solid darkorange' }}
                >
                  <div className="col-md-2">
                    <img
                      src={require(`../../../uploads/${element.productId.img}`)}
                      alt="food"
                      height="120px"
                      width="130px"
                      className="rounded-2"
                    />
                  </div>
                  <div className="col-md-10 d-flex justify-content-between">
                    <div>
                      <div className="mb-3">
                        <p className="text-dark fs-7 d-inline">
                          {element.quantity} x {element.name}
                        </p>
                        {element.quantity ? (
                          <p className="d-inline mx-2 text-success">in Stock</p>
                        ) : (
                          <p className="d-inline mx-2 text-danger">
                            out of stock
                          </p>
                        )}
                      </div>
                      <p className="text-dark">
                        Offer Price: {element.reducedPrice} Rs
                      </p>
                      <Countdown timeLeft={timeLeft} />
                    </div>
                    <button
                      className="btn border"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(element.name);
                        // setOpenModal(true);
                        setOpenModal((prevOpenModals) => ({
                          ...prevOpenModals,
                          [element._id]: true,
                        }));
                      }}
                    >
                      Add Review
                    </button>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="position-absolute"
                    >
                      <Modal
                        isOpen={openModal[element._id]}
                        style={{
                          overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.4)', // semi-transparent background
                          },
                          content: {
                            width: '40%', // adjust as needed
                            height: '60%',
                            margin: 'auto', // center the modal
                            borderRadius: '10px', // optional styling
                          },
                        }}
                      >
                        <button
                          className="btn "
                          onClick={() => {
                            setOpenModal((prevOpenModals) => ({
                              ...prevOpenModals,
                              [element._id]: false,
                            }));
                          }}
                        >
                          X
                        </button>
                        <h3 className="mt-3">
                          Add a Review for {element.name}
                        </h3>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <ReactStars
                            count={5}
                            onChange={(newRating) => {
                              setStar(newRating);
                            }}
                            size={24}
                            activeColor="#ffd700"
                            // value={5}
                          />
                        </div>

                        <textarea
                          placeholder="write your review here..."
                          className="my-3"
                          type="textarea"
                          style={{ height: '50%', width: '100%' }}
                          onChange={(event) => {
                            const review = event.target.value;
                            setReview(review);
                          }}
                        />
                        <div>
                          <button
                            className="btn btn-success"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(element.name);
                              addReview(element._id);
                            }}
                          >
                            submit
                          </button>
                        </div>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <h6>Famous Brand</h6>
          <div className="col-md-12 d-flex mb-4">
            <img
              src={require('../assets/Tokens 02.png')}
              alt="loading"
              onClick={() => {
                alert('construction in progress!');
              }}
            />
            <img
              src={require('../assets/Tokens 01.png')}
              alt="loading"
              onClick={() => {
                alert('construction in progress!');
              }}
            />
            <img
              src={require('../assets/Tokens 03.png')}
              alt="loading"
              onClick={() => {
                alert('construction in progress!');
              }}
            />
            <img
              src={require('../assets/Tokens 04.png')}
              alt="loading"
              onClick={() => {
                alert('construction in progress!');
              }}
            />
            <img
              src={require('../assets/Tokens 05.png')}
              alt="loading"
              onClick={() => {
                alert('construction in progress!');
              }}
            />
            <img
              src={require('../assets/Tokens 06.png')}
              alt="loading"
              onClick={() => {
                alert('construction in progress!');
              }}
            />
          </div>
          <h6>Near you</h6>
          {nearByLeftovers.map((element) => {
            const timeLeft = Math.floor(
              (new Date(element.offset) - new Date()) / 1000,
            );
            return (
              <div
                className="col-md-12 p-4"
                key={element._id}
                onClick={() => {
                  setSelectedFood(element);
                  setFoodItemDetailPage(true);
                }}
              >
                <div
                  className="row p-3 rounded-2 justify-content-between"
                  style={{ border: '1px solid darkorange' }}
                >
                  <div className="col-md-2">
                    <img
                      src={require(`../../../uploads/${element.productId.img}`)}
                      alt="food"
                      height="120px"
                      width="130px"
                      className="rounded-2"
                    />
                  </div>
                  <div className="col-md-10">
                    <div className="mb-3">
                      <p className="text-dark fs-7 d-inline">
                        {element.quantity} x {element.name}
                      </p>
                      {element.quantity ? (
                        <p className="d-inline mx-2 text-success">in Stock</p>
                      ) : (
                        <p className="d-inline mx-2 text-danger">
                          out of stock
                        </p>
                      )}
                    </div>
                    <p className="text-dark">
                      Offer Price: {element.reducedPrice} Rs
                    </p>
                    <Countdown timeLeft={timeLeft} />
                  </div>
                </div>
              </div>
            );
          })}
          <h6>Non Veg Meals</h6>
          {nonVeg.map((element) => {
            const timeLeft = Math.floor(
              (new Date(element.offset) - new Date()) / 1000,
            );
            return (
              <div
                className="col-md-12 p-4"
                key={element._id}
                onClick={() => {
                  setSelectedFood(element);
                  setFoodItemDetailPage(true);
                }}
              >
                <div
                  className="row p-3 rounded-2 justify-content-between"
                  style={{ border: '1px solid darkorange' }}
                >
                  <div className="col-md-2">
                    <img
                      src={require(`../../../uploads/${element.productId.img}`)}
                      alt="food"
                      height="120px"
                      width="130px"
                      className="rounded-2"
                    />
                  </div>
                  <div className="col-md-10">
                    <div className="mb-3">
                      <p className="text-dark fs-7 d-inline">
                        {element.quantity} x {element.name}
                      </p>
                      {element.quantity ? (
                        <p className="d-inline mx-2 text-success">in Stock</p>
                      ) : (
                        <p className="d-inline mx-2 text-danger">
                          out of stock
                        </p>
                      )}
                    </div>
                    <p className="text-dark">
                      Offer Price: {element.reducedPrice} Rs
                    </p>
                    <Countdown timeLeft={timeLeft} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Order
          selectedFood={selectedFood}
          setOrderPage={setFoodItemDetailPage}
        />
      )}
    </div>
  );
}
