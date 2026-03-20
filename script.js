let isLogin = true;

const examId = localStorage.getItem("editingExamId");

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

// 👁️ TOGGLE PASSWORD
function togglePassword(icon) {
  const input = icon.previousElementSibling;
  input.type = input.type === "password" ? "text" : "password";
}


// 🚀 HANDLE AUTH
function handleAuth() {
    if (isLogin) {
        login();
    } else {
        register();
    }
}

async function register() {

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Account created! Please log in.");
        toggleMode();

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

async function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        // 💾 Save user + token
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // 🔀 Redirect
        if (data.user.role === "admin") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "user-dashboard.html";
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    // 🔐 Protect pages (except login)
    if (!user && !document.getElementById("auth-button")) {
        window.location.href = "index.html";
        return;
    }

    // 👋 Welcome text
    const welcomeText = document.getElementById("welcome-text");
    if (welcomeText && user) {
        welcomeText.innerText = "Welcome, " + user.username + "!";
    }

    // 📊 USER DASHBOARD
    if (document.getElementById("exam-list")) {
        loadExams();
        loadMyResults();
    }

    // 📝 EXAM PAGE
    if (document.getElementById("question-text")) {
        loadExam();
    }

    // 📊 RESULT PAGE
    if (document.getElementById("result-title")) {
        initResultPage();
    }

    // 👨‍💼 ADMIN DASHBOARD
    if (document.getElementById("student-table-body")) {
        loadStudents();
        loadAdminDashboard();
    }

    // 🛠 MANAGE EXAMS
    if (document.getElementById("admin-exam-list")) {
        loadAdminExams();
        loadExamForEdit();
    }

    // 👥 VIEW USERS
    if (document.getElementById("user-list")) {
        loadUsers();
    }

    // 👤 USER DETAIL
    if (document.getElementById("user-name")) {
        loadUserDetail();
    }

});

let timerInterval;
let timeLeft;

async function loadMyResults() {
    console.log("Loading results...");
    const userId = localStorage.getItem("userId");
    console.log(userId);
    try {
        const res = await fetch(
            `http://localhost:8080/api/results/me?userId=${userId}`
        );

        const results = await res.json();

        const container = document.getElementById("results-list");
        container.innerHTML = "";

        results.forEach(r => {
            const div = document.createElement("div");

            div.innerHTML = `
                <h4>${r.title}</h4>
                <p>Score: ${r.score}</p>
                <p>Date: ${r.date}</p>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
    }
}

async function loadExams() {
    console.log("Loading exams...");
    try {
        const res = await fetch("http://localhost:8080/api/exams");
        const exams = await res.json();

        const container = document.getElementById("exam-list");
        container.innerHTML = "";

        exams.forEach(exam => {
            const div = document.createElement("div");

            div.innerHTML = `
                <h3>${exam.title}</h3>
                <p>${exam.questionCount} questions - ${exam.duration} minutes</p>
                <button onclick="startExam(${exam.id})">Start</button>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
    }
}

function startExam(id) {
    localStorage.setItem("currentExamId", id);
    console.log(localStorage.getItem("currentExamId"))
    window.location.href = "exam-page.html";
}


async function loadExam() {

    const examId = localStorage.getItem("currentExamId");
    try {
        const res = await fetch(
            `http://localhost:8080/api/exams/${examId}`
        );
        console.log("FETCH OK");
        const exam = await res.json();
        currentExam = exam;
        localStorage.setItem("currentExam", JSON.stringify(currentExam));
        console.log(currentExam)
        const savedAnswers = localStorage.getItem("userAnswers");
        if (savedAnswers) {
            userAnswers = JSON.parse(savedAnswers);
            currentQuestionIndex = userAnswers.length;
        }
        document.getElementById("exam-title").innerText = currentExam.title;
        startTimer(currentExam.duration);
        loadQuestion();
    } catch (err) {
        console.error(err);
        alert("Failed to load exam");
        window.location.href = "user-dashboard.html";
    }
}


function startTimer(minutes) {

    timeLeft = minutes * 60;

    timerInterval = setInterval(() => {

        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;

        document.getElementById("timer").innerText =
            `${mins}:${secs < 10 ? "0" : ""}${secs}`;

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            finishExam();
        }

    }, 1000);
}



function loadQuestion(){

    const question = currentExam.questions[currentQuestionIndex];

    document.getElementById("question-text").innerText = question.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    question.options.forEach((opt, i) => {

        const btn = document.createElement("button");
        btn.innerText = opt;

        btn.onclick = () => selectAnswer(i);

        // ✅ restore selected answer
        if (userAnswers[currentQuestionIndex] === i) {
            btn.classList.add("selected");
        }

        optionsDiv.appendChild(btn);
    });
}

let currentExam;
let currentQuestionIndex = 0;
let userAnswers = [];

function selectAnswer(optionIndex){

    const buttons = document.querySelectorAll("#options button");

    buttons.forEach(btn => btn.classList.remove("selected"));

    buttons[optionIndex].classList.add("selected");

    userAnswers[currentQuestionIndex] = optionIndex;

    // 💾 save instantly
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
}


function nextQuestion(){
    if (userAnswers[currentQuestionIndex] === undefined) {
        alert("Please select an answer!");
        return;
    }

    currentQuestionIndex++;

    if(currentQuestionIndex >= currentExam.questions.length){
        finishExam();
        return;
    }

    loadQuestion();
}
async function finishExam() {

    clearInterval(timerInterval);
    const examId = localStorage.getItem("currentExamId");
    const answers = userAnswers.map((ans, index) => ({
        questionId: index,
        selectedOption: ans
    }));

    try {
        const userId = localStorage.getItem("userId");
        console.log("Submitting answers:", answers);
        const res = await fetch(`http://localhost:8080/api/exams/${examId}/submit?userId=${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                answers
            })
        });

        const result = await res.json();

        localStorage.setItem("examResult", JSON.stringify(result));

        localStorage.removeItem("currentExam");
        localStorage.removeItem("userAnswers");

        window.location.href = "result-page.html";

    } catch (err) {
        console.error(err);
        alert("Submit failed");
    }
}

function generateReview(result) {
    const container = document.getElementById("review-list");
    container.innerHTML = "";

    result.review.forEach((q, i) => {
        const userAnswer =
            q.selected !== null ? q.selected : "No answer";

        const correctAnswer = q.correct;

        const item = document.createElement("div");
        item.className = "review-item";

        item.innerHTML = `
            <h4>Question ${i + 1}</h4>
            <p>${q.question}</p>
            <p><strong>You answered:</strong> ${userAnswer}</p>
            <p><strong>Correct answer:</strong> ${correctAnswer}</p>
        `;

        container.appendChild(item);
    });
}

async function loadAdminDashboard() {

    try {
        const res = await fetch("http://localhost:8080/api/admin/dashboard");
        const data = await res.json();

        console.log(data);
        console.log(data.students);
        console.log(data.exams);
        console.log(data.attempts);
        console.log(data.avgScore);

        document.getElementById("total-students").innerText = data.students;
        document.getElementById("total-exams").innerText = data.exams;
        document.getElementById("total-attempts").innerText = data.attempts;
        document.getElementById("avg-score").innerText = data.avgScore;

    } catch (err) {
        console.error(err);
        alert("Failed to load dashboard");
    }
}

function backToDashboard(){
    window.location.href = "user-dashboard.html";
}

function openCreateExam(){
    window.location.href = "create-exam.html";
}

function backToAdmin(){
    window.location.href = "admin-dashboard.html";
}

function openManageExams(){
    window.location.href = "manage-exams.html";
}

function backToAdminDashboard(){
    window.location.href = "admin-dashboard.html";
}

function addQuestion(data = null) {

    const container = document.getElementById("question-container");

    const div = document.createElement("div");
    div.className = "question-block";

    div.innerHTML = `
        <input class="question" placeholder="Question"
               value="${data ? data.question : ""}">

        <input class="option" placeholder="Option 1"
               value="${data ? data.options[0] : ""}">
        <input class="option" placeholder="Option 2"
               value="${data ? data.options[1] : ""}">
        <input class="option" placeholder="Option 3"
               value="${data ? data.options[2] : ""}">
        <input class="option" placeholder="Option 4"
               value="${data ? data.options[3] : ""}">

        <input class="answer" type="number" min="0" max="3"
               value="${data ? data.answer : ""}">
    `;

    container.appendChild(div);
}

async function saveExam() {
    // 🧠 Get values from form
    const title = document.getElementById("exam-title").value;
    const duration = parseInt(document.getElementById("duration").value);

    // 🧠 Build questions array (IMPORTANT)
    const questions = collectQuestions(); // ← you must implement this

    const examId = localStorage.getItem("editingExamId");

    const url = examId
        ? `http://localhost:8080/api/admin/exams/${examId}`
        : `http://localhost:8080/api/admin/exams`;

    const method = examId ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                duration,
                questions
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Something went wrong");
            return;
        }

        if (examId) {
            localStorage.removeItem("editingExamId");
            alert("Exam updated!");
        } else {
            alert("Exam created!");
        }

        // 🔥 Redirect back to admin dashboard
        window.location.href = "admin-dashboard.html";

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

function collectQuestions() {
    const questionBlocks = document.querySelectorAll(".question-block");

    const questions = [];

    questionBlocks.forEach((block, index) => {
        const questionText = block.querySelector(".question").value;

        const optionEls = block.querySelectorAll(".option");
        const options = Array.from(optionEls).map(opt => opt.value);

        const answer = parseInt(
            block.querySelector(".answer").value
        );

        if (!questionText || options.some(opt => !opt)) {
            alert("Please fill all question fields");
            return [];
        }

        questions.push({
            id: index, // or keep existing if editing
            question: questionText,
            options: options,
            answer: answer
        });
    });

    return questions;
}

function loadStudents(){

    const tbody = document.getElementById("student-table-body");

    tbody.innerHTML = "";

    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.examsTaken}</td>
            <td>${student.avgScore}</td>
            <td>${student.lastExam}</td>
        `;

        tbody.appendChild(row);

    });

}

async function loadAdminExams() {

    const container = document.getElementById("admin-exam-list");
    container.innerHTML = "";

    try {
        const res = await fetch("http://localhost:8080/api/admin/exams");
        const exams = await res.json();

        exams.forEach((exam) => {

            const item = document.createElement("div");
            item.className = "admin-exam-item";

            item.innerHTML = `
                <div class="admin-exam-info">
                    <strong>${exam.title}</strong>
                    <span>${exam.questionCount} questions</span>
                    <span>Attempts: ${exam.attempts}</span>
                    <span>Avg: ${exam.avgScore}</span>
                </div>

                <div class="admin-exam-actions">
                    <button onclick="editExam(${exam.id})">Edit</button>
                    <button onclick="deleteExam(${exam.id})">Delete</button>
                </div>
            `;

            container.appendChild(item);
        });

    } catch (err) {
        console.error(err);
    }
}

function editExam(id) {
    localStorage.setItem("editingExamId", id);
    window.location.href = "create-exam.html"; // reuse page
}

async function loadExamForEdit() {

    const examId = localStorage.getItem("editingExamId");
    if (!examId) return;

    try {
        const res = await fetch(`http://localhost:8080/api/admin/exams/${examId}`);
        const exam = await res.json();

        // Fill title
        document.getElementById("exam-title").value = exam.title;

        // Clear old UI
        const container = document.getElementById("questions-container");
        container.innerHTML = "";

        // Rebuild questions
        exam.questions.forEach((q) => {
            addQuestion(q);
        });

    } catch (err) {
        console.error(err);
    }
}

async function deleteExam(id) {

    if (!confirm("Are you sure you want to delete this exam?")) {
        return;
    }

    try {
        const res = await fetch(
            `http://localhost:8080/api/admin/exams/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await res.json();

        alert("Exam deleted!");

        // 🔄 Reload list
        loadAdminExams();

    } catch (err) {
        console.error(err);
        alert("Delete failed");
    }
}


function openViewUsers(){
    window.location.href = "view-users.html";
}

function backToUsers(){
    window.location.href = "view-users.html";
}

async function loadUsers() {

    const tbody = document.getElementById("user-list");
    tbody.innerHTML = "";

    try {
        const res = await fetch("http://localhost:8080/api/admin/students");
        const students = await res.json();

        students.forEach(student => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.attempts}</td>
                <td>${student.results}</td>
                <td>
                    <button onclick="viewStudent(${student.id})">
                        View
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (err) {
        console.error(err);
    }
}

function viewUsers(id) {
    localStorage.setItem("viewStudentId", id);
    window.location.href = "user-details.html";
}

async function loadUserDetail() {

    const id = localStorage.getItem("viewStudentId");

    try {
        const res = await fetch(
            `http://localhost:8080/api/admin/students/${id}`
        );

        const data = await res.json();

        // 👤 Profile
        document.getElementById("user-name").innerText = data.username;

        // 📊 History
        const container = document.getElementById("student-history");
        container.innerHTML = "";

        data.results.forEach(r => {
            const div = document.createElement("div");

            div.innerHTML = `
                <p>${r.title} - ${r.score}</p>
                <p>${r.date}</p>
                <hr>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
    }
}

function initResultPage(){

    const resultData = localStorage.getItem("examResult");

    if (!resultData) {
        window.location.href = "user-dashboard.html";
        return;
    }

    const result = JSON.parse(resultData);

    console.log(result);

    document.getElementById("result-title").innerText = result.examTitle;

    document.getElementById("score-text").innerText =
        `${result.score} / ${result.total}`;

    generateReview(result);
}


