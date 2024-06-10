import { env } from "custom-env";
env(true);
import pg from "pg";
import { CreateRetireGoal, RetirementGoalsBackEnd, UpdateRetireGoal } from "../../controllerTypes/retireTypes.js";
import { Request, Response } from "express";


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

export async function create_Retire_Goal(req:CreateRetireGoal, res:Response) {
  try {
    const { data, creator } = req.body;
    const { type, retireAge, lifeExpectancy, currentAge, budget, preRate, postRate, inflation, monthlyContribution, savings, title, showInputs } =
      data;

    // Loops over object to make sure all my values that need to be numbers are numbers
    const checkObjValues = Object.keys(data).every((key) => {
      const value = data[key as keyof RetirementGoalsBackEnd];

      if (key !== "id" && key !== "type" && key !== "showInputs" && key !== "title" && key !== "creator" && key !== "date") {
        if (typeof value !== "number") {
          return false;
        }
      }

      return true;
    });

    if (!checkObjValues) return res.status(404).json({ msg: "One of your values are of type string and is not a number" });
    if (!creator) return res.status(404).json({ msg: "We did not recieve user id for authentication" });

    // Now after checking all the values we can start inserting inro tables
    const text =
      `INSERT INTO retire (creator, type, "currentAge", "retireAge", "lifeExpectancy", savings, "monthlyContribution", budget, "preRate", "postRate", inflation, title, "showInputs", date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
    const values = [creator, type, currentAge, retireAge, lifeExpectancy, savings, monthlyContribution, budget, preRate, postRate, inflation, title, showInputs, new Date()]
    await pool.query(text, values);

    res.status(200).json("added new goal")

  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function update_Retire_Table(req:UpdateRetireGoal,res:Response){
  try{
    const {type, inputData, id} = req.body
    const {currentAge, retireAge, lifeExpectancy, savings,monthlyContribution, budget, preRate, postRate, inflation, creator} = inputData

    // checking values ... making sure they are of type number
    const checkValues = [currentAge, retireAge, lifeExpectancy, savings,monthlyContribution, budget, preRate, postRate, inflation].every(item => typeof item === 'number')

    if(!checkValues) return res.status(400).json({msg:"There was an error, one of the values being sent to server is not a number. Please make sure you have entered number values"})

    const text = 'UPDATE retire SET "currentAge" = $1, "retireAge" = $2, "lifeExpectancy" = $3, savings = $4, "monthlyContribution" = $5, budget = $6, "preRate" = $7, "postRate" = $8, inflation = $9 WHERE creator = $10 AND id = $11 RETURNING *'
    const values = [currentAge, retireAge, lifeExpectancy,
      savings, monthlyContribution,
      budget,preRate, postRate, inflation,
      creator,id
    ]
    await pool.query(text,values)

    res.status(200).json("You successfully updated your goal :)")

  }catch(e){
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}


// Insert fake data into retire table
export async function insert_Fake_Retire_Data(req:any, res:any) {
  try {
    const date = new Date()
    const text =
      "INSERT INTO retire (creator, type, current_age, retire_age, life_expectancy, savings, monthly_contribution, budget, pre_rate, post_rate, inflation, title, show_inputs, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *";

    for (let i = 0; i <= 10; i++) {
      let value = 20;
      const values = ["31b38404-5e13-489d-98f2-1762786ee587", "Retirement", 22, 67, 90, 2000, 500, 20000, 7, 2, 2, `Fake Data ${value + i}`, false, date];
      await pool.query(text, values);
    }

    const data = await pool.query("SELECT * FROM retire");
    res.status(200).json(data.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}
