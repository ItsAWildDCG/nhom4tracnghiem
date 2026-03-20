const express = require("express");
const router = express.Router();

const users = require("../../data/users.js");
const exams = require("../../data/exams.js");
const results = require("../../data/results.js");
const students = require("../../data/students.js");

router.get("/", (req, res) => {
    const userList = users.map(u => {
        const userResults = results.filter(r => r.userId === u.id);

        return {
            id: u.id,
            name: u.name,
            attempts: userResults.length
        };
    });

    res.json(userList);
});

router.get("/:id", (req, res) => {
    const userId = parseInt(req.params.id);

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const userResults = results
        .filter(r => r.userId === userId)
        .map(r => {
            const exam = exams.find(e => e.id === r.examId);

            return {
                examId: r.examId,
                examTitle: exam ? exam.title : "Unknown",
                score: r.score,
                total: r.total
            };
        });

    res.json({
        id: user.id,
        name: user.name,
        attempts: userResults.length,
        results: userResults
    });
});



module.exports = router;