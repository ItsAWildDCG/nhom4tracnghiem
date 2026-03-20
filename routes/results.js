const express = require("express");
const router = express.Router();

const users = require("../data/users.js");
const exams = require("../data/exams.js");
const results = require("../data/results.js");
const students = require("../data/students.js");

router.get("/me", (req, res) => {
    const userId = parseInt(req.query.userId);

    const userResults = results
        .filter(r => r.userId === userId)
        .map(r => {
            const exam = exams.find(e => e.id === r.examId);
            return {
                title: exam.title,
                score: `${r.score}/${r.total}`,
                date: r.date
            };
        });
    res.json(userResults);
});

module.exports = router;