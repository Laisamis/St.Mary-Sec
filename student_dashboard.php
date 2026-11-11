<?php
require_once __DIR__ . '/config.php';

// Session Guard: Must be logged in as student
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'student' || empty($_SESSION['admission_no'])) {
    header("Location: login.html?err=unauthorized");
    exit();
}

$admissionNo = $_SESSION['admission_no'];
$student = null;

// Fetch ONLY this student's data from tbl_students
if ($conn && $db_connected) {
    try {
        $stmt = $conn->prepare("SELECT * FROM tbl_students WHERE admission_no = ?");
        $stmt->execute([$admissionNo]);
        $student = $stmt->fetch();
    } catch (Exception $e) {
        // Fallback search by email if admission_no was not matched
        try {
            $stmt = $conn->prepare("SELECT * FROM tbl_students WHERE LCASE(email) = ?");
            $stmt->execute([strtolower($admissionNo)]);
            $student = $stmt->fetch();
        } catch (Exception $ex) {}
    }
}

// Fallback to session data if database record is empty
if (!$student && isset($_SESSION['stMarysCurrentStudent'])) {
    $student = $_SESSION['stMarysCurrentStudent'];
}

// Extract specific student fields
$fullName   = $student['full_name'] ?? 'Registered Student';
$admNumber  = $student['admission_no'] ?? $admissionNo;
$dob        = $student['dob'] ?? 'Not Specified';
$email      = $student['email'] ?? '';
$phone      = $student['phone'] ?? 'N/A';
$gender     = $student['gender'] ?? 'N/A';
$formClass  = $student['form_class'] ?? ($student['class_grade'] ?? 'Form 1');
$stream     = $student['stream'] ?? 'East';
$studyMode  = $student['study_mode'] ?? 'Boarder';
$house      = $student['house'] ?? 'St. Patrick House';
$feeBalance = isset($student['fee_balance']) ? number_format((float)$student['fee_balance'], 2) : '48,000.00';
$initials   = strtoupper(substr($fullName, 0, 1));
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Dashboard | <?= htmlspecialchars($fullName) ?></title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html">
      <span class="brand-mark">SM</span>
      <span class="brand-text">ST. MARY'S <strong>STUDENT PORTAL</strong></span>
    </a>
    <div>
      <span style="font-size: 13px; font-weight: 600; margin-right: 15px;">Logged in: <strong style="color:var(--blue);"><?= htmlspecialchars($fullName) ?></strong></span>
      <a href="logout.php" class="btn btn-outline" style="padding: 6px 14px; font-size: 12px;">Sign Out</a>
    </div>
  </header>

  <main class="section-wrap">
    <!-- Logged-in Student Dossier Banner -->
    <div style="background:#fff; border:1px solid var(--line); border-radius:18px; padding:24px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
      <div style="display:flex; align-items:center; gap:16px;">
        <div style="width:64px; height:64px; border-radius:14px; background:var(--blue); color:#fff; display:grid; place-items:center; font-size:26px; font-weight:bold;">
          <?= $initials ?>
        </div>
        <div>
          <h2 style="font-size:24px; margin-bottom:4px; color:var(--navy);"><?= htmlspecialchars($fullName) ?></h2>
          <div style="font-size:13px; color:var(--muted); line-height:1.6;">
            Admission No: <strong style="color:var(--blue); font-family:monospace; font-size:15px;"><?= htmlspecialchars($admNumber) ?></strong> · 
            Class: <strong><?= htmlspecialchars($formClass . ' ' . $stream) ?></strong> · 
            Mode: <strong><?= htmlspecialchars($studyMode) ?></strong> · 
            House: <strong><?= htmlspecialchars($house) ?></strong>
          </div>
        </div>
      </div>
      <div>
        <button onclick="window.print()" class="btn btn-outline">🖨️ Print Student Statement</button>
      </div>
    </div>

    <!-- Student Stats -->
    <div class="stat-grid">
      <div class="stat-box">
        <span>Current Term Mean</span>
        <strong>82.4%</strong>
        <small style="color: var(--emerald); font-weight:700;">Mean Grade: A- (Distinction)</small>
      </div>
      <div class="stat-box">
        <span>Student Email & Contact</span>
        <strong style="font-size: 16px; color: var(--navy); word-break: break-all;"><?= htmlspecialchars($email) ?></strong>
        <small style="color: var(--muted);">Tel: <?= htmlspecialchars($phone) ?></small>
      </div>
      <div class="stat-box">
        <span>Outstanding Fee Balance</span>
        <strong style="color: var(--amber);">KES <?= $feeBalance ?></strong>
        <small style="color: var(--muted);">Term 1 Status</small>
      </div>
    </div>

    <!-- Personalized Academic Report Card -->
    <div class="table-card" style="margin-bottom: 30px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h3 style="margin-bottom:2px;">Academic Term Progress Report Card</h3>
          <span style="font-size:12px; color:var(--muted);">Student File: <strong><?= htmlspecialchars($admNumber) ?></strong> — <?= htmlspecialchars($fullName) ?></span>
        </div>
        <span style="background:#eff6ff; color:#1d4ed8; font-weight:bold; font-size:11px; padding:4px 10px; border-radius:50px;">Term 2 - 2026</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Subject Name</th>
            <th>Term Exam (100)</th>
            <th>Grade</th>
            <th>Teacher Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>101</td><td><b>English Language & Literature</b></td><td>84%</td><td><b style="color:var(--emerald);">A</b></td><td>Exemplary analytical capability and composition</td></tr>
          <tr><td>102</td><td><b>Kiswahili & Fasihi</b></td><td>78%</td><td><b style="color:var(--emerald);">A-</b></td><td>Umahiri mzuri katika insha na fasihi simulizi</td></tr>
          <tr><td>121</td><td><b>Mathematics</b></td><td>88%</td><td><b style="color:var(--emerald);">A</b></td><td>Consistent problem solving in algebra and calculus</td></tr>
          <tr><td>231</td><td><b>Biology</b></td><td>79%</td><td><b style="color:var(--emerald);">A-</b></td><td>Accurate laboratory drawings and physiological notes</td></tr>
          <tr><td>232</td><td><b>Physics</b></td><td>82%</td><td><b style="color:var(--emerald);">A</b></td><td>Sound mechanics and electric circuit analysis</td></tr>
          <tr><td>233</td><td><b>Chemistry</b></td><td>75%</td><td><b style="color:var(--emerald);">A-</b></td><td>Thorough titration calculations</td></tr>
          <tr><td>451</td><td><b>Computer Studies</b></td><td>92%</td><td><b style="color:var(--emerald);">A</b></td><td>Outstanding database SQL mastery</td></tr>
        </tbody>
      </table>

      <div style="margin-top:20px; padding:15px; background:#f8fafc; border-radius:10px; font-size:12px; color:var(--muted); line-height:1.7;">
        <div><b>Class Teacher's Remark:</b> "<?= htmlspecialchars($fullName) ?> is an exemplary student who demonstrates high academic aptitude and discipline."</div>
        <div><b>Principal's Endorsement:</b> "Commendable term performance. Approved for transition to the next academic stage."</div>
      </div>
    </div>
  </main>

  <footer>
    <div>© 2026 St. Mary's Secondary School. All rights reserved.</div>
  </footer>
</body>
</html>