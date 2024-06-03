import { env } from "custom-env";
env(true);
import pg from "pg";
const { Pool, types } = pg;

types.setTypeParser(pg.types.builtins.NUMERIC, (value) => {
  return parseFloat(value);
});

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI_AUTH,
});
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export async function create_Retire_Table(req, res) {
  try {
    console.log(req.body);
    res.send("hello");
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function insert_Fake_Retire_Data(req, res) {
  try {
    const text =
      "INSERT INTO retire (creator, type, current_age, retire_age, life_expectancy, savings, monthly_contribution, budget, pre_rate, post_rate, inflation, title, show_inputs) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *";
    const values = ["31b38404-5e13-489d-98f2-1762786ee587", "Retirement", 22, 67, 90, 2000, 500, 20000, 7, 2, 2, "Fake Data 1", false];
   

    

    const data = await pool.query(text,values)
    res.status(200).json(data.rows)
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}
