import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./database/db.js";

/* Import Routers */
import authRouter from "./routers/auth.route.js";
import transactionRouter from "./routers/transaction.route.js";

dotenv.config();
connectToDatabase();

/* API configuration*/
const app = express();
app.use(express.json());
app.use(cors());

/* Endpoints */
app.use([authRouter, transactionRouter]);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));