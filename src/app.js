import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./database/db.js";

/* Import Routers */
import authRouter from "./routers/auth.route.js";

dotenv.config()

connectToDatabase();

/* API configuration*/
const app = express();
app.use(express.json());
app.use(cors());

/* Endpoints */
app.use([authRouter]);

app.listen(process.env.PORT);