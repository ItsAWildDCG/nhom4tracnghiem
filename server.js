const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/exams", require("./routes/exams"));
app.use("/api/results", require("./routes/results"));

app.use("/api/admin/dashboard", require("./routes/admin/dashboard"));
app.use("/api/admin/exams", require("./routes/admin/exams"));
app.use("/api/admin/students", require("./routes/admin/students"));

app.get("/api/hello", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});