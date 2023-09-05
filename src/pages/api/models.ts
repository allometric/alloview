import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';
import queryString from 'query-string';
import { Db, ObjectId } from "mongodb";
import { ModelApiResponse } from "@customTypes/model";


const fetchModels = async (db: Db, page: number, pageSize: number = 20) => {
  const query = {};
  const totalCount = await db.collection("models").countDocuments(query);

  const cursor = await db
    .collection("models")
    .find({})
    .skip(pageSize * page)
    .limit(pageSize)

  return {
    data: await cursor.toArray(),
    totalCount: totalCount
  }
};

const fetchFilteredModels = async(db: Db, tagVals: string[], page: number,
    pageSize: number = 20
  ) => {
  const query = {model_type: {$in: tagVals}};
  const totalCount = await db.collection("models").countDocuments(query);

  const cursor = await db
    .collection("models")
    .find(query)
    .skip(pageSize * page)
    .limit(pageSize)

  return {
    data: await cursor.toArray(),
    totalCount: totalCount
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;

    const client = await clientPromise;
    const db = client.db("allodata");

    const queryTags = query.tagVals as string[];
    const page = Number(query.page);

    let mongoRes;
    if(queryTags === undefined) {
      mongoRes = await fetchModels(db, page)
    } else {
      const queryTagArray = Array.isArray(queryTags) ? queryTags : [queryTags]
      mongoRes = await fetchFilteredModels(db, queryTagArray, page)
    }

    return res.json(mongoRes)
  }  catch (err) {
    console.log(err)
  }
}