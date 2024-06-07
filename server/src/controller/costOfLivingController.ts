import { env } from "custom-env";
env(true);
import pg from "pg";
const { Pool, types } = pg;

types.setTypeParser(pg.types.builtins.NUMERIC, (value) => {
  return parseFloat(value);
});

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI_COST_OF_LIVING,
});
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export async function addCostOfLivingIndexTable(req:any, res:any) {
  try {
    // data is going to be the array of col indexes on the post requst
    const data = req.body;

    for (const items of data) {
      const text = "INSERT INTO costOfLiving (rank,state,conversion,grocery,housing,utilities,transportation,health,misc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
      const values = [items.Rank, items.State, items.Conversion, items.Grocery, items.Housing, items.Utilities, items.Transportation, items.Health, items["Misc."]];

      // Making sure the data has a rank we then push into table
      if (items.Rank) {
        await pool.query(text, values);
      }
    }

    res.send("Saved Data To Database");
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function getCostOfLivingData(req:any,res:any){
    try{
        const text = 'SELECT * FROM costOfLiving'
        const data = await pool.query(text)
        res.status(200).json(data.rows)

    }catch(e){
        console.log(e);
        res.status(400).json({ msg: e.message });
    }
}

