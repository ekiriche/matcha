<?php

namespace App\Controllers\Auth;

use App\Config\db;
use App\Controllers\Controller;
use Respect\Validation\Validator as v;
use App\Auth;

class AuthController extends Controller
{
    public function getSignout($request, $response)
    {
        $this->auth->logout();

        return $response->withRedirect($this->router->pathFor('home'));
    }

    public function getSignin($request, $response)
    {
        return $this->view->render($response, 'auth/signin.twig');
    }

    public function postSignin($request, $response)
    {
        $auth = $this->auth->attempt(
            $request->getParam('login'),
            $request->getParam('password')
        );

        if ($auth == false)
            return $response->withRedirect($this->router->pathFor('auth.signin'));

        return $response->withRedirect($this->router->pathFor('home'));
    }

	public function getSignup($request, $response)
    {
        return $this->view->render($response, 'auth/signup.twig');
    }
    
    public function postSignup($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'login' => v::noWhitespace()->notEmpty()->length(4, 16)->alnum(), 
            'email' => v::notEmpty()->email()->EmailAvailable(), 
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