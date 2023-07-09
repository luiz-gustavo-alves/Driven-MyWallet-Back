import joi from "joi";

export const transactionSchema = joi.object({

    value: joi.number().greater(0).less(1000000000).required(),
    description: joi.string().required(),
    type: joi.string().valid("entrada", "saida").required(),
    index: joi.number().integer().min(0)
});

export const indexSchema = joi.object({

    index: joi.number().integer().min(0).required(),
    type: joi.string().valid("entrada", "saida")
})