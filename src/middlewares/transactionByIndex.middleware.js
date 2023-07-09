import db from "../database/db.js";

export const transactionByIndex = async (req, res, next) => {

    let { index } = req.data;
    index = Number(index);

    try {

        const transactionDB = await db.collection("transactions").findOne({ userId: req.sessionID });
        if (!transactionDB || index > transactionDB.transactions.length - 1) {
            return res.sendStatus(403);
        }

        req.transactionDB = transactionDB;
        req.data.index = index;
        next();

    } catch (err) {
        res.status(500).send(err.message);
    }
}