<?php

namespace App\Controllers\Auth;

//include "../../config/db.php";
use App\Config\db;
use App\Controllers\Controller;

class AuthController extends Controller
{
	public function getSignup($request, $response)
    {
        return $this->view->render($response, 'auth/signup.twig');
    }
    
    public function postSignup($request, $response)
    {
        $db = new db();
        $db = $db->connect();
        
        $stm = $db->prepare("INSERT INTO users (login, email, password) VALUES ?, ?, ?");
        $stm->setParam(1, $request->getParam('login'));
        $stm->setParam(2, $request->getParam('email'));
        $stm->setParam(3, hash("sha256", $request->getParam('password')));
        $stm->execute();
        
        return $response->withRedirect($this->router->pathFor('home'));
    }
}

?>