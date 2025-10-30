import joi from "joi";


export const createCommentSchema = joi.object({
  text: joi.string().min(1).max(500).required()
});