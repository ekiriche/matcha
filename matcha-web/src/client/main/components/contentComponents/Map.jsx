import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const demoFancyMapStyles = require("./Styles.json");

const Map = compose(

  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCZDsnnP3wdQoZBkk5ND-RTw7YtBbQRgik&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />
      }),
      withScriptjs,
      withGoogleMap
    )(props => (
      <GoogleMap defaultZoom={8} defaultCenter={{ lat: props.latitude, lng: props.longitude }} defaultOptions={{ styles: demoFancyMapStyles }}>
          <Marker position={{ lat: props.latitude, lng: props.longitude }} />
      </GoogleMap>
    ));

export default Map;
