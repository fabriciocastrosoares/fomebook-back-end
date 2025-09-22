import joi from "joi";

export const postSchema = joi.object({
  pictureUrl: joi.string().uri().required(),
  description: joi.string().min(10).max(200).required()
});