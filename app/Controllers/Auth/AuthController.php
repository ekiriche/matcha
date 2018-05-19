<?php

namespace App\Controllers\Auth;

use App\Config\db;
use App\Controllers\Controller;
use App\SendMail\SendMail;
use Respect\Validation\Validator as v;
use App\Auth;

class AuthController extends Controller
{
    public function confirmSignin($requset, $response)
    {
        $confirm = $this->auth->confirm_reg(
            $_GET['email'],
            $_GET['reg_link']
        );

        if ($confirm == false)
            return $response->withRedirect($this->router->pathFor('home'));

        return $response->withRedirect($this->router->pathFor('auth.signin'));
    }

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
            'login' => v::noWhitespace()->notEmpty()->length(4, 16)->alnum()->LoginAvailable(), 
            'email' => v::notEmpty()->email()->EmailAvailable(),
            'first_name' => v::noWhitespace()->notEmpty()->length(2, 32)->alnum(),
            'last_name' => v::noWhitespace()->notEmpty()->length(2, 32)->alnum(),
            'password' => v::notEmpty()->noWhitespace()->alnum()->length(6, 32)->HardPassword(), 
        ]);
        
        if ($validation->failed())
        {
           return $response->withRedirect($this->router->pathFor('auth.signup')); 
        }
        
        $db = new db();
        $db = $db->connect();
        $email = $request->getParam('email');
        $hashed_link = hash("sha256", rand(0, 1000));
        
        $stm = $db->prepare("INSERT INTO users (login, email, first_name, last_name, password, reg_link) VALUES (?, ?, ?, ?, ?, ?)");
        $stm->bindParam(1, $request->getParam('login'));
        $stm->bindParam(2, $request->getParam('email'));
        $stm->bindParam(3, $request->getParam('first_name'));
        $stm->bindParam(4, $request->getParam('last_name'));
        $stm->bindParam(5, hash("sha256", $request->getParam('password')));
        $stm->bindParam(6, $hashed_link);
        $stm->execute();
        
        $this->SendMail->send_mail($email, "Click on the link to confirm your account: http://localhost:8100/public/auth/confirm?email=" . $email . "&reg_link=" . $hashed_link, "User creation");
        return $response->withRedirect($this->router->pathFor('home'));
    }
}

?>