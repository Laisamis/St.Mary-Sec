document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm && window.location.protocol === "file:") {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const role = document.getElementById("loginRole").value;
      if (role === "admin") {
        window.location.href = "admin_dashboard.html";
      } else {
        window.location.href = "student_dashboard.html";
      }
    });
  }
});