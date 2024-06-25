import { env } from "custom-env";
env(true);
import pg from "pg";
import dayjs from "dayjs";
const { Pool, types } = pg;
const pool = new Pool({
    connectionString: process.env.POSTGRES_URI_AUTH,
});
pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});
export async function get_All_Tables(req, res) {
    try {
        let { page, limit } = req.query;
        const userId = req.userId;
        if (!page || !limit)
            return res.status(404).json({ msg: "Please provide a page and limit" });
        const newPage = parseFloat(page);
        const newLimit = parseFloat(limit);
        // Grab All Retire Data
        const retireText = "SELECT * FROM retire WHERE creator = $1";
        const retireTable = await pool.query(retireText, [userId]);
        // Grab All House Data
        const houseText = "SELECT * FROM house WHERE creator = $1";
        const houseTable = await pool.query(houseText, [userId]);
        // Grab All Car Data
        const carText = "SELECT * FROM car WHERE creator = $1";
        const carTable = await pool.query(carText, [userId]);
        // concating all the data and sorting by newset goal first
        const concatData = retireTable.rows.concat(houseTable.rows).concat(carTable.rows).sort((a, b) => {
            return dayjs(b.date).unix() - dayjs(a.date).unix();
        });
        // Paginate Data
        if (typeof newPage !== "number" || typeof newLimit !== "number")
            return res.status(404).json({ msg: "The page number or limit query are not numbers" });
        const startIndex = (newPage - 1) * newLimit;
        const endIndex = newPage * newLimit;
        const result = concatData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(concatData.length / newLimit);
        const paginatedData = {
            data: result,
            page: newPage,
            limit: newLimit,
            totalPages,
            totalCount: concatData.length,
        };
        res.status(200).json(paginatedData);
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ msg: e.message });
    }
}
