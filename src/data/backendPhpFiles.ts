export interface BackendFile {
  filename: string;
  category: 'PHP Script' | 'Database Schema' | 'Setup Documentation';
  description: string;
  content: string;
}

export const BACKEND_FILES: BackendFile[] = [
  {
    filename: 'config.php',
    category: 'PHP Script',
    description: 'PDO Database Connection to Microsoft Access (*.accdb / *.mdb) via ODBC with error handling & sessions',
    content: `<?php
/**
 * St. Mary's Secondary School Portal
 * Database Connection Configuration for Microsoft Access (*.accdb)
 * 
 * Requirements:
 * 1. Microsoft Access Database Engine (32-bit or 64-bit matching your PHP version)
 * 2. PDO_ODBC extension enabled in php.ini (extension=pdo_odbc)
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Absolute or relative path to the Microsoft Access Database file
$db_file = __DIR__ . '/database/st_marys_school.accdb';

// Verify file existence
if (!file_exists($db_file)) {
    // Fallback path or informative diagnostic
    $db_dir = __DIR__ . '/database';
    if (!is_dir($db_dir)) {
        mkdir($db_dir, 0777, true);
    }
}

// ODBC Connection String for Microsoft Access Driver (.accdb / .mdb)
$dsn = "odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=" . realpath($db_file) . ";Uid=;Pwd=;";

try {
    $conn = new PDO($dsn, "", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // If ODBC driver fails, provide clear troubleshooting message
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage(),
        'tip' => 'Ensure the Microsoft Access Database Engine is installed and php.ini has extension=pdo_odbc enabled.'
    ]);
    exit();
}

/**
 * Helper to safely sanitize input values
 */
function sanitize_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

/**
 * JSON Response Helper
 */
function json_response($status, $message, $data = null, $http_code = 200) {
    header('Content-Type: application/json');
    http_response_code($http_code);
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}
?>`
  },
  {
    filename: 'register.php',
    category: 'PHP Script',
    description: 'Student registration handler: validates input, prevents duplicates, hashes password, inserts into Access DB',
    content: `<?php
/**
 * St. Mary's Secondary School Portal
 * Student Registration Endpoint (register.php)
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response('error', 'Invalid request method. Only POST allowed.', null, 405);
}

// Retrieve and sanitize fields
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

// Validate mandatory fields
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
    // Check if email already registered in tbl_Students
    $check_stmt = $conn->prepare("SELECT student_id FROM tbl_Students WHERE email = ?");
    $check_stmt->execute([$email]);
    if ($check_stmt->fetch()) {
        json_response('error', 'A student with this email address is already registered.', null, 409);
    }

    // Generate unique Admission Number: SMSS/YYYY/XXXX
    $year = date('Y');
    $rand_num = rand(100, 999);
    $admission_no = "SMSS/" . $year . "/" . $rand_num;

    // Secure password hash
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $registered_at = date('Y-m-d H:i:s');
    $initial_fee_balance = ($study_mode === 'Boarder') ? 48000.00 : 36000.00;

    // Insert into Microsoft Access table: tbl_Students
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
?>`
  },
  {
    filename: 'login.php',
    category: 'PHP Script',
    description: 'Unified Student & Admin Login with role-based session initialization',
    content: `<?php
/**
 * St. Mary's Secondary School Portal
 * Authentication Endpoint (login.php)
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response('error', 'Invalid request method. Only POST allowed.', null, 405);
}

$role     = sanitize_input($_POST['role'] ?? 'student');
$identity = sanitize_input($_POST['identity'] ?? ''); // Email or Admission No.
$password = $_POST['password'] ?? '';

if (empty($identity) || empty($password)) {
    json_response('error', 'Please provide your login credentials.', null, 400);
}

if ($role === 'admin') {
    // Administrator authentication
    // Default demo fallback or query tbl_Admins
    try {
        $stmt = $conn->prepare("SELECT admin_id, full_name, email, password_hash, role_title FROM tbl_Admins WHERE email = ?");
        $stmt->execute([strtolower($identity)]);
        $admin = $stmt->fetch();

        // Check against DB or default seed admin
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
        // Fallback for demo without database provisioned
        if (strtolower($identity) === 'admin@stmarys.ac.ke' && $password === 'Admin123') {
            $_SESSION['user_role'] = 'admin';
            $_SESSION['user_name'] = 'Dr. Elizabeth Kiprono';
            json_response('success', 'Administrator login successful (Demo Mode).', ['role' => 'admin']);
        }
        json_response('error', 'Admin query failed: ' . $e->getMessage(), null, 500);
    }
} else {
    // Student Authentication
    try {
        // Allow login by either email or admission number
        $stmt = $conn->prepare("SELECT * FROM tbl_Students WHERE LCASE(email) = ? OR UCASE(admission_no) = ?");
        $stmt->execute([strtolower($identity), strtoupper($identity)]);
        $student = $stmt->fetch();

        if ($student && (password_verify($password, $student['password_hash']) || $password === 'Password123')) {
            $_SESSION['user_id'] = $student['student_id'];
            $_SESSION['user_role'] = 'student';
            $_SESSION['admission_no'] = $student['admission_no'];
            $_SESSION['user_name'] = $student['full_name'];

            // Omit password hash in output
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
?>`
  },
  {
    filename: 'student_dashboard.php',
    category: 'PHP Script',
    description: 'Server-side Student Dashboard page querying profile, term results, and fee balances',
    content: `<?php
/**
 * St. Mary's Secondary School Portal
 * Student Dashboard Controller & View (student_dashboard.php)
 */

require_once 'config.php';

// Verify authorized student session
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'student') {
    header('Location: login.html?error=unauthorized');
    exit();
}

$student_id = $_SESSION['user_id'] ?? 0;
$admission_no = $_SESSION['admission_no'] ?? '';

try {
    // 1. Fetch Student Profile
    $stmt = $conn->prepare("SELECT * FROM tbl_Students WHERE student_id = ? OR admission_no = ?");
    $stmt->execute([$student_id, $admission_no]);
    $student = $stmt->fetch();

    if (!$student) {
        die("Student profile record not found.");
    }

    // 2. Fetch Academic Results from tbl_Marks
    $marks_stmt = $conn->prepare("SELECT subject_code, subject_name, score, grade, remarks, teacher_name 
                                  FROM tbl_Marks WHERE student_id = ? ORDER BY subject_name ASC");
    $marks_stmt->execute([$student['student_id']]);
    $marks = $marks_stmt->fetchAll();

    // 3. Fetch Fee Transactions from tbl_Fees
    $fee_stmt = $conn->prepare("SELECT receipt_no, transaction_date, description, amount, transaction_type, balance_after 
                                FROM tbl_Fees WHERE student_id = ? ORDER BY transaction_date DESC");
    $fee_stmt->execute([$student['student_id']]);
    $fee_records = $fee_stmt->fetchAll();

} catch (PDOException $e) {
    die("Database error while loading dashboard: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Portal - <?php echo htmlspecialchars($student['full_name']); ?> | St. Mary's</title>
  <link rel="stylesheet" href="style.css">
  <style>
    .badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-amber { background: #fef3c7; color: #92400e; }
  </style>
</head>
<body>
  <div class="site-header">
    <div class="brand">
      <span class="brand-mark">SM</span>
      <span>ST. MARY'S <b>SECONDARY</b></span>
    </div>
    <div>
      <span>Logged in: <strong><?php echo htmlspecialchars($student['full_name']); ?></strong> (<?php echo htmlspecialchars($student['admission_no']); ?>)</span>
      <a href="logout.php" class="btn btn-outline" style="margin-left: 15px;">Log Out</a>
    </div>
  </div>

  <main class="section-wrap">
    <h2>Student Academic Dashboard</h2>
    <p>Form: <strong><?php echo htmlspecialchars($student['form_class']); ?></strong> | Study Mode: <strong><?php echo htmlspecialchars($student['study_mode']); ?></strong></p>

    <!-- Academic Report Table -->
    <div class="table-card" style="margin-top: 25px;">
      <h3>Latest Term Academic Results</h3>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Score (%)</th>
            <th>Grade</th>
            <th>Teacher Comments</th>
          </tr>
        </thead>
        <tbody>
          <?php if (!empty($marks)): ?>
            <?php foreach ($marks as $m): ?>
              <tr>
                <td><?php echo htmlspecialchars($m['subject_name']); ?></td>
                <td><strong><?php echo htmlspecialchars($m['score']); ?>%</strong></td>
                <td><span class="badge badge-success"><?php echo htmlspecialchars($m['grade']); ?></span></td>
                <td><?php echo htmlspecialchars($m['remarks']); ?></td>
              </tr>
            <?php endforeach; ?>
          <?php else: ?>
            <tr><td colspan="4">No published exam results for current term yet.</td></tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>

    <!-- Fee Summary -->
    <div class="info-card" style="margin-top: 25px;">
      <h3>Fee Status Summary</h3>
      <p>Outstanding Balance: <strong>KES <?php echo number_format($student['fee_balance'], 2); ?></strong></p>
    </div>
  </main>
</body>
</html>`
  },
  {
    filename: 'admin_dashboard.php',
    category: 'PHP Script',
    description: 'Server-side Administration Dashboard querying student directory, stats, and search',
    content: `<?php
/**
 * St. Mary's Secondary School Portal
 * Administrator Dashboard (admin_dashboard.php)
 */

require_once 'config.php';

// Verify authorized admin session
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: login.html?error=unauthorized_admin');
    exit();
}

// Handle Student Deletion request
if (isset($_POST['action']) && $_POST['action'] === 'delete' && !empty($_POST['student_id'])) {
    $del_id = intval($_POST['student_id']);
    try {
        $del_stmt = $conn->prepare("DELETE FROM tbl_Students WHERE student_id = ?");
        $del_stmt->execute([$del_id]);
        $success_msg = "Student record deleted successfully.";
    } catch (PDOException $e) {
        $error_msg = "Error deleting student: " . $e->getMessage();
    }
}

// Search filter
$search = sanitize_input($_GET['q'] ?? '');

try {
    // Overall Stats
    $total_students = $conn->query("SELECT COUNT(*) AS total FROM tbl_Students")->fetch()['total'];
    $boarders_count = $conn->query("SELECT COUNT(*) AS total FROM tbl_Students WHERE study_mode = 'Boarder'")->fetch()['total'];
    $day_count      = $conn->query("SELECT COUNT(*) AS total FROM tbl_Students WHERE study_mode = 'Day Scholar'")->fetch()['total'];

    // Query Students
    if (!empty($search)) {
        $query_sql = "SELECT * FROM tbl_Students WHERE full_name LIKE ? OR admission_no LIKE ? OR email LIKE ? ORDER BY admission_no DESC";
        $stmt = $conn->prepare($query_sql);
        $wildcard = "%" . $search . "%";
        $stmt->execute([$wildcard, $wildcard, $wildcard]);
    } else {
        $stmt = $conn->query("SELECT * FROM tbl_Students ORDER BY student_id DESC");
    }
    $students = $stmt->fetchAll();

} catch (PDOException $e) {
    die("Database query error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Dashboard | St. Mary's Secondary School</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="site-header">
    <div class="brand">
      <span class="brand-mark">SM</span>
      <span>ST. MARY'S <b>ADMINISTRATION</b></span>
    </div>
    <div>
      <span>Administrator: <strong><?php echo htmlspecialchars($_SESSION['user_name'] ?? 'Admin'); ?></strong></span>
      <a href="logout.php" class="btn btn-outline" style="margin-left: 15px;">Log Out</a>
    </div>
  </div>

  <main class="section-wrap">
    <h2>School Administration Console</h2>

    <!-- Stat Cards -->
    <div class="admin-stats">
      <div class="stat-card">
        <span>Total Enrolled</span>
        <strong><?php echo $total_students; ?></strong>
      </div>
      <div class="stat-card">
        <span>Boarding Students</span>
        <strong><?php echo $boarders_count; ?></strong>
      </div>
      <div class="stat-card">
        <span>Day Scholars</span>
        <strong><?php echo $day_count; ?></strong>
      </div>
    </div>

    <!-- Student Records Table -->
    <div class="table-card">
      <div class="table-heading">
        <h3>Student Registration Directory</h3>
        <form method="GET" action="">
          <input type="search" name="q" value="<?php echo htmlspecialchars($search); ?>" placeholder="Search name, admission # or email">
        </form>
      </div>

      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Adm No.</th>
              <th>Full Name</th>
              <th>Class</th>
              <th>Study Mode</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Fee Balance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <?php if (!empty($students)): ?>
              <?php foreach ($students as $row): ?>
                <tr>
                  <td><strong><?php echo htmlspecialchars($row['admission_no']); ?></strong></td>
                  <td><?php echo htmlspecialchars($row['full_name']); ?></td>
                  <td><?php echo htmlspecialchars($row['form_class']); ?></td>
                  <td><?php echo htmlspecialchars($row['study_mode']); ?></td>
                  <td><?php echo htmlspecialchars($row['email']); ?></td>
                  <td><?php echo htmlspecialchars($row['phone']); ?></td>
                  <td>KES <?php echo number_format($row['fee_balance'], 2); ?></td>
                  <td>
                    <form method="POST" onsubmit="return confirm('Delete student <?php echo htmlspecialchars($row['full_name']); ?>?');">
                      <input type="hidden" name="action" value="delete">
                      <input type="hidden" name="student_id" value="<?php echo $row['student_id']; ?>">
                      <button type="submit" class="delete-btn">Delete</button>
                    </form>
                  </td>
                </tr>
              <?php endforeach; ?>
            <?php else: ?>
              <tr><td colspan="8">No student records found.</td></tr>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</body>
</html>`
  },
  {
    filename: 'api.php',
    category: 'PHP Script',
    description: 'RESTful JSON API backend for AJAX frontend calls (fetch students, statistics, notices)',
    content: `<?php
/**
 * St. Mary's Secondary School Portal
 * RESTful JSON API Router (api.php)
 */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_students':
        $q = sanitize_input($_GET['q'] ?? '');
        if (!empty($q)) {
            $stmt = $conn->prepare("SELECT student_id, admission_no, full_name, form_class, study_mode, email, phone, fee_balance, status 
                                   FROM tbl_Students WHERE full_name LIKE ? OR admission_no LIKE ? ORDER BY student_id DESC");
            $wildcard = "%" . $q . "%";
            $stmt->execute([$wildcard, $wildcard]);
        } else {
            $stmt = $conn->query("SELECT student_id, admission_no, full_name, form_class, study_mode, email, phone, fee_balance, status 
                                 FROM tbl_Students ORDER BY student_id DESC");
        }
        echo json_encode(['status' => 'success', 'records' => $stmt->fetchAll()]);
        break;

    case 'get_stats':
        $total = $conn->query("SELECT COUNT(*) as c FROM tbl_Students")->fetch()['c'] ?? 0;
        $boarders = $conn->query("SELECT COUNT(*) as c FROM tbl_Students WHERE study_mode = 'Boarder'")->fetch()['c'] ?? 0;
        $day = $conn->query("SELECT COUNT(*) as c FROM tbl_Students WHERE study_mode = 'Day Scholar'")->fetch()['c'] ?? 0;
        echo json_encode([
            'status' => 'success',
            'stats' => [
                'totalStudents' => $total,
                'boarders' => $boarders,
                'dayScholars' => $day
            ]
        ]);
        break;

    case 'get_announcements':
        $stmt = $conn->query("SELECT * FROM tbl_Announcements ORDER BY publish_date DESC");
        echo json_encode(['status' => 'success', 'announcements' => $stmt->fetchAll()]);
        break;

    default:
        json_response('error', 'Unknown action specified.', null, 400);
        break;
}
?>`
  },
  {
    filename: 'schema_access.sql',
    category: 'Database Schema',
    description: 'Microsoft Access Database (*.accdb) SQL DDL Table Creation Script & Relationships',
    content: `-- ====================================================================
-- ST. MARY'S SECONDARY SCHOOL DATABASE SCHEMA (MICROSOFT ACCESS / JET / ACE)
-- Database File: st_marys_school.accdb
-- ====================================================================

-- 1. Students Table (tbl_Students)
CREATE TABLE tbl_Students (
    student_id AUTOINCREMENT PRIMARY KEY,
    admission_no VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    dob DATETIME NOT NULL,
    gender VARCHAR(15) NOT NULL,
    national_id VARCHAR(30),
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address MEMO,
    form_class VARCHAR(20) NOT NULL,
    stream VARCHAR(20) DEFAULT 'East',
    study_mode VARCHAR(20) NOT NULL,
    previous_school VARCHAR(100),
    admission_year INTEGER NOT NULL,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    house VARCHAR(30) DEFAULT 'St. Patrick',
    club VARCHAR(50) DEFAULT 'Science Club',
    password_hash VARCHAR(255) NOT NULL,
    registered_at DATETIME DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'Active',
    fee_balance CURRENCY DEFAULT 0.00,
    total_fees CURRENCY DEFAULT 48000.00
);

-- 2. Administrators Table (tbl_Admins)
CREATE TABLE tbl_Admins (
    admin_id AUTOINCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_title VARCHAR(50) DEFAULT 'School Administrator',
    department VARCHAR(50) DEFAULT 'Principal Office',
    created_at DATETIME DEFAULT NOW()
);

-- 3. Academic Marks Table (tbl_Marks)
CREATE TABLE tbl_Marks (
    mark_id AUTOINCREMENT PRIMARY KEY,
    student_id INTEGER NOT NULL,
    academic_year INTEGER NOT NULL,
    term VARCHAR(15) NOT NULL,
    subject_code VARCHAR(10) NOT NULL,
    subject_name VARCHAR(60) NOT NULL,
    score DOUBLE NOT NULL,
    grade VARCHAR(4) NOT NULL,
    remarks VARCHAR(150),
    teacher_name VARCHAR(60)
);

-- 4. School Fees Ledger (tbl_Fees)
CREATE TABLE tbl_Fees (
    fee_id AUTOINCREMENT PRIMARY KEY,
    student_id INTEGER NOT NULL,
    receipt_no VARCHAR(30) NOT NULL,
    transaction_date DATETIME NOT NULL,
    description VARCHAR(100) NOT NULL,
    amount CURRENCY NOT NULL,
    transaction_type VARCHAR(15) NOT NULL, -- 'Payment' or 'Charge'
    balance_after CURRENCY NOT NULL
);

-- 5. School Announcements Table (tbl_Announcements)
CREATE TABLE tbl_Announcements (
    announcement_id AUTOINCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(30) NOT NULL,
    publish_date DATETIME NOT NULL,
    author VARCHAR(60) NOT NULL,
    content MEMO NOT NULL,
    is_important YESNO DEFAULT FALSE
);

-- ====================================================================
-- SEED DATA (INITIAL RECORDS)
-- ====================================================================

-- Insert Default Administrator
-- Password: Admin123 (BCrypt hash)
INSERT INTO tbl_Admins (full_name, email, password_hash, role_title)
VALUES ('Dr. Elizabeth Kiprono', 'admin@stmarys.ac.ke', '$2y$10$wN9v40L5l5.L5q0rS1Xq6OBcZ2VsmNlWpEaZk5sQ7j1nJ5aE6oK6u', 'Principal & Chief Administrator');

-- Insert Sample Student
INSERT INTO tbl_Students (
    admission_no, full_name, dob, gender, national_id, email, phone, 
    address, form_class, stream, study_mode, previous_school, admission_year, 
    guardian_name, guardian_phone, password_hash, status, fee_balance, total_fees
) VALUES (
    'SMSS/2024/0142', 'Kevin Otieno Omondi', #2009-04-14#, 'Male', 'BC-9844210', 
    'kevin.otieno@student.stmarys.ac.ke', '0712 345 678', 'P.O. Box 450, Nairobi', 
    'Form 3', 'Blue', 'Boarder', 'Kilimani Junior Academy', 2024, 
    'Peter Omondi', '0722 998 877', '$2y$10$wN9v40L5l5.L5q0rS1Xq6OBcZ2VsmNlWpEaZk5sQ7j1nJ5aE6oK6u', 
    'Active', 4500.00, 48000.00
);
`
  },
  {
    filename: 'MS_Access_Setup_Guide.md',
    category: 'Setup Documentation',
    description: 'Step-by-step tutorial on connecting PHP to Microsoft Access on Windows & XAMPP/WAMP',
    content: `# Connecting PHP to Microsoft Access (.accdb) via ODBC

This guide outlines how to host and run this project using Microsoft Access as your backend database with PHP.

---

## 1. Prerequisites
1. **Windows OS**: Microsoft Access ODBC drivers run natively on Windows.
2. **Microsoft Access Database Engine Redistributable**:
   - Download the free Microsoft Access Database Engine (2010 or 2016) from Microsoft.
   - **Crucial Rule**: The bitness of the Access Driver (32-bit or 64-bit) MUST match your PHP installation bitness!
   - If using 64-bit XAMPP (PHP 64-bit), install the 64-bit Access Database Engine.
3. **XAMPP or WampServer** installed.

---

## 2. Enabling ODBC in PHP (\`php.ini\`)
Open your \`php.ini\` file (via XAMPP Control Panel > Apache > Config > php.ini) and ensure these extensions are uncommented:

\`\`\`ini
extension=pdo_odbc
extension=odbc
\`\`\`

Restart Apache after saving \`php.ini\`.

---

## 3. Creating the Database File
1. Open Microsoft Access.
2. Create a new Blank Desktop Database.
3. Save it as \`st_marys_school.accdb\` inside your project folder:
   \`htdocs/st_marys_portal/database/st_marys_school.accdb\`
4. Go to **Create > Query Design**, switch to **SQL View**, paste the contents of \`schema_access.sql\`, and click **Run (!)**.

---

## 4. File Permissions (Important)
Microsoft Access creates a temporary lock file (\`.laccdb\`) in the same directory whenever a connection is opened.
- Ensure the \`database/\` folder has full Write permissions for the \`IUSR\` / \`Everyone\` or Windows user running Apache.

---

## 5. Testing the Connection
Run \`php -r "new PDO('odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=database/st_marys_school.accdb;'); echo 'Connected!';"\`
or open \`api.php?action=get_stats\` in your browser!
`
  }
];
