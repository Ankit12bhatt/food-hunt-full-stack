import { useContext, useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { MyContext } from '../context';
import Countdown from './timer/countdown';

export default function FoodSearchBar(props) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);
  const [sortby, setSortBy] = useState('sort by');
  const { token } = useContext(MyContext);

  useEffect(() => {
    console.log(1, value);
    if (value) {
      searchFood();
    }
  }, [value]);

  const searchFood = (e) => {
    console.log(value);
    const headers = {
      Authorization: 'Bearer ' + token,
    };

    fetch(`http://localhost:4000/leftovers?${name}=${value}`, { headers })
      .then((response) => {
        console.log(response);
        if (response.status >= 500) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        console.log('searchhhhhhhhhhh:', res);
        if (res.success === false) {
          alert(res.message);
          return;
        }
        setResult(res.data);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  return (
    <div className="row">
      {/* Search Bar  */}
      <div className="row justify-content-center align-items-center">
        <div
          className="col-md-9 py-2 rounded-5  d-flex  justify-content-between align-items-center px-3"
          style={{ backgroundColor: '#f0f0f0' }}
        >
          <img src={require('../assets/mic.png')} alt="loading" height={25} />
          <form className="d-flex" style={{ width: '95%' }}>
            <input
              type="text"
              style={{
                width: '90%',
                backgroundColor: '#f0f0f0',
                border: '0px',
                margin: '0 3px',
              }}
              name="name"
              value={value}
              onChange={(e) => {
                setName(e.target.name);
                setValue(e.target.value);
              }}
            ></input>
            <button className="btn border border-0" disabled={true}>
              <img
                src={require('../assets/Search icon.png')}
                alt="loading"
                width={20}
              />
            </button>
          </form>
        </div>
        <div className="col-md-1">
          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="border"
            >
              {sortby}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setSortBy('high to low');
                }}
              >
                high to low
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setSortBy('low to high');
                }}
              >
                low to high
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {/* type and category card */}
      <div className="row justify-content-between py-3">
        <button
          className="col-md-1 btn border "
          onClick={() => {
            setName('type');
            setValue('Veg');
          }}
        >
          Veg
        </button>
        <button
          className="col-md-1 btn border "
          onClick={() => {
            setName('type');
            setValue('Non Veg');
          }}
        >
          Non Veg
        </button>
        <button
          className="col-md-1 btn border "
          onClick={() => {
            setName('category');
            setValue('Starter');
          }}
        >
          Starter
        </button>
        <button
          className="col-md-1 btn border"
          onClick={() => {
            setName('category');
            setValue('Beverage');
          }}
        >
          Beverage
        </button>
        <button
          className="col-md-1 btn border "
          onClick={() => {
            setName('category');
            setValue('Dessert');
          }}
        >
          Dessert
        </button>
        <button
          className="col-md-1 btn border "
          onClick={() => {
            setName('category');
            setValue('Breakfast');
          }}
        >
          Breakfast
        </button>
        <button
          className="col-md-1 btn border "
          onClick={() => {
            setName('category');
            setValue('Fastfood');
          }}
        >
          Fastfood
        </button>
        <button
          className="col-md-1 btn border "
          onClick={() => {
            setName('category');
            setValue('Lunch');
          }}
        >
          Lunch
        </button>
        <button
          className="col-md-1 btn border "
          onClick={() => {
            setName('category');
            setValue('Dinner');
          }}
        >
          Dinner
        </button>
        <div className="btn-group col-md-1">
          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="border"
            >
              {sortby}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setSortBy('high to low');
                }}
              >
                high to low
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setSortBy('low to high');
                }}
              >
                low to high
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {/* search result section  */}
      {result.length ? (
        <div className="row justify-content-between py-3">
          <h6>Search Result:</h6>
          {result.map((element) => {
            const timeLeft = Math.floor(
              (new Date(element.offset) - new Date()) / 1000,
            );
            return (
              <div
                className="col-md-12 p-4"
                key={element._id}
                onClick={() => {
                  if (props.isHome) {
                    props.setSelectedFood(element);
                    props.setFoodItemDetailPage(true);
                  } else {
                    props.setSelectedFood(element);
                    props.setOrderPage(true);
                  }
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
        <>
          <hr />
          <span
            style={{
              textAlign: 'center',
              backgroundColor: 'lightcoral',
              opacity: '0.5',
            }}
            className="my-3"
          >
            search result will appear here if any !
          </span>
        </>
      )}
    </div>
  );
}
