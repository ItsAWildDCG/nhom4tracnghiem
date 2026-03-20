const express = require("express");
const router = express.Router();

const users = require("../data/users.js");
const exams = require("../data/exams.js");
const results = require("../data/results.js");
const students = require("../data/students.js");

router.get("/", (req, res) => {
    res.json(exams);
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const exam = exams.find(ex => ex.id === id);
    res.json(exam);
});

router.post("/:id/submit", (req, res) => {
    const id = parseInt(req.params.id);
    const { answers } = req.body;
    console.log(answers)

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Invalid answers" });
    }

    const userId = parseInt(req.query.userId);
    if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
    }

    const exam = exams.find(ex => ex.id === id);
    if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
    }

    let score = 0;

    const answerMap = {};
    answers.forEach(a => {
        console.log(a);
        answerMap[a.questionId] = a.selectedOption;
    });

    exam.questions.forEach(q => {
        console.log(q)
        console.log(q.id)
        console.log(answerMap[q.id]);
        console.log(q.answer);
        if (answerMap[q.id] === q.answer) {
            score++;
        }
    });

    const review = exam.questions.map(q => ({
        question: q.question,
        correct: q.answer,
        selected: answerMap[q.id] ?? null
    }));

    const newResult = {
        id: results.length + 1,
        userId,
        examId: exam.id,
        score,
        total: exam.questions.length,
        date: new Date().toISOString().split("T")[0]
    };

    results.push(newResult);

    res.json({
        score,
        examTitle: exam.title,
        total: exam.questions.length,
        review
    });
});

module.exports = router;