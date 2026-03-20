const express = require("express");
const router = express.Router();

const users = require("../../data/users.js");
const exams = require("../../data/exams.js");
const results = require("../../data/results.js");
const students = require("../../data/students.js");

router.get("/", (req, res) => {
    res.json(exams);
});

router.post("/", (req, res) => {
    const { title, duration, questions } = req.body;

    if (!title || !duration || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const newId = exams.length > 0
        ? Math.max(...exams.map(e => e.id)) + 1
        : 1;

    const newExam = {
        id: newId,
        title,
        duration,
        questions
    };

    exams.push(newExam);

    res.json({
        message: "Exam created",
        examId: newExam.id
    });
});

router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, duration, questions } = req.body;

    const exam = exams.find(e => e.id === id);

    if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
    }

    if (title) exam.title = title;
    if (duration) exam.duration = duration;
    if (questions) exam.questions = questions;

    res.json({ message: "Exam updated" });
});

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = exams.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Exam not found" });
    }

    exams.splice(index, 1);

    res.json({ message: "Exam deleted" });
});

module.exports = router;