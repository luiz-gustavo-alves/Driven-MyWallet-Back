import { getTransactions, newTransaction, deleteTransaction } from "../controllers/transaction.controller.js";
import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validation.middleware.js";
import { transactionSchema, deleteByIndexSchema } from "../schemas/transaction.schema.js";

const transactionRouter = Router();

transactionRouter.use(authMiddleware);

transactionRouter.get("/home", getTransactions);
transactionRouter.post("/nova-transacao/:type", validateSchema(transactionSchema), newTransaction);
transactionRouter.delete("/deletar-transacao/:index", validateSchema(deleteByIndexSchema), deleteTransaction);

export default transactionRouter;