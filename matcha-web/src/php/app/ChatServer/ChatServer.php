<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use App\ChatServer\Chat;
    require dirname(__DIR__) . '/../vendor/autoload.php';
    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new Chat()
            )
        ),
        3001
    );
    $server->run();
