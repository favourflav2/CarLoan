import { env } from "custom-env";
env(true);
import pg from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CreateRetireGoal, RetirementGoalsBackEnd, UpdateRetireGoal, UpdateRetiretTitle } from "../../controllerTypes/retireTypes.js";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CreateHouseGoal } from "../../controllerTypes/houseTypes.js";

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
      res.status(200).json("You successfully updated your goal :)")
    } else {
      // user did not add an image
      console.log(img.length)
      res.send("hello")
    }

    //   // I need a unique Id to save my images to aws s3 ... currently Im using the date in which it was created
    //   //* However when I save it to aws it chnages the url to the url snytax ... so Im going to set my id to the url syntax before I save it as an unique id
    //   const encodedURI = encodeURIComponent(id.replace(/\s/g, ""));

    //   const params = {
    //     Bucket: process.env.BUCKET as string,
    //     Key: `${id.replace(/\s/g, "")}`,
    //     Body: base64Data,
    //     ContentType: type,
    //   };

    //   // https://datascrape.s3.amazonaws.com/Jun11%2C20245%3A52%3A28pm
    //  //  https://datascrape.s3.amazonaws.com/Jun11%252C20245%253A52%253A28pm

    //   const command = new PutObjectCommand(params);
    //   await s3.send(command);

    //   const url = `https://${process.env.BUCKET}.s3.amazonaws.com/${id.replace(/\s/g, "")}`;
    //   console.log(url);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}
