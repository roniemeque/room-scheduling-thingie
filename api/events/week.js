import { getCollection } from "../../lib/db";

module.exports = async (req, res) => {
  const collection = await getCollection("events");

  const events = await collection.find({}).toArray();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.status(200).json({ events });
};
