import { useContext, useEffect, useState } from 'react';
import Countdown from '../components/timer/countdown';
import { MyContext } from '../context';
import ConfirmatioPage from './confirmationPage';
import StarRatings from 'react-star-ratings';

export default function Order(props) {
  const [confirmationPage, setConfirmationPage] = useState(false);
  const [review, setReview] = useState({});
  const [star, setStar] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const { token } = useContext(MyContext);

  useEffect(() => {
    const headers = {
      Authorization: 'Bearer ' + token,
    };
    // get review
    fetch(`http://localhost:4000/review/${props.selectedFood._id}`, { headers })
      .then((response) => {
        console.log(response);
        if (response.status >= 500) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        console.log('review', res);
        if (res.succcess === false) {
          alert(res.message);
          return;
        }
        setReview(res.data);
        setStar(res.data.star);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }, []);

  const renderTimer = () => {
    const timeLeft = Math.floor(
      (new Date(props.selectedFood.offset) - new Date()) / 1000,
    );
    return <Countdown timeLeft={timeLeft} />;
  };

  return (
    <div
      className="row justify-content-between "
      style={{ width: '80%', margin: 'auto', backgroundColor: 'white' }}
    >
      {!confirmationPage ? (
        <>
          <div
            className="col-md-12 d-flex flex-column"
            style={{
              width: '100%',
              height: '30vh',
              overflow: 'hidden',
            }}
          >
            <img
              src={require(
                `../../../uploads/${props.selectedFood.productId.img}`,
              )}
              alt="loading"
              width={'100%'}
            />
            <span
              className="bg-danger p-3 position-absolute text-light"
              style={{ top: '15vh' }}
            >
              only {props.selectedFood.quantity} left
            </span>
          </div>
          <div className="col-md-6 p-4">
            <h3>{props.selectedFood.name}</h3>
            <StarRatings
              rating={star}
              starRatedColor="orange"
              numberOfStars={5}
              isSelectable={false}
              starDimension="25px"
            />

            <p className="my-2">Review: {review.review}</p>
            <>{renderTimer()}</>
            <p>{props.selectedFood.address}</p>
            <h5>What you could get</h5>
            <p>
              Spaghetti Carbonara is a beloved Italian pasta dish that
              originated in Rome. It's known for its rich, creamy sauce made
              from eggs, cheese (typically Pecorino Romano or Parmesan),
              pancetta or guanciale (cured pork jowl), and black pepper. The
              dish is simple yet incredibly flavorful, showcasing the beauty of
              Italian cuisine.
            </p>
            <h5>What other people are saying</h5>
            <p>
              Linda: "Spaghetti Carbonara at Luigi's Trattoria was a revelation!
              The creamy sauce was perfectly balanced with just the right amount
              of cheese and pancetta. Each bite was like a taste of Italy.
              Highly recommended!"
              <br /> <br />
              Michael: "I've tried Spaghetti Carbonara in many places, but none
              compare to the one at Mama Mia's. The sauce was silky smooth, and
              the pancetta added a delightful crunch. It was like a hug in a
              bowl!"
            </p>
            <div className="my-2">
              <button
                className="btn border"
                onClick={() => {
                  if (quantity >= 1) {
                    setQuantity(quantity - 1);
                  }
                }}
              >
                -
              </button>
              <span className="mx-2">{quantity}</span>
              <button
                className="btn border"
                onClick={() => {
                  if (quantity + 1 <= props.selectedFood.quantity)
                    setQuantity(quantity + 1);
                }}
              >
                +
              </button>
            </div>
            <button
              className="btn bg-danger text-white"
              onClick={() => setConfirmationPage(true)}
              disabled={!quantity}
            >
              Reserve
            </button>
            <button
              className="btn mx-3"
              style={{ border: '1px solid darkorange' }}
              onClick={() => props.setOrderPage(false)}
            >
              Cancel
            </button>
          </div>
          <div className="col-md-3 p-4 ">
            <div className="rounded-3 p-3 " style={{ border: '1px solid red' }}>
              <dl>
                <dt className="text-success text-decoration-underline">
                  Ingredients & allergens
                </dt>
                <dd>{props.selectedFood.productId.ingredients}</dd>
              </dl>
            </div>
          </div>
        </>
      ) : (
        <ConfirmatioPage
          confirmFood={props.selectedFood}
          quantity={quantity}
          setOrderPage={props.setOrderPage}
        />
      )}
    </div>
  );
}
