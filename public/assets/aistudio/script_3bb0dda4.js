const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const STORAGE_KEY = "studentPortalRecords";
let currentStudent = null;

$("#year").textContent = new Date().getFullYear();
const yearSelect = $("#admissionYear");
for (let year = new Date().getFullYear(); year <= new Date().getFullYear() + 2; year++) {
  const option = document.createElement("option");
  option.value = year; option.textContent = year;
  yearSelect.appendChild(option);
}
yearSelect.value = new Date().getFullYear();

function getRecords() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveRecords(records) { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
}
function hideDashboards() {
  $("#studentDashboard").classList.add("hidden");
  $("#adminDashboard").classList.add("hidden");
}
function navigateTo(id) {
  hideDashboards();
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({behavior:"smooth"});
}

$("#registrationForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const message = $("#registrationMessage");
  if (data.password !== data.confirmPassword) {
    showMessage(message, "The passwords do not match. Please try again.", "error"); return;
  }
  const records = getRecords();
  if (records.some(record => record.email.toLowerCase() === data.email.toLowerCase())) {
    showMessage(message, "This email is already registered. Please use another email or log in.", "error"); return;
  }
  const record = {...data, id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), registeredAt: new Date().toISOString()};
  records.push(record); saveRecords(records);
  form.reset(); yearSelect.value = new Date().getFullYear();
  showMessage(message, "Registration successful! You can now log in using your email and password.", "success");
});

$("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const role = $("#loginRole").value;
  const email = $("#loginEmail").value.trim().toLowerCase();
  const password = $("#loginPassword").value;
  const message = $("#loginMessage");
  if (role === "admin") {
    if (email === "admin@portal.test" && password === "Admin123") {
      showMessage(message, "Administrator login successful.", "success");
      renderAdmin(); navigateTo("adminDashboard");
    } else showMessage(message, "Invalid administrator email or password.", "error");
    return;
  }
  const student = getRecords().find(record => record.email.toLowerCase() === email && record.password === password);
  if (!student) { showMessage(message, "Login failed. Check your details or register first.", "error"); return; }
  currentStudent = student;
  showMessage(message, "Login successful.", "success");
  renderStudent(student); navigateTo("studentDashboard");
});

function renderStudent(student) {
  $("#studentName").textContent = student.fullName;
  const fields = [
    ["Full name", student.fullName], ["Email", student.email], ["Phone", student.phone],
    ["Date of birth", student.dob], ["Gender", student.gender], ["Course", student.course],
    ["Study mode", student.studyMode], ["Admission year", student.admissionYear]
  ];
  $("#studentDetails").innerHTML = fields.map(([label,value]) =>
    `<div class="detail-item"><small>${escapeHTML(label)}</small><b>${escapeHTML(value || "Not provided")}</b></div>`
  ).join("");
}
function renderAdmin(filter = "") {
  const records = getRecords();
  const query = filter.toLowerCase();
  const visible = records.filter(record =>
    [record.fullName, record.email, record.course, record.phone].join(" ").toLowerCase().includes(query)
  );
  $("#totalStudents").textContent = records.length;
  $("#shownStudents").textContent = visible.length;
  $("#emptyRecords").style.display = visible.length ? "none" : "block";
  $("#studentTableBody").innerHTML = visible.map(record => `
    <tr><td>${escapeHTML(record.fullName)}</td><td>${escapeHTML(record.email)}</td>
    <td>${escapeHTML(record.phone)}</td><td>${escapeHTML(record.course)}</td>
    <td>${escapeHTML(record.studyMode)}</td><td><button class="delete-btn" data-id="${escapeHTML(record.id)}">Delete</button></td></tr>
  `).join("");
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
$("#studentSearch").addEventListener("input", event => renderAdmin(event.target.value));
$("#studentTableBody").addEventListener("click", event => {
  const button = event.target.closest(".delete-btn");
  if (!button) return;
  if (!confirm("Delete this student record?")) return;
  saveRecords(getRecords().filter(record => record.id !== button.dataset.id));
  renderAdmin($("#studentSearch").value);
});
$$(".logout-btn").forEach(button => button.addEventListener("click", () => {
  currentStudent = null; hideDashboards(); navigateTo("login");
}));
$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$$(".nav-link").forEach(link => link.addEventListener("click", () => {
  $("#mainNav").classList.remove("open");
  $$(".nav-link").forEach(item => item.classList.remove("active"));
  link.classList.add("active");
  hideDashboards();
}));
window.addEventListener("hashchange", hideDashboards);
