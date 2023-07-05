import { transationSchema } from "../schemas/transation.schema.js";
import dayjs from "dayjs";
import db from "../database/db.js";

export async function getTransations(req, res) {
    
    const { value, description } = req.body;
    const { type } = req.params;
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    const validationBody = transationSchema.validate({...req.body, type}, { abortEarly: false });

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

        const transationInfo = {
            value: value,
            description: description,
            date: dayjs().locale('pt-br').format('DD/MM')
        }

        const transationsDB = await db.collection("transations").findOne({ userId: userDB._id }); 

        if (!transationsDB) {

            await db.collection("transations").insertOne({ userId: userDB._id, transations: [transationInfo] });

        } else {

            await db.collection("transations").findOneAndUpdate(
            { userId: userDB._id },
            { $push: { transations: transationInfo }
            });
        }

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}