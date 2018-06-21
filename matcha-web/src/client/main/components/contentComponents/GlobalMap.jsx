import React, { Component } from 'react';
import { compose, withProps, withHandlers } from "recompose";
import { PostData } from '../library/PostData';
import history from '../../../history/history';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";


const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
const demoFancyMapStyles = require("./Styles.json");

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {

    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={2}
    defaultCenter={{ lat: 50.0391667, lng: 40.525 }}
    defaultOptions={{ styles: demoFancyMapStyles }}
  >

    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map( (marker, i) => (
        <Marker
          key={i}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          icon={{ url: marker.path, scaledSize: {width: 35, height: 35} }}
          title={ marker.firstname + ' ' + marker.lastname }
          onClick={function() {
            let fullPath = '/profile/' + marker.id;
            history.push(fullPath);
          }}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
);

    class InteractiveMap extends Component
    {
      componentWillMount() {
        this.setState({ markers: [] })
      }

      componentDidMount() {
        PostData('profile/get_all_users_for_map', []).then ((result) => {
          this.setState({ markers : result });
        });
      }

      render() {
        return (
          <MapWithAMarkerClusterer markers={this.state.markers} />
        )
      }
    }

export default InteractiveMap;
