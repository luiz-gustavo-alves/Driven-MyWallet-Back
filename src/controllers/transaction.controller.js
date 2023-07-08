import dayjs from "dayjs";
import db from "../database/db.js";

export const getTransactions = async (req, res) => {

    try {
        const transactionDb = await db.collection("transactions").findOne({ userId: req.sessionID });
        if (transactionDb) {

            const formatTotal = (transactionDb.total.toFixed(2)).replace(".", ",");
            const recentTransactions = (transactionDb.transactions).reverse();

            const transactionList = {
                total: formatTotal,
                transactions: recentTransactions
            };

            res.send(transactionList);

        } else {
            res.send([]);
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

        const numValue = parseFloat(value.toFixed(2));
        const formatValue = (value.toFixed(2)).replace(".", ",");

        const transactionInfo = {
            value: formatValue,
            description: description,
            type: type,
            date: dayjs().locale('pt-br').format('DD/MM')
        }

        const transactionsDB = await db.collection("transactions").findOne({ userId: userDB._id });

        if (transactionsDB) {

            const updateTotal = transactionInfo.type === "entrada" ?
                (transactionsDB.total + numValue) : (transactionsDB.total - numValue);

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