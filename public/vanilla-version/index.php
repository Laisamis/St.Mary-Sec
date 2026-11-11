<?php
/**
 * St. Mary's Secondary School Portal
 * Index Router for PHP Servers (XAMPP / WAMP / IIS)
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Load and serve the standalone index.html page
if (file_exists(__DIR__ . '/index.html')) {
    include __DIR__ . '/index.html';
} else {
    echo "<h1>St. Mary's Secondary School</h1><p>index.html not found.</p>";
}
?>
