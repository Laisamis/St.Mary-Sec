<?php
/**
 * St. Mary's Secondary School Portal
 * Student Registration Endpoint (register.php)
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: register.html");
    exit();
}

$full_name     = sanitize_input($_POST['fullName'] ?? '');
$dob           = sanitize_input($_POST['dob'] ?? '');
$gender        = sanitize_input($_POST['gender'] ?? '');
$national_id   = sanitize_input($_POST['identity'] ?? '');
$email         = strtolower(sanitize_input($_POST['email'] ?? ''));
$phone         = sanitize_input($_POST['phone'] ?? '');
$address       = sanitize_input($_POST['address'] ?? '');
$form_class    = sanitize_input($_POST['formClass'] ?? 'Form 1');
$stream        = sanitize_input($_POST['stream'] ?? 'East');
$study_mode    = sanitize_input($_POST['studyMode'] ?? 'Boarder');
$house         = sanitize_input($_POST['house'] ?? 'St. Patrick House');
$previous_sch  = sanitize_input($_POST['previousSchool'] ?? '');
$adm_year      = intval($_POST['admissionYear'] ?? date('Y'));
$guardian_name = sanitize_input($_POST['guardianName'] ?? '');
$guardian_phone= sanitize_input($_POST['guardianPhone'] ?? '');
$password      = $_POST['password'] ?? '';
$confirm_pass  = $_POST['confirmPassword'] ?? '';

// Basic Validation
if (empty($full_name) || empty($email) || empty($phone) || empty($password)) {
    die("<div style='font-family:sans-serif; max-width:500px; margin:40px auto; padding:20px; border:1px solid #fee2e2; background:#fef2f2; border-radius:10px;'>
        <h3 style='color:#dc2626;'>Registration Error</h3>
        <p>Please fill in all required fields marked with *.</p>
        <a href='register.html'>&larr; Go back to registration</a>
    </div>");
}

if ($password !== $confirm_pass) {
    die("<div style='font-family:sans-serif; max-width:500px; margin:40px auto; padding:20px; border:1px solid #fee2e2; background:#fef2f2; border-radius:10px;'>
        <h3 style='color:#dc2626;'>Registration Error</h3>
        <p>Passwords do not match. Please re-enter your password.</p>
        <a href='register.html'>&larr; Go back to registration</a>
    </div>");
}

// Generate Admission Number: SMSS/YYYY/XXXX
$rand_num = rand(100, 999);
$admission_no = "SMSS/" . $adm_year . "/" . $rand_num;
$password_hash = password_hash($password, PASSWORD_BCRYPT);
$registered_at = date('Y-m-d H:i:s');
$initial_fee_balance = ($study_mode === 'Boarder') ? 48000.00 : 36000.00;

// Try database insert if connected
$db_saved = false;
if ($conn && $db_connected) {
    try {
        $insert_sql = "INSERT INTO tbl_Students (
            admission_no, full_name, dob, gender, national_id, email, phone, 
            address, form_class, stream, study_mode, previous_school, admission_year, 
            guardian_name, guardian_phone, house, password_hash, registered_at, status, fee_balance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)";

        $stmt = $conn->prepare($insert_sql);
        $stmt->execute([
            $admission_no, $full_name, $dob, $gender, $national_id, $email, $phone,
            $address, $form_class, $stream, $study_mode, $previous_sch, $adm_year,
            $guardian_name, $guardian_phone, $house, $password_hash, $registered_at, $initial_fee_balance
        ]);
        $db_saved = true;
    } catch (PDOException $e) {
        $db_saved = false;
    }
}

// Set session for immediate access
$_SESSION['user_id'] = $admission_no;
$_SESSION['user_role'] = 'student';
$_SESSION['user_name'] = $full_name;
$_SESSION['admission_no'] = $admission_no;
$_SESSION['form_class'] = $form_class;
$_SESSION['study_mode'] = $study_mode;
$_SESSION['house'] = $house;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Registration Confirmation | St. Mary's Secondary School</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="site-header">
    <div class="brand">
      <span class="brand-mark">SM</span>
      <span>ST. MARY'S <strong>SECONDARY</strong></span>
    </div>
  </div>

  <main class="section-wrap" style="max-width: 600px; text-align: center; padding-top: 40px;">
    <div class="card" style="border: 2px solid #86efac; background: #f0fdf4;">
      <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
      <h2 style="color: #166534; margin-bottom: 8px;">Registration Successful!</h2>
      <p style="color: #4b5563; font-size: 14px; margin-bottom: 20px;">
        Welcome to St. Mary's Secondary School, <strong><?php echo htmlspecialchars($full_name); ?></strong>.
      </p>

      <div style="background: #fff; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; text-align: left; font-size: 13px; line-height: 1.8; margin-bottom: 20px;">
        <div>Assigned Admission No: <strong style="font-family:monospace; color:#1d4ed8; font-size:15px;"><?php echo htmlspecialchars($admission_no); ?></strong></div>
        <div>Class Level: <strong><?php echo htmlspecialchars($form_class . " (" . $stream . ")"); ?></strong></div>
        <div>Study Category: <strong><?php echo htmlspecialchars($study_mode); ?></strong></div>
        <div>Allocated House: <strong><?php echo htmlspecialchars($house); ?></strong></div>
        <div>Registered Email: <strong><?php echo htmlspecialchars($email); ?></strong></div>
        <div>Database Status: <strong><?php echo $db_saved ? "<span style='color:green;'>Saved to Access DB</span>" : "<span style='color:#d97706;'>Local Session Active</span>"; ?></strong></div>
      </div>

      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <a href="student_dashboard.html" class="btn btn-primary">Go to Student Dashboard &rarr;</a>
        <a href="login.html" class="btn btn-outline">Portal Sign In</a>
      </div>
    </div>
  </main>
</body>
</html>
