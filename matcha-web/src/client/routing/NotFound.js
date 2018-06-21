import React from 'react';

import './NotFound.css';
/*
const NotFound = () => (
  <div className="main-content not-found">
    <i className="material-icon icn-error">error_outline</i>
    <h2>Page Not Found</h2>
    </div>
);
*/

const NotFound = () => (
	<div className="agileits-main">
		<div className="agileinfo-row">
			<div className="w3layouts-errortext ">
				<h2 className="titleAnimation">4<span className="titleAnimation">0</span>4</h2>
				<h1>Sorry! The page you were looking for could not be found </h1>
				<p className="w3lstext">You have been tricked into click on a link that can not be found. Please check the url or go to <a href="http://localhost:3000/">main page</a> and see if you can locate what you are looking for </p>
			</div>
		</div>
	</div>
);

export default NotFound;
