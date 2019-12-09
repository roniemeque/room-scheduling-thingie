import { getCollection } from "../../../lib/db";
import { ObjectID } from "mongodb";

export default async (req, res) => {
  const {
    query: { eventId }
  } = req;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);

  try {
    const collection = await getCollection("events");

    await collection.deleteOne({
      _id: new ObjectID(eventId)
    });

    // fetching the updated events list
    const events = await collection.find({}).toArray();

    return res.status(200).json({
      events
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
