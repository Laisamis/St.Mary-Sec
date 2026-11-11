/**
 * St. Mary's Secondary School Portal Frontend JavaScript
 * Supports both standalone offline mode and live PHP + MS Access backend
 */

const STORAGE_KEY = "stMarysStudents_standalone";

// Default seed students if none in localStorage
const DEFAULT_STUDENTS = [
  {
    admissionNo: "SMSS/2024/0142",
    fullName: "Kevin Otieno Omondi",
    formClass: "Form 3 Blue",
    studyMode: "Boarder",
    house: "St. Patrick House",
    email: "kevin.otieno@student.stmarys.ac.ke",
    phone: "0712 345 678",
    feeBalance: 4500,
    password: "Password123"
  },
  {
    admissionNo: "SMSS/2023/0088",
    fullName: "Grace Wanjiku Kamau",
    formClass: "Form 4 East",
    studyMode: "Boarder",
    house: "Mother Teresa",
    email: "grace.wanjiku@student.stmarys.ac.ke",
    phone: "0723 456 789",
    feeBalance: 0,
    password: "Password123"
  },
  {
    admissionNo: "SMSS/2025/0215",
    fullName: "Brian Kiprop Cheruiyot",
    formClass: "Form 2 West",
    studyMode: "Day Scholar",
    house: "St. Jude",
    email: "brian.kiprop@student.stmarys.ac.ke",
    phone: "0734 567 890",
    feeBalance: 12000,
    password: "Password123"
  },
  {
    admissionNo: "SMSS/2026/0301",
    fullName: "Amina Hassan Sheikh",
    formClass: "Form 1 North",
    studyMode: "Boarder",
    house: "Archbishop Ndingi",
    email: "amina.hassan@student.stmarys.ac.ke",
    phone: "0745 678 901",
    feeBalance: 0,
    password: "Password123"
  }
];

function getStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  saveStudents(DEFAULT_STUDENTS);
  return DEFAULT_STUDENTS;
}

function saveStudents(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

// Mobile Nav Menu
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

// Registration Form Handler
const regForm = document.getElementById("registrationForm");
if (regForm) {
  regForm.addEventListener("submit", function(e) {
    const pass = this.elements["password"]?.value;
    const confirmPass = this.elements["confirmPassword"]?.value;
    const msg = document.getElementById("registrationMessage");

    if (pass !== confirmPass) {
      e.preventDefault();
      if (msg) {
        msg.textContent = "Error: Passwords do not match. Please re-enter.";
        msg.style.color = "#dc2626";
      }
      return;
    }

    // Process client registration record
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    const students = getStudents();

    if (students.some(s => s.email.toLowerCase() === data.email.toLowerCase())) {
      e.preventDefault();
      if (msg) {
        msg.textContent = "Error: A student with this email address is already registered.";
        msg.style.color = "#dc2626";
      }
      return;
    }

    const year = data.admissionYear || 2026;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const admissionNo = "SMSS/" + year + "/" + randomSuffix;

    const newStudent = {
      admissionNo: admissionNo,
      fullName: data.fullName,
      formClass: data.formClass + (data.stream ? " " + data.stream : ""),
      studyMode: data.studyMode,
      house: data.house || "St. Patrick House",
      email: data.email.toLowerCase(),
      phone: data.phone,
      feeBalance: data.studyMode === "Boarder" ? 48000 : 36000,
      password: data.password
    };

    students.unshift(newStudent);
    saveStudents(students);

    // Save as current session student
    sessionStorage.setItem("stMarysCurrentStudent", JSON.stringify(newStudent));

    // If opening offline or static HTML without PHP
    if (window.location.protocol === "file:" || !window.location.href.includes(".php")) {
      e.preventDefault();
      this.reset();
      if (msg) {
        msg.innerHTML = "Registration Successful! Assigned Admission No: <b style='color:#1d4ed8; font-family:monospace;'>" + admissionNo + "</b>. <br><a href='login.html' style='display:inline-block; margin-top:8px; color:#1d4ed8; font-weight:bold;'>Click here to Sign In &rarr;</a>";
        msg.style.color = "#059669";
      }
    }
  });
}

// Login Form Handler
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    const role = document.getElementById("loginRole").value;
    const identity = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMessage");

    // Client fallback check
    if (role === "admin") {
      if ((identity === "admin@stmarys.ac.ke" || identity === "admin@portal.test" || identity === "admin") &&
          (password === "Admin123" || password === "admin")) {
        sessionStorage.setItem("stMarysRole", "admin");
        if (window.location.protocol === "file:" || !window.location.href.includes(".php")) {
          e.preventDefault();
          window.location.href = "admin_dashboard.html";
        }
      } else {
        e.preventDefault();
        if (msg) {
          msg.textContent = "Invalid administrator email or password. (Demo: admin@stmarys.ac.ke / Admin123)";
          msg.style.color = "#dc2626";
        }
      }
    } else {
      // Student login
      const students = getStudents();
      const found = students.find(s =>
        s.email.toLowerCase() === identity ||
        s.admissionNo.toLowerCase() === identity
      );

      if (found && (password === "Password123" || found.password === password)) {
        sessionStorage.setItem("stMarysRole", "student");
        sessionStorage.setItem("stMarysCurrentStudent", JSON.stringify(found));
        if (window.location.protocol === "file:" || !window.location.href.includes(".php")) {
          e.preventDefault();
          window.location.href = "student_dashboard.html";
        }
      } else {
        e.preventDefault();
        if (msg) {
          msg.textContent = "Invalid admission number / email or password. (Demo: kevin.otieno@student.stmarys.ac.ke / Password123)";
          msg.style.color = "#dc2626";
        }
      }
    }
  });
}

// Student Dashboard Dynamic Population
if (document.getElementById("studentFullName") && document.getElementById("studentAdmNo")) {
  try {
    const saved = sessionStorage.getItem("stMarysCurrentStudent");
    if (saved) {
      const student = JSON.parse(saved);
      document.getElementById("studentFullName").textContent = student.fullName;
      document.getElementById("studentAdmNo").textContent = student.admissionNo;
      if (document.getElementById("studentHeaderName")) {
        document.getElementById("studentHeaderName").textContent = student.fullName.split(" ")[0];
      }
      if (document.getElementById("feeRefAdm")) {
        document.getElementById("feeRefAdm").textContent = student.admissionNo;
      }
    }
  } catch (e) {}
}

// Admin Dashboard Table Population & Search
const adminTable = document.getElementById("adminStudentTbody");
const adminSearch = document.getElementById("adminSearchInput");

function renderAdminTable(filter = "") {
  if (!adminTable) return;
  const students = getStudents();
  const query = filter.toLowerCase();

  const matched = students.filter(s =>
    s.fullName.toLowerCase().includes(query) ||
    s.admissionNo.toLowerCase().includes(query) ||
    s.email.toLowerCase().includes(query) ||
    s.phone.includes(query)
  );

  if (document.getElementById("adminTotalStudents")) {
    document.getElementById("adminTotalStudents").textContent = students.length;
  }
  if (document.getElementById("adminBoarders")) {
    document.getElementById("adminBoarders").textContent = students.filter(s => s.studyMode === "Boarder").length;
  }
  if (document.getElementById("adminDay")) {
    document.getElementById("adminDay").textContent = students.filter(s => s.studyMode === "Day Scholar").length;
  }

  if (matched.length === 0) {
    adminTable.innerHTML = "<tr><td colspan='8' style='text-align:center; padding:20px; color:#64748b;'>No matching student records found.</td></tr>";
    return;
  }

  adminTable.innerHTML = matched.map(s => `
    <tr>
      <td><strong style="font-family:'JetBrains Mono'; color:var(--blue);">${s.admissionNo}</strong></td>
      <td><b>${s.fullName}</b></td>
      <td>${s.formClass}</td>
      <td>${s.studyMode}</td>
      <td>${s.email}</td>
      <td>${s.phone}</td>
      <td>KES ${(s.feeBalance || 0).toLocaleString()}</td>
      <td>
        <button class="btn btn-outline" style="padding:4px 8px; font-size:11px;" onclick="alert('Student Dossier: ' + '${s.fullName}' + '\\nAdm: ' + '${s.admissionNo}' + '\\nHouse: ' + '${s.house || "St. Patrick"}')">View</button>
      </td>
    </tr>
  `).join("");
}

if (adminTable) {
  renderAdminTable();
  if (adminSearch) {
    adminSearch.addEventListener("input", (e) => renderAdminTable(e.target.value));
  }
}

// Export CSV handler
const exportCsvBtn = document.getElementById("exportCsvBtn");
if (exportCsvBtn) {
  exportCsvBtn.addEventListener("click", () => {
    const students = getStudents();
    const headers = ["Admission No", "Full Name", "Class", "Study Mode", "Email", "Phone", "Fee Balance"];
    const rows = students.map(s => [
      `"${s.admissionNo}"`,
      `"${s.fullName}"`,
      `"${s.formClass}"`,
      `"${s.studyMode}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      s.feeBalance || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = "st_marys_students.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}
