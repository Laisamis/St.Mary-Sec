<?php
/**
 * St. Mary's Secondary School Portal
 * Database Connection Configuration for Microsoft Access (*.accdb / *.mdb)
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$conn = null;
$db_connected = false;
$db_error = null;

$db_file = __DIR__ . '/database/st_marys_school.accdb';

$db_dir = __DIR__ . '/database';
if (!is_dir($db_dir)) {
    @mkdir($db_dir, 0777, true);
}

$dsn = "odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=" . realpath($db_file) . ";Uid=;Pwd=;";

try {
    if (file_exists($db_file)) {
        $conn = new PDO($dsn, "", "");
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $db_connected = true;
    } else {
        $db_error = "Database file 'database/st_marys_school.accdb' not found in " . __DIR__;
    }
} catch (PDOException $e) {
    $db_connected = false;
    $db_error = $e->getMessage();
}

function sanitize_input($data) {
    return htmlspecialchars(stripslashes(trim($data ?? '')));
}

function json_response($status, $message, $data = null, $http_code = 200) {
    header('Content-Type: application/json');
    http_response_code($http_code);
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data,
        'database_connected' => $GLOBALS['db_connected'] ?? false
    ]);
    exit();
}
?>
