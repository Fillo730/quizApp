import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

function checkAuth(MissingTokenMessage, InvalidTokenMessage) {
    return function (req, res, next) {
        const auth = req.headers.authorization;
        if (!auth) {
            console.warn(MissingTokenMessage);
            return res.status(401).json({ error: "Missing token" });
        }
        try{
            const token = auth.split(" ")[1];
            const decoded = jwt.verify(token, SECRET_KEY);
            req.username = decoded.username;
            next();
        }
        catch(err) {
            console.warn(InvalidTokenMessage);
            res.status(401).json({ error: "Invalid token" });
        }
    }
}

export default checkAuth;