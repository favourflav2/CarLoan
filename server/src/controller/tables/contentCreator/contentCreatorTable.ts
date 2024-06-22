import { env } from "custom-env";
env(true);
import pg from "pg";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Response } from "express";
import imageToBase64 from 'image-to-base64'
import { AddContentCreator } from "../../controllerTypes/contentCreatorTypes.js";

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

// This controller is only responsable for adding new content creator ... dev use only
export async function add_Content_Creator(req: AddContentCreator, res: Response) {
    const {photo, name, instagram, twitter, about, youtube} = req.body

    // Turn img to base 64 type
    const newImg = await imageToBase64(photo)
    const base64Data = Buffer.from(newImg.replace(/^data:image\/\w+;base64,/, ""), "base64");
    
    const paramsKey = name.replace(/\s/g, "")

    const params = {
        Bucket: process.env.CONTENT_CREATOR_BUCKET as string,
        Key: paramsKey,
        Body: base64Data,
        ContentType: 'jpeg',
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const imageUrl = `https://${process.env.CONTENT_CREATOR_BUCKET}.s3.amazonaws.com/${paramsKey}`;
    
      // send data to database
      const text = 'INSERT INTO "contentCreator" (name, twitter, instagram, youtube, photo, about) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * '
      const values = [name, twitter, instagram, youtube, imageUrl, about]
      const creator = await pool.query(text,values)

      res.send(creator.rows[0])

  try {
  } catch (e) {
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error adding a content creator" });
  }
}


