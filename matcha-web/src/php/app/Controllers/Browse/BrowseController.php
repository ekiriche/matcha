<?php

namespace App\Controllers\Browse;

use App\Controllers\Controller;
use App\Auth;
use App\Profile;
use App\Config\db;
use App\Geolocation;
use Respect\Validation\Validator as v;

class BrowseController extends Controller
{
	public function ultimateSearch($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$user_info = $this->profile->getInfoByUserId($request->getParam('user_id'));
		$user_id = $user_info['user_id'];
		$user_latitude = $user_info['latitude'];
		$user_longitude = $user_info['longitude'];
		$user_gender = $user_info['gender'];
		$user_preference = $user_info['sexual_preference'];

		$min_age = $request->getParam('minAge');
		$max_age = $request->getParam('maxAge');
		$min_fame = $request->getParam('minFame');
		$max_fame = $request->getParam('maxFame');
		$max_distance = $request->getParam('maxDistance');
		$tags_search = explode(',', $request->getParam('tags'));

		/*$validation = $this->validator->validate($request, [
			'tags' => v::noWhitespace()
		]);
		if ($validation->failed())
			return $_SESSION['errors'];*/

		$query = $db->query("SELECT users.id, users.firstname, users.lastname, user_profile.gender, user_profile.sexual_preference, user_profile.fame_rating, user_profile.age, pictures.path, user_profile.tags, user_profile.latitude, user_profile.longitude, user_profile.location FROM ((users INNER JOIN user_profile ON users.id = user_profile.user_id) INNER JOIN pictures ON users.id = pictures.user_id) WHERE user_profile.age >= '$min_age' AND user_profile.age <= '$max_age' AND user_profile.fame_rating >= '$min_fame' AND user_profile.fame_rating <= '$max_fame' AND pictures.is_main_picture = 1 AND users.id != '$user_id'");
		$result = $query->fetchAll(\PDO::FETCH_ASSOC);

		//return json_encode($result);
		foreach($result as $key => $item)
		{
			if ($this->isUserBlocked($user_id, $item['id']) == true)
				unset($result[$key]);
			else if ($this->genderAndPreferenceCompare($user_gender, $user_preference, $item['gender'], $item['sexual_preference']) == false)
				unset($result[$key]);
			else if ($tags_search[0] != '')
			{
				$tags = explode(',', $item['tags']);
			//	return json_encode($tags);
				foreach($tags_search as $tag)
				{
					if (in_array($tag, $tags) == false)
					{
						unset($result[$key]);
						break ;
					}
				}
			}
			else
			{
				$distance = $this->Geolocation->getDistance($user_latitude, $user_longitude, $item['latitude'], $item['longitude']);
				if ($distance > $max_distance)
					unset($result[$key]);
				else
					$result[$key]['distance'] = $distance;
				//return json_encode($user_latitude);
				//return json_encode($distance);
			}
		}
		$result = $this->ultimateSort($result, $user_info);
		return json_encode($result);
	}

	public function ultimateSort($result, $user_info)
	{
		foreach ($result as $key => $item)
		{
			$result[$key]['interest'] = $item['fame_rating'];
			if ($item['location'] == $user_info['location'])
				$result[$key]['interest'] += 500;
			else if ($item['distance'] <= 50)
				$result[$key]['interest'] += 400;
			else if ($item['distance'] <= 100)
				$result[$key]['interest'] += 300;
			else if ($item['distance'] <= 150)
				$result[$key]['interest'] += 200;
			else if ($item['distance'] <= 200)
				$result[$key]['interest'] += 100;
			else if ($item['distance'] <= 250)
				$result[$key]['interest'] += 50;
			$search_tags = explode(',', $item['tags']);
			$user_tags = explode(',', $user_info['tags']);
			$result[$key]['interest'] += count(array_intersect($search_tags, $user_tags)) * 25;
			$result[$key]['identical_tags'] = count(array_intersect($search_tags, $user_tags));
		}
		usort($result, function($a, $b) {
			if ($a['interest'] == $b['interest'])
				return 0;
			return ($a['interest'] < $b['interest']) ? 1 : -1;
		});
		return $result;
	}

	public function genderAndPreferenceCompare($gender1, $pref1, $gender2, $pref2)
	{
		if ($gender1 == 'female' && $pref1 == 'heterosexual')
		{
			if ($gender2 == 'male' && $pref2 != 'homosexual')
				return true;
			return false;
		}
		if ($gender1 == 'female' && $pref1 == 'homosexual')
		{
			if ($gender2 == 'female' && $pref2 != 'heterosexual')
				return true;
			return false;
		}
		if ($gender1 == 'female' && $pref1 == 'bisexual')
		{
			if ($pref2 == 'bisexual' || ($gender2 == 'female' && $pref2 == 'homosexual'))
				return true;
			return false;
		}
		if ($gender1 == 'male' && $pref1 == 'heterosexual')
		{
			if ($gender2 == 'female' && $pref2 != 'homosexual')
				return true;
			return false;
		}
		if ($gender1 == 'male' && $pref1 == 'homosexual')
		{
			if ($gender2 == 'male' && $pref2 != 'heterosexual')
				return true;
			return false;
		}
		if ($gender1 == 'male' && $pref1 == 'bisexual')
		{
			if ($pref2 == 'bisexual' || ($gender2 == 'male' && $pref2 == 'homosexual'))
				return true;
			return false;
		}
}
		public function isUserBlocked($user_id, $target)
		{
			$db = new db();
			$db = $db->connect();

			$query = $db->query("SELECT blocker, target FROM blocks WHERE blocker = '$user_id' AND target = '$target'");
			$result = $query->fetch(\PDO::FETCH_ASSOC);
			if ($result == false)
				return false;
			return true;
		}
}
