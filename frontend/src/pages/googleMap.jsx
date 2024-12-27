import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect } from 'react';

const containerStyle = {
  width: '100%',
  height: '600px',
};

function MyGoogleMap(props) {
  useEffect(() => {
    console.log(markerPosition);
  });

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDsJHCcluZRObeBN4PPrHfq52cAJ1d7Bhk', // Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key
  });

  const [map, setMap] = React.useState(null);
  const [markerPosition, setMarkerPosition] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div
      className="row justify-content-center align-items-center "
      style={{ height: '92vh' }}
    >
      <div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 30.3499437, lng: 78.0626498 }}
          zoom={12}
          onClick={handleMapClick}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
        <div className="my-4">
          <button className="btn btn-success px-4">Save</button>
          <button
            className="btn btn-danger px-3 mx-3"
            onClick={() => {
              props.setMAP(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyGoogleMap;
