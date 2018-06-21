import React from 'react';

function BackgroundVideo() {

  return (
    <video autoPlay muted loop id="myVideo" poster="background.jpeg">
      <source src="Fun at a Fair.mp4" type="video/mp4"/>
    </video>
  );
}

export default BackgroundVideo;
