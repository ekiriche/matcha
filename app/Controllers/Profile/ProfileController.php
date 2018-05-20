<?php

namespace App\Controllers\Profile;

use App\Controllers\Controller;
use App\Auth;

class ProfileController extends Controller
{
	public function getEditProfile($request, $response)
	{
		if ($this->auth->check() == false)
            return $response->withRedirect($this->router->pathFor('home'));
        return $this->view->render($response, 'profile/editProfile.twig');
	}

	public function postEditProfile($request, $response)
	{
		echo $request->getParam('optradio');
		die();
	}
}

?>