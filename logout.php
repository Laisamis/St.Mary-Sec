<?php
session_start();
$_SESSION = [];
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
}
session_destroy();
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Signing Out | St. Mary's</title>
  <script>
    sessionStorage.clear();
    window.location.replace("login.html");
  </script>
</head>
<body>
  <p style="font-family:sans-serif; text-align:center; padding:50px;">Signing out... <a href="login.html">Click here if not redirected</a>.</p>
</body>
</html>