<?php

require __DIR__ . '/../vendor/autoload.php';

session_start();
use Respect\Validation\Validator as v;

$app = new \Slim\App([
	'settings' => [
		'displayErrorDetails' => true,
	]
]);

$container = $app->getContainer();

$container['auth'] = function($container) {
	return new \App\Auth\Auth;
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

	return $view;
};

$container['SendMail'] = function($container) {
	return new \App\SendMail\SendMail;
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

$app->add(new \App\Middleware\ValidationErrorsMiddleware($container));
$app->add(new \App\Middleware\OldInputMiddleware($container));

v::with('App\\Validation\\Rules');

require __DIR__ . '/../app/routes.php';

?>