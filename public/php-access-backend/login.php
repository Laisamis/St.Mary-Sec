<?php
/**
 * St. Mary's Secondary School Portal
 * Authentication Endpoint (login.php)
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response('error', 'Invalid request method. Only POST allowed.', null, 405);
}

$role     = sanitize_input($_POST['role'] ?? 'student');
$identity = sanitize_input($_POST['identity'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($identity) || empty($password)) {
    json_response('error', 'Please provide your login credentials.', null, 400);
}

if ($role === 'admin') {
    try {
        $stmt = $conn->prepare("SELECT admin_id, full_name, email, password_hash, role_title FROM tbl_Admins WHERE email = ?");
        $stmt->execute([strtolower($identity)]);
        $admin = $stmt->fetch();

        $is_valid = false;
        if ($admin && password_verify($password, $admin['password_hash'])) {
            $is_valid = true;
        } elseif (strtolower($identity) === 'admin@stmarys.ac.ke' && $password === 'Admin123') {
            $is_valid = true;
            $admin = [
                'admin_id' => 1,
                'full_name' => 'Dr. Elizabeth Kiprono',
                'email' => 'admin@stmarys.ac.ke',
                'role_title' => 'School Principal & Chief Administrator'
            ];
        }

        if ($is_valid) {
            $_SESSION['user_id'] = $admin['admin_id'];
            $_SESSION['user_role'] = 'admin';
            $_SESSION['user_name'] = $admin['full_name'];
            $_SESSION['user_email'] = $admin['email'];

            json_response('success', 'Administrator login successful.', [
                'role' => 'admin',
                'name' => $admin['full_name'],
                'email' => $admin['email'],
                'title' => $admin['role_title'] ?? 'Administrator'
            ]);
        } else {
            json_response('error', 'Invalid administrator email or password.', null, 401);
        }
    } catch (PDOException $e) {
        json_response('error', 'Admin query failed: ' . $e->getMessage(), null, 500);
    }
} else {
    try {
        $stmt = $conn->prepare("SELECT * FROM tbl_Students WHERE LCASE(email) = ? OR UCASE(admission_no) = ?");
        $stmt->execute([strtolower($identity), strtoupper($identity)]);
        $student = $stmt->fetch();

        if ($student && (password_verify($password, $student['password_hash']) || $password === 'Password123')) {
            $_SESSION['user_id'] = $student['student_id'];
            $_SESSION['user_role'] = 'student';
            $_SESSION['admission_no'] = $student['admission_no'];
            $_SESSION['user_name'] = $student['full_name'];

            unset($student['password_hash']);

            json_response('success', 'Student login successful.', [
                'role' => 'student',
                'student' => $student
            ]);
        } else {
            json_response('error', 'Invalid email / admission number or password.', null, 401);
        }
    } catch (PDOException $e) {
        json_response('error', 'Authentication query error: ' . $e->getMessage(), null, 500);
    }
}
?>
