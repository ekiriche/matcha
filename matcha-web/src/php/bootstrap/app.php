<?php

require __DIR__ . '/../vendor/autoload.php';

session_start();
use Respect\Validation\Validator as v;

header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Origin: *');

$app = new \Slim\App([
	'settings' => [
		'displayErrorDetails' => true,
	]
]);

$container = $app->getContainer();

$container['auth'] = function($container) {
	return new \App\Auth\Auth;
};

$container['Geolocation'] = function($container) {
	return new \App\Geolocation\Geolocation;
};

$container['profile'] = function($container) {
	return new \App\Profile\Profile;
};

$container['SendMail'] = function($container) {
	return new \App\SendMail\SendMail;
};

$container['Tokens'] = function($container) {
	return new \App\Tokens\Tokens;
};

$container['SqlExecuter'] = function($container) {
	return new \App\SqlExecuter\SqlExecuter;
};

$container['flash'] = function($container) {
	return new \Slim\Flash\Messages();
};

$container['view'] = function($container) {
	$view = new \Slim\Views\Twig(__DIR__ . '/../resources/views', [
		'cache' => false,
	]);

	$view->addExtension(new \Slim\Views\TwigExtension(
		$container->router,
		$container->request->getUri()
	));

	$view->getEnvironment()->addGlobal('auth', [
		'check' => $container->auth->check(),
		'user' => $container->auth->user()
	]);

	$view->getEnvironment()->addGlobal('flash', $container->flash);

	return $view;
};

$container['validator'] = function($container) {
	return new \App\Validation\Validator;
};

$container['HomeController'] = function($container) {
	return new \App\Controllers\HomeController($container);
};

$container['AuthController'] = function($container) {
	return new \App\Controllers\Auth\AuthController($container);
};

$container['ProfileController'] = function($container) {
	return new \App\Controllers\Profile\ProfileController($container);
};

$container['LikesViewsController'] = function($container) {
	return new \App\Controllers\LikesViews\LikesViewsController($container);
};

$container['BrowseController'] = function($container) {
	return new \App\Controllers\Browse\BrowseController($container);
};

//$app->add(new \App\Middleware\ValidationErrorsMiddleware($container));
//$app->add(new \App\Middleware\OldInputMiddleware($container));

v::with('App\\Validation\\Rules');

require __DIR__ . '/../app/routes.php';

?>
