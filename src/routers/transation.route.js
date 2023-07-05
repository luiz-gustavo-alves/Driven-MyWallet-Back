import { getTransations } from "../controllers/transation.controller.js";
import { Router } from "express";

const transationRouter = Router();

transationRouter.post("/nova-transacao/:type", getTransations);

export default transationRouter;