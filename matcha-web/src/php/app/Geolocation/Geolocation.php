<?php

namespace App\Geolocation;

class Geolocation
{
	function getDistance($point1_lat, $point1_long, $point2_lat, $point2_long) {
	// Calculate the distance in degrees
	$degrees = rad2deg(acos((sin(deg2rad($point1_lat))*sin(deg2rad($point2_lat))) + (cos(deg2rad($point1_lat))*cos(deg2rad($point2_lat))*cos(deg2rad($point1_long-$point2_long)))));
 
	$distance = $degrees * 111.13384;
	return round($distance, 5);
	}
}