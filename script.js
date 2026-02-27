let isLogin = true;

function toggleAuth() {
  isLogin = !isLogin;
  document.getElementById("auth-title").innerText =
    isLogin ? "Login" : "Sign Up";
}

function login() {
  const role = document.getElementById("role").value;

  document.getElementById("auth-container").classList.add("hidden");

  if (role === "admin") {
    document.getElementById("admin-dashboard").classList.remove("hidden");
  } else {
    document.getElementById("user-dashboard").classList.remove("hidden");
  }
}

function logout() {
  document.getElementById("auth-container").classList.remove("hidden");
  document.getElementById("user-dashboard").classList.add("hidden");
  document.getElementById("admin-dashboard").classList.add("hidden");
}

function startQuiz() {
  document.getElementById("quiz").classList.remove("hidden");
}