import { env } from "custom-env";
import { Request, Response, NextFunction } from "express";
env(true);
import pg from "pg";
import { IGetUserAuthInfoRequest } from "../../middleware/authMiddleware.js";
const { Pool, types } = pg;

interface RequestBody extends IGetUserAuthInfoRequest {
  query: {
    page: string;
    limit: string;
  };
}

interface DeleteFromALlTables extends IGetUserAuthInfoRequest {
query:{
  type: "Retirement" | "Car" | "House",
  id:string;
}
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI_AUTH,
});
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export async function get_All_Tables(req: RequestBody, res: Response) {
  try {
    let { page, limit } = req.query;
    const userId = req.userId;

    if (!page || !limit) return res.status(404).json({ msg: "Please provide a page and limit" });
    const newPage = parseFloat(page);
    const newLimit = parseFloat(limit);

    const retireText = "SELECT * FROM retire WHERE creator = $1";
    const retireTable = await pool.query(retireText, [userId]);

    // Paginate Data
    if (typeof newPage !== "number" || typeof newLimit !== "number")
      return res.status(404).json({ msg: "The page number or limit query are not numbers" });

    const startIndex = (newPage - 1) * newLimit;
    const endIndex = newPage * newLimit;
    const result = retireTable.rows.slice(startIndex, endIndex);
    const totalPages = Math.ceil(retireTable.rows.length / newLimit);

    const paginatedData = {
      data: result,
      page: newPage,
      limit: newLimit,
      totalPages,
      totalCount: retireTable.rows.length,
    };

    res.status(200).json(paginatedData);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function delete_From_All_Tables(req: DeleteFromALlTables, res: Response) {
  try {
    const { type, id } = req.query;
    const userId = req.userId;

    if (type !== "Retirement" && type !== "Car" && type !== "House") return res.status(404).json({ msg: "Type of goal needed to delete is wrong" });
    if (!id) return res.status(404).json({ msg: "Theres no user id provided" });

    const text = "DELETE FROM retire WHERE creator = $1 AND type = $2 AND id = $3";
    const values = [userId, type, id];
    await pool.query(text, values);
    res.send("Deleted goal");
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}
