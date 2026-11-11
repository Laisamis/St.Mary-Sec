<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: register.html");
    exit();
}

$fullName        = trim($_POST['fullName'] ?? '');
$dobRaw          = trim($_POST['dob'] ?? '');
$gender          = trim($_POST['gender'] ?? 'Male');
$email           = strtolower(trim($_POST['email'] ?? ''));
$phone           = trim($_POST['phone'] ?? '');
$formClass       = trim($_POST['classGrade'] ?? 'Form 1');
$stream          = trim($_POST['stream'] ?? 'East');
$studyMode       = trim($_POST['studyMode'] ?? 'Boarder');
$house           = trim($_POST['house'] ?? 'St. Patrick House');
$password        = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';

$errors = [];

if (empty($fullName)) $errors[] = "Full student name is required.";
if (empty($dobRaw))   $errors[] = "Date of Birth (dob) is required.";
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "A valid email address is required.";
if (empty($password)) $errors[] = "Password is required.";
elseif (strlen($password) < 6) $errors[] = "Password must be at least 6 characters long.";
if (!empty($confirmPassword) && $password !== $confirmPassword) $errors[] = "Passwords do not match.";

if (!$db_connected || !$conn) {
    $errors[] = "Database Connection Error: " . ($db_error ?: "Could not connect to database/st_marys_school.accdb");
}

// Format Date of Birth for MS Access (YYYY-MM-DD)
$dob = !empty($dobRaw) ? date('Y-m-d', strtotime($dobRaw)) : '2008-01-01';
$admissionYear = intval(date('Y'));
$admissionNo = "SMSS/" . $admissionYear . "/" . rand(100, 999);
$registeredDate = date('Y-m-d H:i:s');
$status = 'Active';
$feeBalance = ($studyMode === 'Boarder') ? 48000.00 : 36000.00;
$isSuccess = false;

if (empty($errors)) {
    // Hash password securely with BCRYPT
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Duplicate email check
    try {
        $chk = $conn->prepare("SELECT COUNT(*) AS total FROM tbl_students WHERE LCASE(email) = ?");
        $chk->execute([$email]);
        $row = $chk->fetch();
        if ($row && $row['total'] > 0) {
            $errors[] = "A student with email '{$email}' is already registered in tbl_students.";
        }
    } catch (Exception $e) {}

    if (empty($errors)) {
        $inserted = false;

        // Try 1: Full standard schema with dob, gender, form_class, stream, admission_year, status, fee_balance
        try {
            $sql1 = "INSERT INTO tbl_students (
                admission_no, full_name, dob, gender, email, phone, 
                form_class, stream, study_mode, admission_year, house, 
                password_hash, registered_at, status, fee_balance
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $conn->prepare($sql1);
            $stmt->execute([
                $admissionNo, $fullName, $dob, $gender, $email, $phone,
                $formClass, $stream, $studyMode, $admissionYear, $house,
                $passwordHash, $registeredDate, $status, $feeBalance
            ]);
            $inserted = true;
        } catch (Exception $e1) {
            // Try 2: Alternative column names (class_grade instead of form_class)
            try {
                $sql2 = "INSERT INTO tbl_students (
                    admission_no, full_name, dob, gender, email, phone, 
                    class_grade, study_mode, password_hash, registered_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql2);
                $stmt->execute([
                    $admissionNo, $fullName, $dob, $gender, $email, $phone,
                    $formClass, $studyMode, $passwordHash, $registeredDate
                ]);
                $inserted = true;
            } catch (Exception $e2) {
                // Try 3: Minimal schema with dob included
                try {
                    $sql3 = "INSERT INTO tbl_students (
                        admission_no, full_name, dob, email, phone, password_hash
                    ) VALUES (?, ?, ?, ?, ?, ?)";
                    $stmt = $conn->prepare($sql3);
                    $stmt->execute([$admissionNo, $fullName, $dob, $email, $phone, $passwordHash]);
                    $inserted = true;
                } catch (Exception $e3) {
                    $errors[] = "Insert into tbl_students failed: " . $e1->getMessage();
                }
            }
        }

        if ($inserted) {
            $isSuccess = true;
            $_SESSION['stMarysRole'] = 'student';
            $_SESSION['stMarysCurrentStudent'] = [
                'fullName' => $fullName,
                'admissionNo' => $admissionNo,
                'email' => $email,
                'classGrade' => $formClass,
                'stream' => $stream,
                'house' => $house
            ];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Registration Status | St. Mary's</title>
  <link rel="stylesheet" href="style.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f8fafc; padding: 40px 20px; }
    .card { max-width: 580px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); text-align: center; }
    .btn { display: inline-block; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; margin: 5px; }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-sec { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }
  </style>
</head>
<body>
  <div class="card">
    <?php if ($isSuccess): ?>
      <div style="font-size: 52px;">✅</div>
      <h2 style="color: #166534; margin: 10px 0;">Registration Successful!</h2>
      <p style="color: #64748b;">The student profile has been inserted into <strong>tbl_students</strong> in <code>st_marys_school.accdb</code>.</p>
      
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:18px; margin:20px 0; text-align:left; font-size:14px; line-height:1.8;">
        <div>Assigned Admission No: <strong style="color:#2563eb; font-size:16px; font-family:monospace;"><?= htmlspecialchars($admissionNo) ?></strong></div>
        <div>Full Name: <strong><?= htmlspecialchars($fullName) ?></strong></div>
        <div>Date of Birth (dob): <strong><?= htmlspecialchars($dob) ?></strong></div>
        <div>Email: <strong><?= htmlspecialchars($email) ?></strong></div>
        <div>Class & Stream: <strong><?= htmlspecialchars($formClass . ' ' . $stream) ?></strong></div>
        <div>House: <strong><?= htmlspecialchars($house) ?></strong></div>
        <div>Password: <em>Hashed with BCRYPT and securely stored</em></div>
      </div>

      <a href="login.html" class="btn btn-primary">Proceed to Login &rarr;</a>
      <a href="index.html" class="btn btn-sec">Return to Home</a>

      <script>
        sessionStorage.setItem("stMarysRole", "student");
        sessionStorage.setItem("stMarysCurrentStudent", JSON.stringify({
          fullName: <?= json_encode($fullName) ?>,
          admissionNo: <?= json_encode($admissionNo) ?>,
          email: <?= json_encode($email) ?>
        }));
      </script>
    <?php else: ?>
      <div style="font-size: 52px;">❌</div>
      <h2 style="color: #dc2626; margin: 10px 0;">Registration Error</h2>
      <div style="background:#fee2e2; border:1px solid #fecaca; color:#991b1b; padding:16px; border-radius:8px; text-align:left; font-size:14px; margin:20px 0;">
        <ul style="margin:0; padding-left:20px;">
          <?php foreach ($errors as $e): ?>
            <li><?= htmlspecialchars($e) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <a href="register.html" class="btn btn-primary">&larr; Return to Registration Form</a>
    <?php endif; ?>
  </div>
</body>
</html>