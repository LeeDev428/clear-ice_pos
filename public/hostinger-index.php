<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists('__APP_PATH__/storage/framework/maintenance.php')) {
    require '__APP_PATH__/storage/framework/maintenance.php';
}

require '__APP_PATH__/vendor/autoload.php';

$app = require_once '__APP_PATH__/bootstrap/app.php';

$app->handleRequest(Request::capture());
