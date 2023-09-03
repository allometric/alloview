import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';
import queryString from 'query-string';
import { Db } from "mongodb";


const fetchAllModels = async (db: Db) => {
  const res=  await db
    .collection("models")
    .find({})
    .limit(20)
    .toArray()

  return res
};

const fetchFilteredModels = async(db: Db, tagVals: string[]) => {
  const res = await db
    .collection("models")
    .find({model_type: {$in: tagVals}})
    .limit(20)
    .toArray()

  return res
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const client = await clientPromise;
    const db = client.db("allodata");

    const queryTags = query.tagVals as string[];

    let models;
    if(queryTags === undefined) {
      models = await fetchAllModels(db)
    } else {
      const queryTagArray = Array.isArray(queryTags) ? queryTags : [queryTags]
      models = await fetchFilteredModels(db, queryTagArray)
    }

    console.log(models)
    
    res.json(models);
  }  catch (err) {
    console.log(err)
  }
}