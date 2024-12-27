import { useContext, useEffect } from 'react';
import { MyContext } from '../../context';

export default function HorizontalHeader() {
  const { token, setUser, user } = useContext(MyContext);

  useEffect(() => {
    const headers = {
      Authorization: 'Bearer ' + token,
    };
    //get user profile
    fetch(`http://localhost:4000/user`, { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((res) => {
        console.log('UserProfile', res);
        setUser(res.data);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  },[setUser,token]);
  return (
    <div className="row">
      <div
        className="col-md-6 d-flex align-items-center justify-content-center "
        style={{ backgroundColor: 'white', height: '8vh' }}
      >
        <div
          style={{ width: '100%', border: '1px solid lightgrey' }}
          className="p-2 rounded-3"
        >
          <input
            type="text"
            style={{ width: '92%', marginRight: '10px', borderWidth: '0px' }}
            placeholder="search your food here..."
          />
          <img src={require('../../assets/Search icon.png')} alt="loading" />
        </div>
      </div>
      <div
        className="col-md-6 d-flex align-items-center justify-content-end "
        style={{ backgroundColor: 'white', height: '8vh' }}
      >
        <div
          style={{ width: '25%' }}
          className="rounded-3 d-flex align-items-center"
        >
          <span className="px-2">{user.businessName}</span>
          <img
            src={require('../../assets/Image.png')}
            alt="loading"
            height="40px"
            width="40px"
          />
        </div>
      </div>
    </div>
  );
}
