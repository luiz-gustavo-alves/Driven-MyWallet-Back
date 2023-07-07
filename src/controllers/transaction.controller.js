import dayjs from "dayjs";
import db from "../database/db.js";

export const getTransactions = async (req, res) => {

    try {

        const transactionDb = await db.collection("transactions").findOne({ userId: req.sessionID });
        
        if (transactionDb) {

            const transactionList = {
                total: transactionDb.total,
                transactions: (transactionDb.transactions).reverse()
            };

            res.send(transactionList);

        } else {
            res.send({});
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const newTransaction = async (req, res) => {
    
    const { value, description, type } = req.data;

    try {

        const userDB = await db.collection("users").findOne({ _id: req.sessionID });

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

            const updateTotal = transactionInfo.type === "entrada" ?
                (transactionsDB.total + transactionInfo.value) : (transactionsDB.total - transactionInfo.value);

            await db.collection("transactions").updateOne(
                { userId: userDB._id },
                { $set: { total: updateTotal }, $push: { transactions: transactionInfo } }
            );

        } else {

            await db.collection("transactions").insertOne({ 
                userId: userDB._id,
                total: transactionInfo.value,
                transactions: [transactionInfo]
            });
        }

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}