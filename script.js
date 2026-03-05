const users = [
  { username: "baba", password: "123456", role: "user" },
  { username: "student", password: "password", role: "user" },
  { username: "admin", password: "admin123", role: "admin" }
];

function togglePassword(icon) {
  const input = icon.previousElementSibling;
  input.type = input.type === "password" ? "text" : "password";
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    alert("Invalid credentials");
    return;
  }

  document.getElementById("auth-page").classList.add("hidden");
  document.getElementById("dashboard-page").classList.remove("hidden");

  document.getElementById("welcome-text").innerText = `Welcome, ${user.username}!`;
}

function logout() {
  document.getElementById("dashboard-page").classList.add("hidden");
  document.getElementById("auth-page").classList.remove("hidden");
}
