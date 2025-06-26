import mongoose from "mongoose";

const gameStatsSchema = new mongoose.Schema({
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  categories: {
    Music: gameStatsSchema,
    SportAndLeisure: gameStatsSchema,
    FilmAndTV: gameStatsSchema,
    ArtsAndLiterature: gameStatsSchema,
    History: gameStatsSchema,
    SocietyAndCulture: gameStatsSchema,
    Science: gameStatsSchema,
    Geography: gameStatsSchema,
    FoodAndDrink: gameStatsSchema,
    GeneralKnowledge: gameStatsSchema,
  },
});

export default mongoose.model("User", userSchema);