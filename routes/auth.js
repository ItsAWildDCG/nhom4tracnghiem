const express = require("express");
const router = express.Router();

const users = require("../data/users.js");
const exams = require("../data/exams.js");
const results = require("../data/results.js");
const students = require("../data/students.js");

router.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
        return res.status(400).json({
            message: "Username already exists"
        });
    }

    const newUser = {
        id: users.length + 1,
        username,
        email,
        password,
        role: "user"
    };

    users.push(newUser);

    res.json({
        message: "User registered successfully",
        userId: newUser.id
    });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const token = "fake-token-" + user.id;

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});
module.exports = router;