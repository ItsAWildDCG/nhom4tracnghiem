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
    if (user.role === "admin") {
        showAdminDashboard(user.username)
    } else {
        showUserDashboard(user.username)
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

function showUserDashboard(username) {

  document.getElementById("auth-page").classList.add("hidden");
  document.getElementById("user-dashboard-page").classList.remove("hidden");

  document.getElementById("welcome-text").innerText =
    "Welcome, " + username + "!";

  loadExams();
}

function showAdminDashboard(username) {

  document.getElementById("auth-page").classList.add("hidden");
  document.getElementById("admin-dashboard-page").classList.remove("hidden");

  document.getElementById("welcome-text").innerText =
    "Welcome, " + username + "!";

}

function logout() {
  document.getElementById("admin-dashboard-page").classList.add("hidden");
  document.getElementById("user-dashboard-page").classList.add("hidden");
  document.getElementById("auth-page").classList.remove("hidden");

}

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

    currentExam = exam;
    currentQuestionIndex = 0;

    document.getElementById("user-dashboard-page").classList.add("hidden");
    document.getElementById("exam-page").classList.remove("hidden");

    startTimer(currentExam.duration);
  
    loadQuestion();
}

function startTimer(duration){

    let minutes = duration;
    timeLeft = minutes * 60;

    const timerDisplay = document.getElementById("timer");

    timerInterval = setInterval(()=>{

        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;

        sec = sec < 10 ? "0" + sec : sec;

        timerDisplay.innerText = `Time Remaining: ${min}:${sec}`;

        timeLeft--;

        if(timeLeft < 0){
            alert("Time is up!");
            finishExam();
            return;
        }

    },1000);
}

let currentExam = null;
let currentQuestionIndex = 0;

function loadQuestion(){

    const question = currentExam.questions[currentQuestionIndex];

    document.getElementById("exam-title").innerText = currentExam.title;
    document.getElementById("question-text").innerText = question.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    question.options.forEach((opt,i)=>{

        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => selectAnswer(i);

        optionsDiv.appendChild(btn);

    });

}

let score = 0;
let currentIndex = -1;

function selectAnswer(optionIndex){
    currentIndex = optionIndex;

    const buttons = document.querySelectorAll("#options button");

    buttons.forEach(btn => {
        btn.classList.remove("selected");
    });

    buttons[optionIndex].classList.add("selected");
}

function nextQuestion(){
  
    const question = currentExam.questions[currentQuestionIndex];
    alert(currentIndex + " " + question.answer);
    if(currentIndex === question.answer){
        score++;
    }

    currentIndex = -1;
    currentQuestionIndex++;

    if(currentQuestionIndex >= currentExam.questions.length){
        finishExam();
        return;
        
    }

    loadQuestion();

}

function finishExam(){
    alert("Exam finished! Score: " + score);

        document.getElementById("exam-page").classList.add("hidden");
        document.getElementById("user-dashboard-page").classList.remove("hidden");

        score = 0;
        clearInterval(timerInterval);
}

function generateReview(){

    const container = document.getElementById("review-list");

    container.innerHTML = "";

    currentExam.questions.forEach((q, i) => {

        const userAnswerIndex = userAnswers[i];
        const correctIndex = q.answer;

        const userAnswer = userAnswerIndex !== undefined
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

function showResults(score){

    document.getElementById("quiz-page").classList.add("hidden");
    document.getElementById("result-page").classList.remove("hidden");

    document.getElementById("result-title").innerText = currentExam.title;

    document.getElementById("score-text").innerText =
        `${score} / ${currentExam.questions.length}`;

    generateReview();
}













