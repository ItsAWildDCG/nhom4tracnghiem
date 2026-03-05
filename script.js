let isLogin = true;

/* HARDCODED ACCOUNTS */
const accounts = [
  { username: "user1", password: "123456", role: "user" },
  { username: "student", password: "password", role: "user" },
  { username: "admin", password: "admin123", role: "admin" }
];

function toggleMode() {
  isLogin = !isLogin;

  document.getElementById("email-field").classList.toggle("hidden");
  document.getElementById("confirm-field").classList.toggle("hidden");

  document.getElementById("submit-btn").innerText = isLogin ? "Log In" : "Sign Up";
  document.getElementById("subtitle").innerText = isLogin
    ? "Welcome back! Please log in to continue."
    : "Create an account to get started.";

  document.getElementById("switch-text").innerText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";

  document.querySelector(".switch a").innerText = isLogin ? "Sign Up" : "Log In";
}

function togglePassword(icon) {
  const input = icon.previousElementSibling;
  input.type = input.type === "password" ? "text" : "password";
}

function submitForm() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (isLogin) {
    const user = accounts.find(
      acc => acc.username === username && acc.password === password
    );

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    alert(`Login successful!\nRole: ${user.role.toUpperCase()}`);
  } else {
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    alert("Sign up successful! (not saved permanently)");
  }
}
