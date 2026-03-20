const exams = [
{
    id: 1,
    title: "Mathematics Practice Test",
    type: "practice",
    duration: 60,
    questionCount: 2,
    questions: [
        {
            id: 0,
            question: "5 + 7 = ?",
            options: ["10","11","12","13"],
            answer: 2
        },
        {
            id: 1,
            question: "9 x 3 = ?",
            options: ["18","27","21","24"],
            answer: 1
        }
    ]
},

{
    id: 2,
    title: "Computer Science Mid-Term",
    type: "midterm",
    duration: 120,
    questionCount: 2,
    questions: [
        {
            id: 0,
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
            id: 1,
            question: "Which language runs in a browser?",
            options: ["Python","Java","C++","JavaScript"],
            answer: 3
        }
    ]
}
];

module.exports = exams;