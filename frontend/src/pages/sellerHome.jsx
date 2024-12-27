import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { MyContext } from '../context';
import 'react-datepicker/dist/react-datepicker.css';
import AddNewFood from './addNewFood';
import HorizontalHeader from '../components/header/horizontalHeader';

// chart assets start
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Revenue',
    },
  },
};

const labels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset',
      data: [100, 200, 300, 400, 600, 700, 900, 800, 650, 200, 500, 1000],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
// chart assets end

export default function SellerHome() {
  const [orders, setOrders] = useState([]);
  const [addPage, setAddPage] = useState(false);
  const { token, userId, leftovers, foodItems } = useContext(MyContext);

  useEffect(() => {
    // preventing navigation through browser navigation button
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function (event) {
      window.history.pushState(null, null, window.location.href);
    };

    const headers = {
      Authorization: 'Bearer ' + token,
    };

    //get orders
    fetch(`http://localhost:4000/order/${userId}`, { headers })
      .then((response) => {
        if (response.status >= 500) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        if (res.success === false) {
          alert(res.message);
          return;
        }
        console.log('orders', res);
        setOrders(res.data);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }, [token, userId]);

  return (
    <div
      className="container-fluid pb-2"
      style={{ backgroundColor: '#FBCEB1' }}
    >
      {/* horizontal heading */}
      <HorizontalHeader />

      {/* Home Page content or addPage */}
      {!addPage ? (
        <>
          {/* bar graph $ add new $ recent sales  */}
          <div
            className="row my-2 mx-1 justify-content-between"
            style={{ height: '45vh', backgroundColor: 'white' }}
          >
            <div className="col-md-6" style={{ backgroundColor: 'white' }}>
              <Bar options={options} data={data} />
            </div>
            <div
              className="col-md-6"
              style={{ backgroundColor: '#FBCEB1', height: '100%' }}
            >
              <div
                className="row"
                style={{ paddingLeft: '10px', height: '100%' }}
              >
                <div
                  className="col-md-12 d-flex justify-content-center align-items-center fs-4"
                  style={{ height: '15%', backgroundColor: 'white' }}
                >
                  <button
                    className="btn fs-4"
                    onClick={() => {
                      setAddPage(true);
                    }}
                  >
                    + add new food Item
                  </button>
                </div>
                <div className="col-md-12 pt-2" style={{ height: '85%' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: 'white',
                    }}
                    className="p-2 row overflow-scroll"
                  >
                    <div className="fs-5 ">Recent Sales</div>
                    {orders.map((element) => {
                      return (
                        <div className="col-md-6 my-2 d-flex align-items-center">
                          <div style={{ marginRight: '10px' }}>
                            <img
                              src={require(`../../../uploads/${element.Image}`)}
                              alt="loading"
                              height={50}
                            />
                          </div>
                          <div>
                            <div>
                              {new Date(element.orderOn).toDateString()}
                            </div>
                            <div>{element.name}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* in my shop  */}
          <div
            className="row my-2 mx-1 rounded-3 p-4 justify-content-between"
            style={{ backgroundColor: 'white' }}
          >
            <div className="col-md-12">In my shop</div>
            {leftovers.map((element) => {
              const selectedItem = foodItems.find(
                (item) => item._id === element.productId,
              );
              if (!selectedItem) {
                return null;
              }
              console.log(selectedItem);
              return (
                <div className="col-md-6 p-4" key={element._id}>
                  <div
                    className="row p-3 rounded-2"
                    style={{ backgroundColor: '#FBCEB1' }}
                  >
                    <div className="col-md-4">
                      <img
                        src={require(`../../../uploads/${selectedItem.img}`)}
                        alt="food"
                        height="90%"
                        width="100%%"
                        className="rounded-2"
                      />
                    </div>
                    <div className="col-md-8">
                      <p className="text-dark">name: {element.name}</p>
                      <p className="text-dark">type: {selectedItem.type}</p>
                      <p className="text-dark">category: {element.category}</p>
                      <p className="text-dark">
                        reducedPrice: {element.reducedPrice}
                      </p>
                      <p className="text-dark">
                        originalPrice: {element.originalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* table  */}
          <div
            className="row my-2 mx-1 rounded-3 p-4"
            style={{ backgroundColor: 'white' }}
          >
            <div className="col-md-3 text-danger">New Orders</div>
            <div className="col-md-3">Unclaimed</div>
            <div className="col-md-3">Refunds</div>
            <div className="col-md-3">Transaction history</div>
            <div className="col-md-12 my-4">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Product Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Picked by</th>
                    <th scope="col">Price</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Egg Salad</th>
                    <td>1</td>
                    <td>Aman</td>
                    <td>$50</td>
                    <td className="text-warning">in progress</td>
                  </tr>
                  <tr>
                    <th>Baked Goods</th>
                    <td>1</td>
                    <td>Harshit</td>
                    <td>$12</td>
                    <td className="text-warning">in progress</td>
                  </tr>
                  <tr>
                    <th>Magic Bag</th>
                    <td>1</td>
                    <td>Kasim</td>
                    <td>$20</td>
                    <td className="text-success">completed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <AddNewFood foodItems={foodItems} setAddPage={setAddPage} />
      )}
    </div>
  );
}
