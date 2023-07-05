import { getTransactions, newTransation } from "../controllers/transation.controller.js";
import { Router } from "express";

const transationRouter = Router();

transationRouter.get("/home", getTransactions);
transationRouter.post("/nova-transacao/:type", newTransation);

export default transationRouter;