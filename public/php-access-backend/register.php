<?php
/**
 * St. Mary's Secondary School Portal
 * Student Registration Endpoint (register.php)
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response('error', 'Invalid request method. Only POST allowed.', null, 405);
}

$full_name     = sanitize_input($_POST['fullName'] ?? '');
$dob           = sanitize_input($_POST['dob'] ?? '');
$gender        = sanitize_input($_POST['gender'] ?? '');
$national_id   = sanitize_input($_POST['identity'] ?? '');
$email         = strtolower(sanitize_input($_POST['email'] ?? ''));
$phone         = sanitize_input($_POST['phone'] ?? '');
$address       = sanitize_input($_POST['address'] ?? '');
$form_class    = sanitize_input($_POST['formClass'] ?? 'Form 1');
$study_mode    = sanitize_input($_POST['studyMode'] ?? 'Boarder');
$previous_sch  = sanitize_input($_POST['previousSchool'] ?? '');
$adm_year      = intval($_POST['admissionYear'] ?? date('Y'));
$guardian_name = sanitize_input($_POST['guardianName'] ?? '');
$guardian_phone= sanitize_input($_POST['guardianPhone'] ?? '');
$password      = $_POST['password'] ?? '';
$confirm_pass  = $_POST['confirmPassword'] ?? '';

if (empty($full_name) || empty($email) || empty($dob) || empty($phone) || empty($password)) {
    json_response('error', 'Please fill in all required fields.', null, 400);
}

if ($password !== $confirm_pass) {
    json_response('error', 'Passwords do not match.', null, 400);
}

if (strlen($password) < 6) {
    json_response('error', 'Password must be at least 6 characters long.', null, 400);
}

try {
    $check_stmt = $conn->prepare("SELECT student_id FROM tbl_Students WHERE email = ?");
    $check_stmt->execute([$email]);
    if ($check_stmt->fetch()) {
        json_response('error', 'A student with this email address is already registered.', null, 409);
    }

    $year = date('Y');
    $rand_num = rand(100, 999);
    $admission_no = "SMSS/" . $year . "/" . $rand_num;
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $registered_at = date('Y-m-d H:i:s');
    $initial_fee_balance = ($study_mode === 'Boarder') ? 48000.00 : 36000.00;

    $insert_sql = "INSERT INTO tbl_Students (
        admission_no, full_name, dob, gender, national_id, email, phone, 
        address, form_class, study_mode, previous_school, admission_year, 
        guardian_name, guardian_phone, password_hash, registered_at, status, fee_balance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)";

    $stmt = $conn->prepare($insert_sql);
    $stmt->execute([
        $admission_no, $full_name, $dob, $gender, $national_id, $email, $phone,
        $address, $form_class, $study_mode, $previous_sch, $adm_year,
        $guardian_name, $guardian_phone, $password_hash, $registered_at, $initial_fee_balance
    ]);

    json_response('success', 'Registration successful! You may now log in to your student portal.', [
        'admissionNo' => $admission_no,
        'fullName' => $full_name,
        'email' => $email,
        'formClass' => $form_class
    ], 201);

} catch (PDOException $e) {
    json_response('error', 'Database error: ' . $e->getMessage(), null, 500);
}
?>
