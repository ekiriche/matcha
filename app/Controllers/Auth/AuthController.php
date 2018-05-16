<?php

namespace App\Controllers\Auth;

use App\Config\db;
use App\Controllers\Controller;
use Respect\Validation\Validator as v;

class AuthController extends Controller
{
	public function getSignup($request, $response)
    {
        return $this->view->render($response, 'auth/signup.twig');
    }
    
    public function postSignup($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'login' => v::noWhitespace()->notEmpty()->length(4, 16)->alnum(), 
            'email' => v::notEmpty()->alnum()->email(), 
            'password' => v::notEmpty()->noWhitespace()->alnum()->length(6, 32), 
        ]);
        
        if ($validation->failed())
        {
           return $response->withRedirect($this->router->pathFor('auth.signup')); 
        }
        
        $db = new db();
        $db = $db->connect();
        
        $stm = $db->prepare("INSERT INTO users (login, email, password) VALUES (?, ?, ?)");
        $stm->bindParam(1, $request->getParam('login'));
        $stm->bindParam(2, $request->getParam('email'));
        $stm->bindParam(3, hash("sha256", $request->getParam('password')));
        $stm->execute();
        
        return $response->withRedirect($this->router->pathFor('home'));
    }
}

?>