import joi from "joi";

export const transactionSchema = joi.object({

    value: joi.number().greater(0).required(),
    description: joi.string().required(),
    type: joi.string().valid("entrada", "saida").required()
});