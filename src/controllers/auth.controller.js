import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import db from "../database/db.js";

dotenv.config();

export const signIn = async(req, res) => {

    const { email, password } = req.data;

    try {
        const userDB = await db.collection("users").findOne({ email });
        if (!userDB) {
            return res.sendStatus(404);
        }

        if (!bcrypt.compareSync(password, userDB.password)) {
            return res.sendStatus(401);
        }

        /* If session token exists, deletes token from database. */
        await db.collection("sessions").findOneAndDelete({ userId: userDB._id });

        const token = uuid();
        await db.collection("sessions").insertOne({ userId: userDB._id, token });

        res.send({ username: userDB.name, token: token });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const signUp = async (req, res) => {

    const { name, email, password } = req.data;

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