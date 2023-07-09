import { getTransactions, newTransaction, deleteTransaction, getTransactionByIndex, updateTransaction } from "../controllers/transaction.controller.js";
import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validation.middleware.js";
import { transactionByIndex } from "../middlewares/transactionByIndex.middleware.js"
import { transactionSchema, indexSchema } from "../schemas/transaction.schema.js";

const transactionRouter = Router();

transactionRouter.use(authMiddleware);

transactionRouter.get("/home", getTransactions);
transactionRouter.post("/nova-transacao/:type", validateSchema(transactionSchema), newTransaction);
transactionRouter.delete("/deletar-transacao/:index", validateSchema(indexSchema), transactionByIndex, deleteTransaction);
transactionRouter.get("/editar-registro/:type/:index", validateSchema(indexSchema), transactionByIndex, getTransactionByIndex);
transactionRouter.put("/editar-registro/:type/:index", validateSchema(transactionSchema), transactionByIndex, updateTransaction);

export default transactionRouter;