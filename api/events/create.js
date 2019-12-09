import Joi from "@hapi/joi";
import { getCollection } from "../../lib/db";

const fidelidadeJoiSchema = Joi.object({
  owner: Joi.string().required(),
  title: Joi.string(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required()
});

export default async (req, res) => {
  const { query } = req;

  const {
    error: validationError,
    value: validatedBody
  } = fidelidadeJoiSchema.validate({ ...query });

  if (validationError) return res.status(422).json({ validationError });

  try {
    const collection = await getCollection("events");

    const { insertedId } = await collection.insertOne({
      ...validatedBody,
      date: new Date()
    });

    // fetching the updated events list
    const events = await collection.find({}).toArray();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    return res.status(200).json({
      insertedId,
      events
    });
  } catch (error) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    return res.status(500).json({ error });
  }
};
