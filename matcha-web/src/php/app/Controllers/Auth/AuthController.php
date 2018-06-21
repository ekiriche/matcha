<?php

namespace App\Controllers\Auth;

use App\Config\db;
use App\Controllers\Controller;
use App\SendMail\SendMail;
use Respect\Validation\Validator as v;
use App\Auth;
use App\Tokens;

class AuthController extends Controller
{
    public function getCurrentUser($request, $response)
    {
        //echo $_SESSION['user'];
        return json_encode($this->auth->user());
    }

    public function postForgotPassword($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'email' => v::notEmpty()->email()->EmailExists()
        ]);
        if ($validation->failed())
            return json_encode(false);

        $db = new db();
        $db = $db->connect();

        $password = substr(hash('sha256', rand()), 0, 8);
        $hashed_password = hash('sha256', $password);
        $stm = $db->prepare("UPDATE users SET password = ? WHERE email = ?");
        $stm->bindParam(1, $hashed_password);
        $stm->bindParam(2, $request->getParam('email'));
        $stm->execute();
        $this->SendMail->send_mail($request->getParam('email'), "Your new password: " . $password, "New password");
        return json_encode(true);
    }

    public function confirmSignin($requset, $response)
    {
        $confirm = $this->auth->confirm_reg(
            $_GET['email'],
            $_GET['reg_link']
        );

       header("Location: http://localhost:3000");
       die();
    }

    public function postSignin($request, $response)
    {
        $db = new db();
        $db = $db->connect();

        $auth = $this->auth->attempt(
            $request->getParam('login'),
            $request->getParam('password')
        );

        if ($auth == true)
        {
            $login = $request->getParam('login');
            $result->jwtAccess = $this->Tokens->createAccessToken($request->getParam('login'), 1800);
            $stm = $db->prepare("UPDATE users SET last_visit = now() WHERE login = ?");
            $stm->bindParam(1, $request->getParam('login'));
            $stm->execute();
            $query = $db->query("SELECT is_authorised FROM users WHERE login = '$login'");
            $result->level = $query->fetch(\PDO::FETCH_ASSOC);

            return json_encode($result);
        }
        return json_encode(false);
    }

    public function createNewAccessToken($request, $response)
    {
      return ($this->Tokens->createAccessToken($request->getParam('username'), $request->getParam('expireTime')));
    }

    public function postSigninLoginField($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'login' => v::noWhitespace()->notEmpty()->length(4, 16)->alnum()->LoginAvailable()
        ]);

        if ($validation->failed())
            return json_encode($_SESSION["errors"]);
        return json_encode("OK");
    }

    public function postSigninFirstnameField($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'firstname' => v::noWhitespace()->notEmpty()->length(4, 16)->alpha()
        ]);

        if ($validation->failed())
            return json_encode($_SESSION["errors"]);
        return json_encode(true);
    }

    public function postSigninLastnameField($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'lastname' => v::noWhitespace()->notEmpty()->length(4, 16)->alpha()
        ]);

        if ($validation->failed())
            return json_encode($_SESSION["errors"]);
        return json_encode("OK");
    }

    public function postSigninEmailField($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'email' => v::notEmpty()->email()->EmailAvailable()
        ]);

        if ($validation->failed())
            return json_encode($_SESSION["errors"]);
        return json_encode("OK");
    }

    public function postSigninPasswordField($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'password' => v::notEmpty()->noWhitespace()->alnum()->length(6, 32)->HardPassword()
        ]);

        if ($validation->failed())
            return json_encode($_SESSION["errors"]);
        return json_encode("OK");
    }

    public function postSigninPasswordRepeatField($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'password_repeat' => v::equals($request->getParam('password'))
        ]);

        if ($validation->failed())
            return json_encode($_SESSION["errors"]);
        return json_encode("OK");
    }

    public function postSignup($request, $response)
    {
        $validation = $this->validator->validate($request, [
            'login' => v::noWhitespace()->notEmpty()->length(4, 16)->alnum()->LoginAvailable(),
            'email' => v::notEmpty()->email()->EmailAvailable(),
            'firstname' => v::noWhitespace()->notEmpty()->length(2, 32)->alpha(),
            'lastname' => v::noWhitespace()->notEmpty()->length(2, 32)->alpha(),
            'password' => v::notEmpty()->noWhitespace()->alnum()->length(6, 32)->HardPassword(),
            'password_repeat' => v::equals($request->getParam('password'))
        ]);

        if ($validation->failed())
        {
           return json_encode($_SESSION['errors']);
        }
        $db = new db();
        $db = $db->connect();
        $email = $request->getParam('email');
        $hashed_link = hash("sha256", rand(0, 1000));

        $stm = $db->prepare("INSERT INTO users (login, email, firstname, lastname, password, reg_link) VALUES (?, ?, ?, ?, ?, ?)");
        $stm->bindParam(1, $request->getParam('login'));
        $stm->bindParam(2, $request->getParam('email'));
        $stm->bindParam(3, $request->getParam('firstname'));
        $stm->bindParam(4, $request->getParam('lastname'));
        $stm->bindParam(5, hash("sha256", $request->getParam('password')));
        $stm->bindParam(6, $hashed_link);
        $stm->execute();

        $this->SendMail->send_mail($email, "Click on the link to confirm your account: http://localhost:8100/public/auth/confirm?email=" . $email . "&reg_link=" . $hashed_link, "User creation");
        return (json_encode('OK'));
    }
}

?>
