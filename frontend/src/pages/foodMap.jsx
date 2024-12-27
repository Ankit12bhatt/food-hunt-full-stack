import {
  GoogleMap,
  InfoWindow,
  useJsApiLoader
} from '@react-google-maps/api';
import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../context';

const containerStyle = {
  width: '100%',
  height: '600px',
};

function FoodMap(props) {
  const { nearByLeftovers } = useContext(MyContext);
  const [predefinedMarkers, setPredefinedMarkers] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [card, setCard] = useState(false);

  useEffect(() => {
    console.log('mappppppppp', nearByLeftovers);
    const updatedMarkers = nearByLeftovers.map((element, index) => {
      const latOffset = Math.random() * 0.01; 
      const lngOffset = Math.random() * 0.01;   
      // Modify the coordinates with the random offset
      const newPosition = {
        lat: element.location.coordinates[0] + latOffset,
        lng: element.location.coordinates[1] + lngOffset,
      };
      // Return the updated marker object
      return {
        position: newPosition,
        message: element.name,
        img: element.productId.img,
        _id:element._id
      };
    });
    // Set the state with the new array
    setPredefinedMarkers(updatedMarkers);
    console.log('useEffect', predefinedMarkers);
  }, []);

  const cardtorender=()=>{
    const selection=nearByLeftovers.find((element)=>element._id===selectedId)
    props.setSelectedFood(selection);
    return (
      <div className="container-fluid p-2" >
        <h5 className='row my-2'>
          Near You
        </h5>
        <div
          className="row p-3 rounded-2 justify-content-between"
          style={{ border: '1px solid darkorange' }}
          onClick={()=>{props.setOrderPage(true)}}
        >
          <div className="col-md-2">
            <img
              src={require(`../../../uploads/${selection.productId.img}`)}
              alt="food"
              height="120px"
              width="130px"
              className="rounded-2"
            />
          </div>
          <div className="col-md-9">
            <p className="text-dark fs-7">
              {selection.quantity} X {selection.name}
            </p>
            <p className="text-dark">
              Offer Price: {selection.reducedPrice}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDsJHCcluZRObeBN4PPrHfq52cAJ1d7Bhk',
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div
      className="row justify-content-center align-items-center my-4"
    >
      <div className="col-md-12 d-flex flex-column justify-content-center align-items-center">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 30.3499437, lng: 78.0626498 }}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {predefinedMarkers.map((marker, index) => (
            <InfoWindow
              position={marker.position}
              visible={true}
            >
              <button
                className="btn"
                onClick={() => {
                  setCard(true);
                  setSelectedId(marker._id)
                }}
              >
                <img
                  src={require(`../../../uploads/${marker.img}`)}
                  alt="loading"
                  height={20}
                  width={20}
                  className="rounded-5 mx-2"
                />
                <span className="fw-semibold">{marker.message}</span>
              </button>
            </InfoWindow>
          ))}
        </GoogleMap>
        {card&&selectedId?(cardtorender()):<></>}
      </div>
    </div>
  );
}

export default FoodMap;
