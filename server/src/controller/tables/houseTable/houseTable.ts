import { env } from "custom-env";
env(true);
import pg from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CreateRetireGoal, RetirementGoalsBackEnd, UpdateRetireGoal, UpdateRetiretTitle } from "../../controllerTypes/retireTypes.js";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CreateHouseGoal, UpdateHouseGoal } from "../../controllerTypes/houseTypes.js";

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

const s3 = new S3Client({
  region: process.env.REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export async function create_House_Goal(req: CreateHouseGoal, res: Response) {
  try {
    const { data, creator } = req.body;
    // id sent from front end is just a date formatted with dayjs
    const {
      id,
      streetAddress,
      price,
      downPayment,
      interest,
      term,
      extraPayment,
      img,
      propertyTax,
      insurance,
      mortgageInsurance,
      appreciation,
      opportunityCostRate,
      maintenance,
      rent,
      showInputs,
      showOppCostInputs,
      showTax,
      type,
    } = data;
    const userId = req.userId

    // Making sure all my input typeof values are numbers
    const checkValues = [
      price,
      downPayment,
      interest,
      term,
      extraPayment,
      propertyTax,
      insurance,
      mortgageInsurance,
      appreciation,
      opportunityCostRate,
      maintenance,
      rent,
    ].every((item) => typeof item === "number");

    if (!checkValues) return res.status(400).json("One of the inputs you typed is not a valid number");


    // If a user added a picture
    if (img.length) {
      // Ensure that you POST a base64 data to your server.
      // Let's assume the variable "base64" is one.
      const base64Data = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64");

      // Getting the file type, ie: jpeg, png or gif
      const imgType = img.split(";")[0].split("/")[1];

      // Removes white spaces for id ... id is the date in which the goal was created
      //* This will be my unique id for my aws ... no post will ever have the same date and userId
      const paramsKey = id.replace(/\s/g, "") + `${creator}`;

      const params = {
        Bucket: process.env.BUCKET as string,
        Key: paramsKey,
        Body: base64Data,
        ContentType: imgType,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      // Img is sent to aws ... we then save the url with the Key to our database

      const imageUrl = `https://${process.env.BUCKET}.s3.amazonaws.com/${paramsKey}`;

      // send data to database
      const textWithImg = 'INSERT INTO house (creator, type, "streetAddress", "price", "downPayment", "interest", "term", "extraPayment", img, "propertyTax", insurance, "mortgageInsurance", "appreciation", "opportunityCostRate", maintenance, "showTax", "showInputs", rent, "showOppCostInputs", date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)'
      const valuesWIthImg = [userId, type, streetAddress, price, downPayment, interest, term, extraPayment, imageUrl, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, showTax, showInputs, rent, showOppCostInputs, id]
      await pool.query(textWithImg,valuesWIthImg)
      res.status(200).json("You successfully created your goal :)")
    } else {
      // user did not add an image
      const textWithNoImg = 'INSERT INTO house (creator, type, "streetAddress", "price", "downPayment", "interest", "term", "extraPayment", img, "propertyTax", insurance, "mortgageInsurance", "appreciation", "opportunityCostRate", maintenance, "showTax", "showInputs", rent, "showOppCostInputs", date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)'
      const valuesWIthNoImg = [userId, type, streetAddress, price, downPayment, interest, term, extraPayment, "", propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, showTax, showInputs, rent, showOppCostInputs, id]

      await pool.query(textWithNoImg, valuesWIthNoImg)
      res.status(200).json("You successfully created your goal :)")
    }

  
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function update_House_Goal(req:UpdateHouseGoal, res:Response){
  try{
    const {id, inputData} = req.body
    const {price,downPayment,interest,term, extraPayment, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, rent, showInputs, showOppCostInputs, date} = inputData
    const userId = req.userId

    // making sure all number values are of typeof numbers
    const checkValues = [price, downPayment, interest, term, extraPayment, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, rent].every((item => typeof item === 'number'))

    if(!checkValues) return res.status(400).json("One of the inputs you typed is not a valid number");
    if(!date) return res.status(400).json({msg:"Date value is null"})

    const text = 'UPDATE house SET price = $1, "downPayment" = $2, interest = $3, term = $4, "extraPayment" = $5, "propertyTax" = $6, insurance = $7, "mortgageInsurance" = $8, appreciation = $9, "opportunityCostRate" = $10, maintenance = $11, "showInputs" = $12, "showOppCostInputs" = $13 WHERE id = $14 AND creator = $15 RETURNING * '
    const values = [price,downPayment,interest,term, extraPayment, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, showInputs, showOppCostInputs, id, userId]
    await pool.query(text,values)

    res.status(200).json("You successfully updated your goal :)")

  }catch(e){
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}
