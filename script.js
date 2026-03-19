let isLogin = true;

let users = [
  { username: "baba", password: "123456", role: "user" },
  { username: "student", password: "password", role: "user" },
  { username: "admin", password: "admin123", role: "admin" }
];

localStorage.setItem("currentUser", JSON.stringify(user));

];

let students = JSON.parse(localStorage.getItem("students")) || [
    {
        username: "user1",
        examsTaken: 2,
        avgScore: 7.5,
        history: [
            { exam: "Math Test", score: "8/10" },
            { exam: "CS Test", score: "7/10" }
        ]
    },
    {
        username: "user2",
        examsTaken: 1,
        avgScore: 9,
        history: [
            { exam: "Math Test", score: "9/10" }
        ]
    }
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

// 👁️ TOGGLE PASSWORD
function togglePassword(icon) {
  const input = icon.previousElementSibling;
  input.type = input.type === "password" ? "text" : "password";
}


// 🚀 HANDLE AUTH
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

    // ✅ SAVE USER (for next pages)
    localStorage.setItem("currentUser", JSON.stringify(user));

    // 🔀 REDIRECT BASED ON ROLE
    if (user.role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "user-dashboard.html";
    }

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

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const welcomeText = document.getElementById("welcome-text");
  if (welcomeText) {
    welcomeText.innerText = "Welcome, " + user.username + "!";
  }
});

let timerInterval;
let timeLeft;

const exams = [
{
    id: 1,
    title: "Mathematics Practice Test",
    subject: "Math",
    type: "practice",
    duration: 60,
    questions: [
        {
            question: "5 + 7 = ?",
            options: ["10","11","12","13"],
            answer: 2
        },
        {
            question: "9 x 3 = ?",
            options: ["18","27","21","24"],
            answer: 1
        }
    ]
},

{
    id: 2,
    title: "Computer Science Mid-Term",
    subject: "CS",
    type: "midterm",
    duration: 120,
    questions: [
        {
            question: "What does CPU stand for?",
            options: [
                "Central Processing Unit",
                "Computer Personal Unit",
                "Central Program Utility",
                "Core Processing Utility"
            ],
            answer: 0
        },
        {
            question: "Which language runs in a browser?",
            options: ["Python","Java","C++","JavaScript"],
            answer: 3
        }
    ]
}
];

function loadExams(){

    const container = document.getElementById("exam-list");

    container.innerHTML = "";

    exams.forEach(exam => {

        const card = document.createElement("div");
        card.className = "exam-card";

        card.innerHTML = `
        <div class="exam-info">

            <div class="tags">
                <span class="tag">${exam.type}</span>
            </div>

            <h4>${exam.title}</h4>

            <div class="exam-meta">
                <span>${exam.duration} minutes</span>
                <span>${exam.questions.length} questions</span>
            </div>

        </div>

        <button class="start-btn">Start Exam →</button>
        `;

        card.querySelector(".start-btn")
            .addEventListener("click", () => startExam(exam.id));

        container.appendChild(card);

    });

}

function startExam(examId){

    const exam = exams.find(e => e.id === examId);
    if(!exam) return;

    localStorage.setItem("currentExam", JSON.stringify(exam));

    window.location.href = "exam-page.html";
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

let currentExam = null;
let currentQuestionIndex = 0;

document.addEventListener("DOMContentLoaded", function () {

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const examData = localStorage.getItem("currentExam");
    if (!examData) {
        window.location.href = "user-dashboard.html";
        return;
    }

    currentExam = JSON.parse(examData);

    // 📝 Set title
    document.getElementById("exam-title").innerText = currentExam.title;

    // ⏱ Start timer
    startTimer(currentExam.duration);

    // ❓ Load first question
    loadQuestion();
});

document.addEventListener("DOMContentLoaded", function () {

    const examData = localStorage.getItem("currentExam");
    if (!examData) {
        window.location.href = "user-dashboard.html";
        return;
    }

    currentExam = JSON.parse(examData);

    // 🧠 restore progress if exists
    const savedAnswers = localStorage.getItem("userAnswers");
    if (savedAnswers) {
        userAnswers = JSON.parse(savedAnswers);
        currentQuestionIndex = userAnswers.length;
    }

    document.getElementById("exam-title").innerText = currentExam.title;

    startTimer(currentExam.duration);
    loadQuestion();
});

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

function finishExam(){

    clearInterval(timerInterval);

    let score = 0;

    currentExam.questions.forEach((q, i) => {
        if (userAnswers[i] === q.answer) {
            score++;
        }
    });

    // 💾 Save result
    localStorage.setItem("examResult", JSON.stringify({
        examTitle: currentExam.title,
        score: score,
        total: currentExam.questions.length,
        answers: userAnswers,
        questions: currentExam.questions
    }));

    // 🧹 Cleanup
    localStorage.removeItem("currentExam");
    localStorage.removeItem("userAnswers");

    // 🚀 Redirect to result page
    window.location.href = "result-page.html";
}

function generateReview(result){

    const container = document.getElementById("review-list");
    container.innerHTML = "";

    result.questions.forEach((q, i) => {

        const userAnswerIndex = result.answers[i];
        const correctIndex = q.answer;

        const userAnswer =
            userAnswerIndex !== undefined
                ? q.options[userAnswerIndex]
                : "No answer";

        const correctAnswer = q.options[correctIndex];

        const item = document.createElement("div");
        item.className = "review-item";

        item.innerHTML = `
            <h4>Question ${i+1}</h4>
            <p>${q.question}</p>
            <p><strong>You answered:</strong> ${userAnswer}</p>
            <p><strong>Correct answer:</strong> ${correctAnswer}</p>
        `;

        container.appendChild(item);
    });
}

function backToDashboard(){
    window.location.href = "user-dashboard.html";
}

document.addEventListener("DOMContentLoaded", function () {

    // ✅ Only run on result page
    if (!document.getElementById("result-title")) return;

    const resultData = localStorage.getItem("examResult");

    if (!resultData) {
        window.location.href = "user-dashboard.html";
        return;
    }

    const result = JSON.parse(resultData);

    document.getElementById("result-title").innerText = result.examTitle;

    document.getElementById("score-text").innerText =
        `${result.score} / ${result.total}`;

    generateReview(result);
});

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

function addQuestion(){

    const container = document.getElementById("question-container");

    const div = document.createElement("div");

    div.className = "question-block";

    div.innerHTML = `

        <input class="question" placeholder="Question">

        <input class="option" placeholder="Option 1">
        <input class="option" placeholder="Option 2">
        <input class="option" placeholder="Option 3">
        <input class="option" placeholder="Option 4">

        <input class="answer" placeholder="Correct option (0-3)">

        <hr>
    `;

    container.appendChild(div);

}

function saveExam(){

    const title = document.getElementById("exam-title").value;
    const blocks = document.querySelectorAll(".question-block");

    const questions = [];

    blocks.forEach(block => {

        const question = block.querySelector(".question").value;

        const options = Array.from(block.querySelectorAll(".option"))
            .map(o => o.value);

        const answer = parseInt(block.querySelector(".answer").value);

        questions.push({
            question,
            options,
            answer
        });

    });

    const exam = {
        id: exams.length + 1,
        title: title,
        duration: 10,
        type: "Custom",
        questions: questions
    };

    exams.push(exam);

    // 💾 SAVE to localStorage
    localStorage.setItem("exams", JSON.stringify(exams));

    alert("Exam created!");

    window.location.href = "admin-dashboard.html";
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

function loadAdminExams(){

    const container = document.getElementById("admin-exam-list");

    container.innerHTML = "";

    exams.forEach((exam, index) => {

        const item = document.createElement("div");
        item.className = "admin-exam-item";

        item.innerHTML = `
            <div class="admin-exam-info">
                <strong>${exam.title}</strong>
                <span>${exam.questions.length} questions</span>
            </div>

            <div class="admin-exam-actions">
                <button onclick="deleteExam(${index})">Delete</button>
            </div>
        `;

        container.appendChild(item);
    });
}

function deleteExam(index){

    if (!confirm("Are you sure you want to delete this exam?")) return;

    exams.splice(index, 1);

    localStorage.setItem("exams", JSON.stringify(exams));

    loadAdminExams();
}

document.addEventListener("DOMContentLoaded", function () {

    // Admin dashboard
    if (document.getElementById("student-table-body")) {
        loadStudents();
    }

    // Manage exams page
    if (document.getElementById("admin-exam-list")) {
        loadAdminExams();
    }
});

function openViewUsers(){
    window.location.href = "view-users.html";
}

function backToUsers(){
    window.location.href = "view-users.html";
}

function loadUsers(){

    const container = document.getElementById("user-list");
    container.innerHTML = "";

    students.forEach((user, index) => {

        const div = document.createElement("div");
        div.className = "user-card";

        div.innerHTML = `
            <h4>${user.username}</h4>
            <p>Exams Taken: ${user.examsTaken}</p>
            <p>Average Score: ${user.avgScore}</p>
            <button onclick="viewUser(${index})">View Details</button>
        `;

        container.appendChild(div);
    });
}

function viewUser(index){

    localStorage.setItem("selectedUser", JSON.stringify(students[index]));

    window.location.href = "user-detail.html";
}

function loadUserDetail(){

    const data = localStorage.getItem("selectedUser");
    if (!data) {
        window.location.href = "view-users.html";
        return;
    }

    const user = JSON.parse(data);

    document.getElementById("user-name").innerText = user.username;

    document.getElementById("user-stats").innerHTML = `
        <p><strong>Exams Taken:</strong> ${user.examsTaken}</p>
        <p><strong>Average Score:</strong> ${user.avgScore}</p>
    `;

    const historyDiv = document.getElementById("user-history");
    historyDiv.innerHTML = "";

    user.history.forEach(item => {

        const div = document.createElement("div");

        div.innerHTML = `
            <p><strong>${item.exam}</strong> - ${item.score}</p>
        `;

        historyDiv.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("user-list")) {
        loadUsers();
    }

    if (document.getElementById("user-name")) {
        loadUserDetail();
    }
});




