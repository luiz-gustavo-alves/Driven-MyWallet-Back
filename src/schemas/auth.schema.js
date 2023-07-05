import joi from "joi";

export const signUpSchema = joi.object({

    name: joi.string().regex(/^[a-zA-Z\s]*$/).required(),
    email: joi.string().required(),
    password: joi.string().min(3).required()
});

export const signInSchema = joi.object({

    email: joi.string().required(),
    password: joi.string().required(),
});