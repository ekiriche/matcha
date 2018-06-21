<?php
namespace App\Controllers\Profile;
use App\Controllers\Controller;
use App\Auth;
use App\Profile;
use App\Config\db;
use Respect\Validation\Validator as v;
class ProfileController extends Controller
{
	public function postEditProfile($request, $response)
	{
		$db = new db();
		$db = $db->connect();
	//	return json_encode($request);
		$validation = $this->validator->validate($request, [
			'gender' => v::notEmpty(),
			'sexual_preference' => v::notEmpty(),
			'birthdate' => v::notEmpty()->date('d-m-yy'),
			'age' => v::notEmpty()->between(17, 110),
      'email' => v::notEmpty()->email(),
      'firstname' => v::noWhitespace()->notEmpty()->length(2, 32)->alpha(),
      'lastname' => v::noWhitespace()->notEmpty()->length(2, 32)->alpha(),
      'biography' => v::notEmpty()->length(1, 200),
      'tags' => v::notEmpty()->noWhitespace()->length(1, 50)
		]);
		if ($validation->failed())
			return json_encode($_SESSION['errors']);
		$user_info = $this->profile->getInfo($request->getParam('login'), 'all');
		$user_id = $user_info['user_id'];
		//$tags = implode(",", $request->getParam('tags'));
		$tags = $request->getParam('tags');
		$login = $request->getParam('login');
		// create record if not exists
		$stm = $db->prepare("SELECT * FROM user_profile WHERE user_id = '$user_id'");
		$stm->execute();
		if ($stm->rowCount() == 0)
		{
			$stm = $db->prepare("INSERT INTO user_profile (user_id, login, fame_rating) VALUES ('$user_id' ,'$login', 0)");
			$stm->execute();
		}
		// get users location
		if ($request->getParam('location') == '')
		{
			$location = json_decode(file_get_contents('https://geoip-db.com/json'));
			$latitude = $location->latitude;
			$longitude = $location->longitude;
			$user_location = $location->country_name . ", " . $location->city;
		}
		else {
			$formated_address = str_replace(' ', '+', $request->getParam('location'));
			$geocode = file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address='.$formated_address.'&sensor=false&key=AIzaSyAnXKgcvlNxzXV4Dk6GHKzzeMZjp4kyBJs');
			$geocode = json_decode($geocode);
			if ($geocode->status != "OK")
			{
				$_SESSION['errors']['location'] = 'Location does not exists';
				return json_encode($_SESSION['errors']);
			}
			$latitude = $geocode->results[0]->geometry->location->lat;
			$longitude = $geocode->results[0]->geometry->location->lng;
			$user_location = $geocode->results[0]->formatted_address;
		}
		// update info in users
		$stm = $db->prepare("UPDATE user_profile SET gender = ?, sexual_preference = ?, birthdate = ?, age = ?, biography = ?, tags = ?, latitude = ?, longitude = ?, location = ? WHERE user_id = '$user_id'");
		$stm->bindParam(1, $request->getParam('gender'));
		$stm->bindParam(2, $request->getParam('sexual_preference'));
		$stm->bindParam(3, $request->getParam('birthdate'));
		$stm->bindParam(4, $request->getParam('age'));
		$stm->bindParam(5, htmlspecialchars($request->getParam('biography')));
		$stm->bindParam(6, $tags);
		$stm->bindParam(7, $latitude);
		$stm->bindParam(8, $longitude);
		$stm->bindParam(9, $user_location);
		$stm->execute();
		// update info in users_profile
		$stm = $db->prepare("UPDATE users SET email = ?, firstname = ?, lastname = ?, is_authorised = ? WHERE id = '$user_id'");
		$stm->bindParam(1, $request->getParam('email'));
		$stm->bindParam(2, $request->getParam('firstname'));
		$stm->bindParam(3, $request->getParam('lastname'));

		// Change level of access if needed
		$query = $db->query("SELECT id FROM pictures WHERE user_id = '$user_id' AND is_main_picture = 1");
		$access_level = $query->fetch(\PDO::FETCH_ASSOC);
		if ($access_level == false)
			$access_level = 1;
		else
			$access_level = 2;

		$stm->bindParam(4, $access_level);

		$stm->execute();
		return (json_encode('OK'));
	}
	public function postChangePassword($request, $response)
	{
		$db = new db();
		$db = $db->connect();
		$validation = $this->validator->validate($request, [
           'new_password' => v::notEmpty()->noWhitespace()->alnum()->length(6, 32)->HardPassword()
		]);
		if ($validation->failed())
			return json_encode($_SESSION['errors']);
		$hashed_password = hash('sha256', $request->getParam('old_password'));
		$user_info = $this->profile->getInfo($request->getParam('login'), 'all');
		if ($hashed_password != $user_info['password'])
		{
			$_SESSION['old_password'] = "Password is wrong";
			return json_encode($_SESSION['errors']);
		}
		$stm = $db->prepare("UPDATE users SET password = ? WHERE login = ?");
		$stm->bindParam(1, hash('sha256', $request->getParam('new_password')));
		$stm->bindParam(2, $request->getParam('login'));
		$stm->execute();
		return (json_encode("OK"));
	}
	public function postMainPicture($request, $response)
	{
		$db = new db();
		$db = $db->connect();
		//return json_encode($request->getParams());
		$img = $request->getParam(0);
		$login = $request->getParam(1);
		if (substr($img, 0, 4) == "http")
			return ("OK");
		$img = $this->transformToBase64($img);
		$data = base64_decode($img);
		if (!is_dir("./photos"))
			mkdir("./photos");
		$dir_path = "./photos/" . $request->getParam(1);
		if (!is_dir($dir_path))
			mkdir($dir_path);
		$filename = $dir_path . "/" . $request->getParam(1) . "_main_picture_" . time() . ".png";
		file_put_contents($filename, $data);
		$filename = "http://localhost:8100/public/photos/" . $request->getParam(1) . "/" . $request->getParam(1) . "_main_picture_" . time() . ".png";
//		$user_info = $this->profile->getInfo($request->getParam(1), 'all');
//		$user_id = $user_info["user_id"];
		$query = $db->query("SELECT id FROM users WHERE login = '$login'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		$user_id = $result['id'];
		$stm = $db->prepare("DELETE FROM pictures WHERE user_id = '$user_id' AND is_main_picture = 1");
		$stm->execute();
		$stm = $db->prepare("INSERT INTO pictures (user_id, path, is_main_picture) VALUES ('$user_id', '$filename', 1)");
		$stm->execute();

		// Change access level if needed

		$query = $db->query("SELECT id FROM user_profile WHERE user_id = '$user_id'");
		$access_level = $query->fetch(\PDO::FETCH_ASSOC);
		if ($access_level != false)
		{
			$stm = $db->prepare("UPDATE users SET is_authorised = 2 WHERE id = '$user_id'");
			$stm->execute();
		}
		return ("OK");
	}
	public function removeMainPicture($request, $response)
	{
		$db = new db();
		$db = $db->connect();
		$user_info = $this->profile->getInfo($request->getParam(0), 'all');
		$user_id = $user_info["user_id"];
		$stm = $db->prepare("DELETE FROM pictures WHERE user_id = '$user_id'");
		$stm->execute();
		$path_to_delete = './photos/' . $request->getParam(0);
		system("rm -rf '$path_to_delete'");
		return "OK";
	}
	public function postAdditionalPictures($request, $response)
	{
		$db = new db();
		$db = $db->connect();
		$login = $request->getParam(1);
		$images = $request->getParam(0);
		$i = 0;
		$user_info = $this->profile->getInfo($request->getParam(1), 'all');
		$user_id = $user_info["user_id"];
		if (!is_dir("./photos"))
			mkdir("./photos");
		$dir_path = "./photos/" . $login;
		if (!is_dir($dir_path))
			mkdir($dir_path);
		$stm = $db->prepare("DELETE FROM pictures WHERE user_id = '$user_id' AND is_main_picture = 0");
		$stm->execute();
		while ($images[$i])
		{
			if (substr($images[$i], 0, 4) == "http")
			{
				$filename = $images[$i];
				$stm = $db->prepare("INSERT INTO pictures (user_id, path, is_main_picture) VALUES ('$user_id', '$filename', 0)");
				$stm->execute();
			}
			else
			{
				$img = $this->transformToBase64($images[$i]);
				$data = base64_decode($img);
				$filename = $dir_path . "/" . $login . "_additional_" . $i . "_" . time() . ".png";
				file_put_contents($filename, $data);
				$filename = "http://localhost:8100/public/photos/" . $login . "/" . $login . "_additional_" . $i . "_" . time() . ".png";
				$stm = $db->prepare("INSERT INTO pictures (user_id, path, is_main_picture) VALUES ('$user_id', '$filename', 0)");
				$stm->execute();
			}
			$i++;
		}
		return ("OK");
	}
	public function transformToBase64($img)
	{
		$img = str_replace('data:image/png;base64,', '', $img);
		$img = str_replace('data:image/jpeg;base64,', '', $img);
		$img = str_replace('data:image/jpg;base64,', '', $img);
		$img = str_replace(' ', '+', $img);
		return $img;
	}
	public function getProfileByLogin($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$login = $request->getParam('login');
		$query = $db->query("SELECT id FROM users WHERE login = '$login'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		if ($result == false)
			return "false";
		return (json_encode($this->profile->getInfo($request->getParam('login'), $request->getParam('column'))));
	}
	public function getProfileByUserId($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$user_id = $request->getParam('user_id');
		$query = $db->query("SELECT id FROM users WHERE id = '$user_id'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		if ($result == false)
			return "false";
		$result = $this->profile->getInfoByUserId($request->getParam('user_id'));
		$result['is_connected'] = $this->Tokens->tokenNotExpired($result['access_token']);
		return (json_encode($result));
	}

	public function getAllUsersInfo($request, $response)
	{
		return json_encode($this->profile->getAllUsersInfoForMap());
	}

	public function getAccessLevel($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$user_id = $request->getParam('user_id');
		$query = $db->query("SELECT is_authorised FROM users WHERE id = '$user_id'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		return json_encode($result['is_authorised']);
	}

	public function idExists($request, $response)
	{
		$db = new db();
		$db = $db->connect();
		$user_id = $request->getParam('user_id');
		$stm = $db->prepare("SELECT id FROM users WHERE id = '$user_id'");
		$stm->execute();
		if ($stm->rowCount() == 0)
			return 'false';
		return 'true';
	}

	public function addToChatHistory($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$user_id = $request->getParam('currentUser');
		$target_id = $request->getParam('sendUser');
		$message = $request->getParam('message');

		$validation = $this->validator->validate($request, [
			'message' => v::NotEmpty()->length(1, 200)
		]);

		if ($validation->failed())
			return $_SESSION['error'];

		$stm = $db->prepare("INSERT INTO chat_history (user_id, target_id, message) VALUES ('$user_id', '$target_id', ?)");
		$stm->bindParam(1, htmlspecialchars($message));
		$stm->execute();
		return "OK";
	}

	public function getChatHistory($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$user1 = $request->getParam('currentUser');
		$user2 = $request->getParam('sendUser');
		$user1_info = $this->profile->getInfoByUserId($user1);
		$user2_info = $this->profile->getInfoByUserId($user2);
		$query = $db->query("SELECT * FROM chat_history WHERE (user_id = '$user1' AND target_id = '$user2') OR (user_id = '$user2' AND target_id = '$user1')");
		$result = $query->fetchAll(\PDO::FETCH_ASSOC);
		foreach ($result as $key => $value) {
			if ($value['user_id'] == $user1)
			{
				$result[$key]['firstname'] = $user1_info['firstname'];
				$result[$key]['lastname'] = $user1_info['lastname'];
			}
			else {
				{
					$result[$key]['firstname'] = $user2_info['firstname'];
					$result[$key]['lastname'] = $user2_info['lastname'];
				}
			}
		}
	//	$query = $db->query("SELECT message, time FROM chat_history WHERE user_id = '$user2' AND target_id = '$user1'");
	//	$result2 = $query->fetchAll(\PDO::FETCH_ASSOC);
	//	$result = array_merge($result1, $result2);
		return json_encode($result);
	}
}

?>
