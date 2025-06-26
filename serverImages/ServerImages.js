// CoreModules
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');

//Utils
const { generateRandomInteger } = require('./utils')

const app = express();
dotenv.config();
app.use(cors());

const PORT = process.env.PORT;

app.get("/api/questions", (req, res) => {
    const lang = req.query.lang;
    const categoryFileName = req.query.categoryFileName;
    const numberQuestions = parseInt(req.query.numberQuestions);
    console.log("Received request for questions:", { lang, categoryFileName, numberQuestions });

    const filePath = `./questions/${lang}/${categoryFileName}`;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
            const questions = JSON.parse(data);
            console.log("Parsed questions:", questions);
            if (!Array.isArray(questions)) {
                return res.status(400).json({ error: "Invalid questions format" });
            }
            const selectedQuestions = [];
            const totalQuestions = questions.length;

            while (selectedQuestions.length < numberQuestions && selectedQuestions.length < totalQuestions) {
                const randomIndex = generateRandomInteger(0, totalQuestions - 1);
                const alreadySelected = selectedQuestions.some(q => q.question === questions[randomIndex].question);
                if (!alreadySelected) {
                    selectedQuestions.push(questions[randomIndex]);
                }
            }
            res.json(selectedQuestions);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});