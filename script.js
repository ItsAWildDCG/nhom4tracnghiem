let isLogin = true;

let users = [
  { username: "baba", password: "123456", role: "user" },
  { username: "student", password: "password", role: "user" },
  { username: "admin", password: "admin123", role: "admin" }
];

function toggleMode() {

  isLogin = !isLogin;

  document.getElementById("email-field").classList.toggle("hidden");
  document.getElementById("confirm-field").classList.toggle("hidden");

  document.getElementById("auth-button").innerText =
    isLogin ? "Log In" : "Sign Up";

  document.getElementById("auth-subtitle").innerText =
    isLogin
      ? "Welcome back! Please log in to continue."
      : "Create an account to get started.";

  document.getElementById("switch-text").innerText =
    isLogin
      ? "Don't have an account?"
      : "Already have an account?";

  document.getElementById("switch-link").innerText =
    isLogin ? "Sign Up" : "Log In";
}

function togglePassword(icon) {
  const input = icon.previousElementSibling;
  input.type = input.type === "password" ? "text" : "password";
}

function handleAuth() {

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (isLogin) {

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    showDashboard(username);

  } else {

    const email = document.getElementById("email").value;
    const confirm = document.getElementById("confirm-password").value;

    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    users.push({
      username: username,
      password: password,
      role: "user"
    });

    alert("Account created! Please log in.");
    toggleMode();
  }
}

function showDashboard(username) {

  document.getElementById("auth-page").classList.add("hidden");
  document.getElementById("dashboard-page").classList.remove("hidden");

  document.getElementById("welcome-text").innerText =
    "Welcome, " + username + "!";
}

function logout() {

  document.getElementById("dashboard-page").classList.add("hidden");
  document.getElementById("auth-page").classList.remove("hidden");

}
