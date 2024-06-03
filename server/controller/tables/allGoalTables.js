import { env } from "custom-env";
env(true);
import pg from "pg";
const { Pool, types } = pg;


const pool = new Pool({
    connectionString: process.env.POSTGRES_URI_AUTH,
  });
  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

export async function get_All_Tables(req,res){
    try{
        const retireText = "SELECT * FROM retire"
        const retireTable = await pool.query(retireText)

        res.send(retireTable.rows)


    }catch(e){
        console.log(e);
        res.status(400).json({ msg: e.message });
    }
}