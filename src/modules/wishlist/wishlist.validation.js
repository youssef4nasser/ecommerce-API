import Joi from "joi";

export const idValidate = Joi.object({
    product: Joi.string().hex().length(24).required()
});
