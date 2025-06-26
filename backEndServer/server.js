//Modules
import express from "express";
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import cors from "cors";

//Database
import User from './database/model/user.js';
import "./database/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

app.post("/api/register", async (req, res) => {
    const { username, firstname, lastname, password } = req.body;
    console.log(`[REGISTER] Attempt - Username: ${username}, FirstName: ${firstname}, LastName: ${lastname}`);

    const userExists = await User.findOne({ username });
    if(userExists) {
        console.warn(`[REGISTER] Failed - Username '${username}' already exists`);
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        firstname,
        lastname,
        password: hashedPassword,
        categories: {
            Music: {},
            SportAndLeisure: {},
            FilmAndTV: {},
            ArtsAndLiterature: {},
            History: {},
            SocietyAndCulture: {},
            Science: {},
            Geography: {},
            FoodAndDrink: {},
            GeneralKnowledge: {}
        }
    });

    await newUser.save();
    console.log(`[REGISTER] Success - Username: ${username}`);
    res.json({ message: "Registration completed" });
})

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(`[LOGIN] Attempt - Username: ${username}`);

    const user = await User.findOne({ username });
    if (!user) {
        console.warn(`[LOGIN] Failed - Username '${username}' not found`);
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        console.warn(`[LOGIN] Failed - Invalid password for user '${username}'`);
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    console.log(`[LOGIN] Success - Username: ${username}`);
    res.json({ token });
});

app.listen(PORT, () => {
    console.log(`[SERVER] Server is running on  http://localhost:${PORT}`);
});