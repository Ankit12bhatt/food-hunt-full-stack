import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../context';

export default function Help() {
  const { token, userId } = useContext(MyContext);
  const [msg, setMsg] = useState('');
  const [order, setOrder] = useState([]);

  const getchats = () => {
    //get Chats
    fetch(`http://localhost:4000/chat/${userId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        if (response.status >= 500) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((res) => {
        console.log('Chatssssss', res);
        if (res.success === false) {
          alert(res.message);
          return;
        }
        setOrder(res.data);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getchats();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendMsg = () => {
    fetch('http://localhost:4000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        key: userId,
        message: msg,
        user: 'buyer',
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
        console.log('msggg....', res);
        if (res.success === false) {
          alert(res.message);
          return;
        }
        getchats();
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: '#FBCEB1', height: '90vh' }}
    >
      <div
        className=" p-4  flex-column"
        style={{
          width: '76%',
          margin: 'auto',
          backgroundColor: 'white',
          height: '70vh',
          overflowY: 'scroll',
        }}
      >
        {order.map((msgDetails) => {
          if (msgDetails.user === 'foodio') {
            return (
              <div className="  align-self-start d-flex my-1">
                <span
                  className="p-2"
                  style={{
                    backgroundColor: 'orange',
                    borderRadius: '0px 10px 10px 10px',
                  }}
                >
                  {msgDetails.message}
                </span>
              </div>
            );
          } else {
            return (
              <div className="  align-self-end justify-content-end d-flex my-1">
                <span
                  className="p-2"
                  style={{
                    backgroundColor: 'orange',
                    borderRadius: '10px 0px 10px 10px',
                  }}
                >
                  {msgDetails.message}
                </span>
              </div>
            );
          }
        })}
      </div>
      <div
        className="row position-fixed p-2 rounded-5 justify-content-between align-items-center border bg-light"
        style={{ bottom: '5%', width: '75%', left: '13%' }}
      >
        <div className="col-md-11 px-0">
          <input
            type="text"
            className="px-3"
            style={{ width: '100%', backgroundColor: 'white', border: '0px' }}
            placeholder="typing something..."
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          />
        </div>
        <div className="col-md-1 px-0 d-flex flex-column">
          <img
            className="align-self-end"
            alt="loading"
            src={require('../assets/send.png')}
            height={40}
            width={40}
            onClick={() => {
              sendMsg();
            }}
          />
        </div>
      </div>
    </div>
  );
}
