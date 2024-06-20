import { env } from "custom-env";
env(true);
import pg from "pg";
import { Request, Response } from "express";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CreateCarGoal, DeleteCarGoal, UpdateCarGoal, UpdateCarGoalImg, UpdateCarName } from "../../controllerTypes/carGoalTypes.js";

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

export async function update_Car_Goal(req: UpdateCarGoal, res: Response) {
  try {
    const { id, goal } = req.body;
    const { price, downPayment, interest, mileage, term, extraPayment, showInputs, date } = goal;
    const userId = req.userId;

    const checkValues = [price, downPayment, interest, mileage, term, extraPayment].every((item) => typeof item === "number");

    if (!checkValues) return res.status(400).json({ msg: "One of your values from the inputs is not a number" });
    if (!date) return res.status(400).json({ msg: "Date value is null" });

    const text = 'UPDATE car SET price = $1, "downPayment" = $2, interest = $3, mileage = $4, term = $5, "extraPayment" = $6 WHERE id = $7 AND creator = $8 RETURNING * ';
    const values = [price, downPayment, interest, mileage, term, extraPayment, id, userId]
    await pool.query(text,values)

    res.status(200).json("You successfully updated your goal :)");
  
  } catch (e) {
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error updating your goal" });
  }
}

export async function update_Car_Name(req:UpdateCarName, res:Response){
  try{
    const {name, id, modal} = req.body
    const userId = req.userId

    if(!id) return res.status(400).json({msg:"The title you are trying to edit did not have an id. Either delete this goal and make a new one or wait a sec."})

    const text = 'UPDATE car SET name = $1, modal = $2 WHERE id = $3 AND creator = $4'
    const values = [name, modal, id, userId]
    await pool.query(text,values)

    res.status(200).json("You successfully updated your goal :)");

  }catch(e){
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error updating your car name and modal" });
  }
}

export async function delete_Car_Goal(req:DeleteCarGoal, res:Response){
  try{
    const {itemUUID, dateAsAWSId, img} = req.query
    const userId = req.userId

    if(!img || img.length <= 0){

      // Only delete from database
      const text = "DELETE FROM car WHERE creator = $1 AND id = $2";
      const values = [userId, itemUUID];

      // delete from db
      await pool.query(text, values);

      return res.status(200).json("Deleted Goal");

    }else{

      // Delete from aws s3 and from database
      if (!itemUUID || !dateAsAWSId) return res.status(400).json({ msg: "Item is not able to be deleted, the id sent to server is wrong" });

      //* This will be my unique id for my aws ... no post will ever have the same date (formatted with dayjs) and userId
      const paramsKey = dateAsAWSId.replace(/\s/g, "") + `${userId}`;

      const params = {
        Bucket: process.env.BUCKET as string,
        Key: paramsKey,
      };

      const command = new DeleteObjectCommand(params);

      const text = 'DELETE FROM car WHERE creator = $1 AND id = $2'
      const values = [userId, itemUUID]

      // this deletes img from aws s3
      await s3.send(command);
      // delete from db
      await pool.query(text, values);

      return res.status(200).json("Deleted Goal");
    }

  }catch(e){
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error deleting this goal" });
  }
}

export async function update_Car_Goal_Img(req:UpdateCarGoalImg, res:Response){
try{
  const {id, goal, img} = req.body
  const userId = req.userId

  if (!img || img.length <= 0) return res.status(400).json({msg:"Unable to update image, server received an empty value"});

    if (!goal.date) return res.status(400).json({msg:"The date id required for updating the image was not received to the server"});

    if (!id || id.length <= 0) return res.status(400).json({msg:"The id required for updating the image was not received to the server"});

    if(img.length){

      // Ensure that you POST a base64 data to your server.
      // Let's assume the variable "base64" is one.
      const base64Data = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64");

      // Getting the file type, ie: jpeg, png or gif
      const imgType = img.split(";")[0].split("/")[1];

      // Removes white spaces for id ... id is the date in which the goal was created
      //* This will be my unique id for my aws ... no post will ever have the same date and userId
      const paramsKey = goal.date.replace(/\s/g, "") + `${userId}`;

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

      // Update Img from database
      const text = "UPDATE car SET img = $1 WHERE id = $2 AND creator = $3";
      const values = [imageUrl, id, userId];
      await pool.query(text, values);

      res.status(200).json("You successfully updated your image :)");
    }
  }catch(e){
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error deleting this goal" });
  }
}
