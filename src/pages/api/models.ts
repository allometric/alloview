import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("allodata");

    const models = await db
      .collection("models")
      .find({})
      .limit(10)
      .toArray()
    
    res.json(models);
  }  catch (err) {
    console.log(err)
  }
}