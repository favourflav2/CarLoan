import { env } from "custom-env";
env(true);
import pg from "pg";
import { CreateRetireGoal, RetirementGoalsBackEnd, UpdateRetireGoal, UpdateRetiretTitle } from "../../controllerTypes/retireTypes.js";
import { Request, Response } from "express";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CreateCarGoal } from "../../controllerTypes/carGoalTypes.js";

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

export async function create_Car_Goal(req: CreateCarGoal, res: Response) {
  try {
    const { creator, data } = req.body;
    const { id, price, downPayment, interest, term, mileage, extraPayment, date, name, img, showInputs, modal, type } = data;
    const userId = req.userId;

    if (userId !== creator) return res.status(400).json({ msg: "Your token is not athenticated" });

    const checkValues = [price, downPayment, interest, term, mileage, extraPayment].every((item) => typeof item === "number");

    if (!checkValues) return res.status(400).json({ msg: "One of the inputs you sent to the server is not a number" });

    if (img.length) {
      // If user has added an img ... img will have a length
      // Ensure that you POST a base64 data to your server.
      // Let's assume the variable "base64" is one.
      const base64Data = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64");

      // Getting the file type, ie: jpeg, png or gif
      const imgType = img.split(";")[0].split("/")[1];

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
      const textWithImg =
        'INSERT INTO car (creator, "name", "price", "mileage", "downPayment", interest, term, img, modal, type, "extraPayment", "showInputs", "date") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';
      const valuesWIthImg = [userId, name, price, mileage, downPayment, interest, term, imageUrl, modal, "Car", extraPayment, showInputs, id];

      await pool.query(textWithImg, valuesWIthImg);
      res.status(200).json("You successfully created your goal :)");
    } else {
      // User did not add an img ... img will be empty string

      const textWithNoImg =
        'INSERT INTO car (creator, "name", "price", "mileage", "downPayment", interest, term, img, modal, type, "extraPayment", "showInputs", "date") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';
      const valuesWIthNoImg = [userId, name, price, mileage, downPayment, interest, term, "", modal, "Car", extraPayment, showInputs, id];

      await pool.query(textWithNoImg, valuesWIthNoImg);
      res.status(200).json("You successfully created your goal :)");
    }
  } catch (e) {
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error creating your goal" });
  }
}
