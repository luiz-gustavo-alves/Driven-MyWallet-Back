import dayjs from "dayjs";
import db from "../database/db.js";

export const getTransactions = async (req, res) => {

    try {
        const transactionDB = await db.collection("transactions").findOne({ userId: req.sessionID });

        if (transactionDB) {

            const transactionList = {
                total: transactionDB.total,
                transactions: (transactionDB.transactions).reverse()
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

            const total = transactionInfo.type === "entrada" ? transactionInfo.value : - transactionInfo.value;

            await db.collection("transactions").insertOne({ 
                userId: userDB._id,
                total: total,
                transactions: [transactionInfo]
            });
        }
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const deleteTransaction = async (req, res) => {

    let { index } = req.data;
    index = Number(index);

    try {

        const transactionDB = await db.collection("transactions").findOne({ userId: req.sessionID });
        if (!transactionDB || index > transactionDB.transactions.length) {
            return res.sendStatus(403);
        }

        const transactionInfo = transactionDB.transactions[index];

        const updateTotal = transactionInfo.type === "entrada" ?
            (transactionDB.total - transactionInfo.value) : (transactionDB.total + transactionInfo.value);

        /* Delete array element by index */
        await db.collection("transactions").updateOne({ userId: req.sessionID},
        [{ $set:
            { transactions: {
                $concatArrays: [ 
                    { $slice: [ "$transactions", index ]}, 
                    { $slice: [ "$transactions", { $add: [1, index]}, { $size:"$transactions" }]}
                ]
        }}}]);

        /* If last transaction is removed, deletes this document from database transactions collection */
        if (transactionDB.transactions.length === 1) {
            await db.collection("transactions").deleteOne({ userId: req.sessionID });

        } else {
            await db.collection("transactions").updateOne({ userId: req.sessionID }, { $set : { total: updateTotal }});
        }

        res.sendStatus(204);

    } catch (err) {
        res.status(500).send(err.message);
    }
}