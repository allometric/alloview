import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';
import queryString from 'query-string';
import { Db, ObjectId } from "mongodb";
import { ModelApiResponse } from "@customTypes/model";


const fetchModels = async (db: Db, page: number, pageSize: number = 20) => {
  const cursor = await db
    .collection("models")
    .find({})
    .skip(pageSize * page)
    .limit(pageSize)

  return cursor
};

const fetchFilteredModels = async(db: Db, tagVals: string[], page: number,
    pageSize: number = 20
  ) => {
  const cursor = await db
    .collection("models")
    .find({model_type: {$in: tagVals}})
    .skip(pageSize * page)
    .limit(pageSize)

  return cursor
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;

    const client = await clientPromise;
    const db = client.db("allodata");

    const queryTags = query.tagVals as string[];
    const page = Number(query.page);

    let cursor;
    if(queryTags === undefined) {
      cursor = await fetchModels(db, page)
    } else {
      const queryTagArray = Array.isArray(queryTags) ? queryTags : [queryTags]
      cursor = await fetchFilteredModels(db, queryTagArray, 0)
    }

    const clonedCursor = cursor.clone()

    const dataArray = await cursor.toArray();

    const dataObj = {
      data: dataArray,
      hasNext: await clonedCursor.hasNext()
    }

    return res.json(dataObj)
  }  catch (err) {
    console.log(err)
  }
}