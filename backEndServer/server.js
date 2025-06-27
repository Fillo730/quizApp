//Modules
import express from "express";
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import cors from "cors";

//Database
import User from './database/model/user.js';
import "./database/db.js";
import { use } from "react";

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

app.post("/api/save", async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) {
        console.warn('[SAVE] Failed - Missing token');
        return res.status(401).json({ error: 'Missing token' });
    }

    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);

        const user = await User.findOne({ username: decoded.username });
        if (!user) {
            console.warn(`[SAVE] Failed - User '${decoded.username}' not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        const { category, questionsNumber, correctQuestions } = req.body;
        console.log(category);
        console.log(questionsNumber);
        console.log(correctQuestions);
        if (!category || questionsNumber === undefined || correctQuestions === undefined) {
            console.warn('[SAVE] Failed - Bad request');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!user.categories.hasOwnProperty(category)) {
            console.warn(`[SAVE] Failed - Invalid category '${category}'`);
            return res.status(400).json({ error: 'Invalid category' });
        }

        user.categories[category] = {
            totalQuestions: questionsNumber,
            correctAnswers: correctQuestions
        };

        await user.save();

        console.log(`[SAVE] Success - Stats updated for '${decoded.username}' in category '${category}'`);
        res.json({ message: "Stats updated successfully" });

    } catch (err) {
        console.warn('[SAVE] Failed - Invalid token');
        return res.status(401).json({ error: 'Invalid token' });
    }
});

app.put('/api/update-profile', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    console.warn('[UPDATE_PROFILE] Failed - Missing token');
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const { username, firstname, lastname } = req.body;

    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      console.warn(`[UPDATE_PROFILE] Failed - User '${decoded.username}' not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username || user.username;
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && !existingUser._id.equals(user._id)) {
        console.warn(`[UPDATE_PROFILE] Failed - Username '${username}' already taken`);
         return res.status(400).json({ error: 'Username already taken' });
      }
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    await user.save();
    console.log(`[UPDATE_PROFILE] Success - Username: ${decoded.username}`);
    const newToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Profile updated successfully', user, token: newToken });
  } catch (err) {
    console.warn('[UPDATE_PROFILE] Failed - Invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }
});

app.get("/api/stats", async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) {
        console.warn('[STATS] Failed - Missing token');
        return res.status(401).json({ error: 'Missing token' });
    }

    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);

        const user = await User.findOne({ username: decoded.username });
        if (!user) {
            console.warn(`[STATS] Failed - User '${decoded.username}' not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            categories: user.categories
        });
        console.log(`[STATS] Success - Username: ${decoded.username}`);
  } catch {
    console.warn('[STATS] Failed - Invalid token');
    res.status(401).json({ error: 'Invalid token' });
  }
})

app.listen(PORT, () => {
    console.log(`[SERVER] Server is running on  http://localhost:${PORT}`);
});