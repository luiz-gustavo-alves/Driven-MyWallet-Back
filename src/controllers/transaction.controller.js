import dayjs from "dayjs";
import db from "../database/db.js";

import { transactionSchema } from "../schemas/transaction.schema.js";

export async function getTransactions(req, res) {

    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {

        const sessionDB = await db.collection("sessions").findOne({ token });

        if (!sessionDB) {
            return res.sendStatus(401);
        }

        const transactionDb = await db.collection("transactions").findOne({ userId: sessionDB.userId });

        console.log(transactionDb);

        const transactionsList = {
            username: transactionDb.name,
            transactions: (transactionDb.transactions).reverse()
        };

        res.send(transactionsList);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function newTransaction(req, res) {
    
    const { value, description } = req.body;
    const { type } = req.params;
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    const validationBody = transactionSchema.validate({...req.body, type}, { abortEarly: false });

    if (validationBody.error) {
        const errors = validationBody.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {

        const sessionDB = await db.collection("sessions").findOne({ token });

        if (!sessionDB) {
            return res.sendStatus(401);
        }

        const userDB = await db.collection("users").findOne({ _id: sessionDB.userId });

        if (!userDB) {
            return res.sendStatus(401);
        }

        const transactionInfo = {

            value: parseFloat(value.toFixed(2)),
            description: description,
            type: type,
            date: dayjs().locale('pt-br').format('DD/MM')
        }

        const transactionsDB = await db.collection("transactions").findOne({ userId: userDB._id }); 

        if (transactionsDB) {

            await db.collection("transactions").findOneAndUpdate(
                { userId: userDB._id },
                { $push: { transactions: transactionInfo }
            });

        } else {

            await db.collection("transactions").insertOne({ 
                userId: userDB._id,
                name: userDB.name,
                transactions: [transactionInfo]
            });
        }

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}