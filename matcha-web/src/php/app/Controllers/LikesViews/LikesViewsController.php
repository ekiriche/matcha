<?php

namespace App\Controllers\LikesViews;

use App\Controllers\Controller;
use App\Auth;
use App\Profile;
use App\Config\db;

class LikesViewsController extends Controller
{
	public function handleLike($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$liker = $request->getParam('user_id');
		$target = $request->getParam('target');

		if ($liker == $target)
			return "xD";
		if ($this->isLiked($request, $response) == "false")
		{
			$stm = $db->prepare("INSERT INTO likes (liker, target) VALUES ('$liker', '$target')");
			$stm->execute();
			$stm = $db->prepare("UPDATE user_profile SET fame_rating = fame_rating + 10 WHERE user_id = '$target'");
			$stm->execute();
			return "INSERTED";
		}
		$stm = $db->prepare("DELETE FROM likes WHERE liker = '$liker' AND target = '$target'");
		$stm->execute();
		$stm = $db->prepare("UPDATE user_profile SET fame_rating = fame_rating - 10 WHERE user_id = '$target'");
		$stm->execute();
		return "DELETED";
	}

	public function isLiked($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$liker = $request->getParam('user_id');
		$target = $request->getParam('target');
		$query = $db->query("SELECT liker, target FROM likes WHERE liker = '$liker' AND target = '$target'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		if ($result == false)
			return "false";
		return "true";
	}

	public function handleView($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$viewer = $request->getParam('user_id');
		$target = $request->getParam('target');
		if ($viewer == $target)
			return "SAME PERSON";
		if ($this->isViewed($request, $response) == "false")
		{
			$stm = $db->prepare("INSERT INTO views (viewer, target) VALUES ('$viewer', '$target')");
			$stm->execute();
			$stm = $db->prepare("UPDATE user_profile SET fame_rating = fame_rating + 5 WHERE user_id = '$target'");
			$stm->execute();
			return ("ADDED");
		}
		return ("ALREADY VIEWED");
	}

	public function isViewed($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$viewer = $request->getParam('user_id');
		$target = $request->getParam('target');
		$query = $db->query("SELECT viewer, target FROM views WHERE viewer = '$viewer' AND target = '$target'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		if ($result == false)
			return "false";
		return "true";
	}

	public function getLikes($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$target = $request->getParam('user_id');
		$query = $db->query("SELECT liker, firstname, lastname, path FROM ((likes INNER JOIN users ON likes.liker = users.id) INNER JOIN pictures ON likes.liker = pictures.user_id) WHERE target = '$target' AND pictures.is_main_picture = 1");
		$result = $query->fetchAll(\PDO::FETCH_ASSOC);
		return json_encode($result);
	}

	public function getViews($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$target = $request->getParam('user_id');
		$query = $db->query("SELECT viewer, firstname, lastname, path FROM ((views INNER JOIN users ON views.viewer = users.id) INNER JOIN pictures ON views.viewer = pictures.user_id) WHERE target = '$target' AND pictures.is_main_picture = 1");
		$result = $query->fetchAll(\PDO::FETCH_ASSOC);
		return json_encode($result);
	}

	public function reportUser($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$reporter = $request->getParam('user_id');
		$target = $request->getParam('target');
		if ($reporter == $target)
			return "xD";
		if ($this->isReported($request, $response) == "false")
		{
			$stm = $db->prepare("INSERT INTO reports (reporter, target) VALUES ('$reporter', '$target')");
			$stm->execute();
			$stm = $db->prepare("UPDATE user_profile SET fame_rating = fame_rating - 10 WHERE user_id = '$target'");
			$stm->execute();
			return "REPORTED";
		}
		return "ALREADY REPORTED";
	}

	public function isReported($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$reporter = $request->getParam('user_id');
		$target = $request->getParam('target');
		$query = $db->query("SELECT reporter, target FROM reports WHERE reporter = '$reporter' AND target = '$target'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		if ($result == false)
			return "false";
		return "true";
	}

	public function blockUser($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$blocker = $request->getParam('user_id');
		$target = $request->getParam('target');
		if ($blocker == $target)
			return "xD";
		if ($this->isBlocked($request, $response) == "false")
		{
			$stm = $db->prepare("INSERT INTO blocks (blocker, target) VALUES ('$blocker', '$target')");
			$stm->execute();
			$stm = $db->prepare("UPDATE user_profile SET fame_rating = fame_rating - 5 WHERE user_id = '$target'");
			$stm->execute();
			return "BLOCKED";
		}
		return "ALREADY BLOCKED";
	}

	public function isBlocked($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$blocker = $request->getParam('user_id');
		$target = $request->getParam('target');
		$query = $db->query("SELECT blocker, target FROM blocks WHERE blocker = '$blocker' AND target = '$target'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		if ($result == false)
			return "false";
		return "true";
	}

	public function getConnectedUsers($request, $response)
	{
		$db = new db();
		$db = $db->connect();

		$user_id = $request->getParam('user_id');
		$query = $db->query("SELECT target FROM likes WHERE liker = '$user_id'");
		$result1 = $query->fetchAll(\PDO::FETCH_ASSOC);
		foreach ($result1 as $key => $item)
		{
			$liker = $item['target'];
			$query = $db->query("SELECT target FROM likes WHERE target = '$user_id' AND liker = '$liker'");
			$result2 = $query->fetch(\PDO::FETCH_ASSOC);
			if ($result2 == false)
				unset($result1[$key]);
			else {
				$query = $db->query("SELECT pictures.path, users.firstname, users.lastname FROM users INNER JOIN pictures ON users.id = pictures.user_id WHERE users.id = $liker AND pictures.is_main_picture = 1");
				$result3 = $query->fetch(\PDO::FETCH_ASSOC);
				$result1[$key]['path'] = $result3['path'];
				$result1[$key]['firstname'] = $result3['firstname'];
				$result1[$key]['lastname'] = $result3['lastname'];
			}
		}
		return json_encode(array_values($result1));
	}
}
