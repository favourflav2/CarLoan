import { env } from "custom-env";
env(true);
import pg from "pg";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Response, Request } from "express";
import imageToBase64 from "image-to-base64";
import { AddBook, AddContentCreator, AddVideoLink, GetAllBooks, GetAllContentCreators, GetAllVideoLinksById } from "../../controllerTypes/howToInvestTypes.js";

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

export async function get_All_Content_Creators(req: GetAllContentCreators, res: Response) {
  try {
    const { page } = req.query;
    const limit = 4;

    const pageNum: number = typeof page !== "number" ? parseFloat(page) : page;

    const text = 'SELECT * FROM "contentCreator"';
    const data = await pool.query(text);

    const startIndex = (pageNum - 1) * limit;
    const endIndex = pageNum * limit;
    const result = data.rows.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.rows.length / limit);

    const paginatedData = {
      data: result,
      page: pageNum,
      limit,
      totalPages,
      totalCount: data.rows.length,
    };

    res.send(paginatedData);
  } catch (e) {
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error getting all the content creator data" });
  }
}

export async function get_All_Vidoe_Links_By_Id(req: GetAllVideoLinksById, res: Response) {
  try {
    const {creatorId} = req.body;
    const text = 'SELECT * FROM "videoLink" WHERE creator = $1 '
    const data = await pool.query(text,[creatorId])
   

    res.status(200).json(data.rows);
  } catch (e) {
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error getting the vidoe links" });
  }
}

export async function get_All_Books(req:GetAllBooks, res:Response){
  try{

    const {page} = req.query
    const limit = 10

    const pageNum:number = typeof page !== "number" ? parseFloat(page) : page;

    const startIndex = (pageNum - 1) * limit;
    const endIndex = pageNum * limit

    console.log(startIndex)

   
    const totalCountQuery = await pool.query('SELECT COUNT(*) FROM books ')
    const totalCountVal = parseFloat(totalCountQuery.rows[0].count)

    const text = 'SELECT * FROM books ORDER BY "title" LIMIT $1 OFFSET $2'


    const values = [limit,startIndex]
    const allBooks = await pool.query(text,values)

    if(typeof totalCountVal !== 'number' || totalCountVal <= 0 ) return res.status(401).json("There was an error calculating the total count for the books api. Sorry")
    

    //const text =
    console.log("page", page)
    res.status(200).json(allBooks.rows)

  }catch(e){
    console.log(e);
    console.log("message", e.message);
    res.status(400).json("There was an error getting all books" );
  }
}

// This controller is only responsable for adding new content creator ... dev use only
export async function add_Content_Creator(req: AddContentCreator, res: Response) {
  const { photo, name, instagram, twitter, about, youtube } = req.body;

  // Turn img to base 64 type
  const newImg = await imageToBase64(photo);
  const base64Data = Buffer.from(newImg.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const paramsKey = name.replace(/\s/g, "");

  const params = {
    Bucket: process.env.CONTENT_CREATOR_BUCKET as string,
    Key: paramsKey,
    Body: base64Data,
    ContentType: "jpeg",
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  const imageUrl = `https://${process.env.CONTENT_CREATOR_BUCKET}.s3.amazonaws.com/${paramsKey}`;

  // send data to database
  const text = 'INSERT INTO "contentCreator" (name, twitter, instagram, youtube, photo, about) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ';
  const values = [name, twitter, instagram, youtube, imageUrl, about];
  const creator = await pool.query(text, values);

  res.send(creator.rows[0]);

  try {
  } catch (e) {
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error adding a content creator" });
  }
}

export async function add_Video_Link(req: AddVideoLink, res: Response) {
  try {
    const { link, about, creator, title } = req.body;

    const text = 'INSERT INTO "videoLink" (link, "aboutVideoLink", creator, title) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [link, about, creator, title];

    const data = await pool.query(text, values);
    res.status(200).json(data.rows[0]);
  } catch (e) {
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error adding a video link" });
  }
}

// These controllers only responsable for adding new book ... dev use only
export async function add_Book(req:AddBook, res:Response){
  try{
    const {title, author, img, about, amazonLink} = req.body

    // Turn img to base 64 type
  const newImg = await imageToBase64(img);
  const base64Data = Buffer.from(newImg.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const paramsKey = title.replace(/\s/g, "");

  // Im going to send the book pictures to the same bucket as my content creators ... theres not going to be no overlap because all the name and titles are going to be diffrenet
  const params = {
    Bucket: process.env.CONTENT_CREATOR_BUCKET as string,
    Key: paramsKey,
    Body: base64Data,
    ContentType: "jpeg",
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  const imageUrl = `https://${process.env.CONTENT_CREATOR_BUCKET}.s3.amazonaws.com/${paramsKey}`;


   // send data to database
  const text = 'INSERT INTO books (title, author, about, "amazonLink", img, "haveRead") VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ';
  const values = [title, author, about, amazonLink, imageUrl, true];
  const book = await pool.query(text, values);

  res.status(200).json(book.rows[0])

  }catch(e){
    console.log(e);
    console.log("message", e.message);
    res.status(400).json({ msg: "There was an error adding a book" }); 
  }
}