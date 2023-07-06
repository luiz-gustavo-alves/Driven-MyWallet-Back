import { getTransactions, newTransaction } from "../controllers/transaction.controller.js";
import { Router } from "express";

const transactionRouter = Router();

transactionRouter.get("/home", getTransactions);
transactionRouter.post("/nova-transacao/:type", newTransaction);

export default transactionRouter;