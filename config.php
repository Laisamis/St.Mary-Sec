<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$conn = null;
$db_connected = false;
$db_error = null;

// Target path: database/st_marys_school.accdb
$dbFile = __DIR__ . DIRECTORY_SEPARATOR . 'database' . DIRECTORY_SEPARATOR . 'st_marys_school.accdb';

if (!file_exists($dbFile)) {
    // Fallback: check root folder if moved
    $dbFile = __DIR__ . DIRECTORY_SEPARATOR . 'st_marys_school.accdb';
}

if (file_exists($dbFile)) {
    $realDbPath = realpath($dbFile);
    $dsn = "odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=" . $realDbPath . ";Uid=;Pwd=;";
    try {
        $conn = new PDO($dsn, "", "", [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        $db_connected = true;
    } catch (PDOException $e) {
        $db_error = $e->getMessage();
    }
} else {
    $db_error = "Database file not found at " . __DIR__ . DIRECTORY_SEPARATOR . "database" . DIRECTORY_SEPARATOR . "st_marys_school.accdb";
}
?>