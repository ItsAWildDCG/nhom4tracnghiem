const express = require("express");
const router = express.Router();

const users = require("../../data/users.js");
const exams = require("../../data/exams.js");
const results = require("../../data/results.js");
const students = require("../../data/students.js");

router.get("/", (req, res) => {
    const data = {
        students: 34,
        exams: 6,
        attempts: 123,
        avgScore: 6.7
    };
    console.log(data);
    res.json(data);
});

module.exports = router;