import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.post("/api/register", (req, res) => {
    const { username, firstname, lastname, password } = req.body;
    console.log(`[REGISTER] Attempt - Username: ${username}, FirstName: ${firstname}, LastName: ${lastname}`);
})

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`[LOGIN] Attempt - Username: ${username}`);
})

app.listen(PORT, () => {
    console.log(`[SERVER] Server is running on  http://localhost:${PORT}`);
});