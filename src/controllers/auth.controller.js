import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import db from "../database/db.js";

import { signInSchema, signUpSchema } from "../schemas/auth.schema.js";

dotenv.config();

export async function signIn(req, res) {

    const { email, password } = req.body;

    const validation = signInSchema.validate({...req.body}, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {

        const userDB = await db.collection("users").findOne({ email });

        if (!userDB) {
            return res.status(404).send("E-mail ou senha incorretos.");
        }

        if (!bcrypt.compareSync(password, userDB.password)) {
            return res.status(401).send("E-mail ou senha incorretos.");
        }

        await db.collection("sessions").findOneAndDelete({ userId: userDB._id });

        const token = uuid();
        await db.collection("sessions").insertOne({ userId: userDB._id, token });

        res.send(token);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function signUp(req, res) {

    const { name, email, password } = req.body;

    const validation = signUpSchema.validate({...req.body}, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {

        const userDB = await db.collection("users").findOne({ email });

        if (userDB) {
            return res.status(409).send("E-mail já cadastrado!");
        }

        const cryptedPassword = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
        await db.collection("users").insertOne({ name: name, email: email, password: cryptedPassword});

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}