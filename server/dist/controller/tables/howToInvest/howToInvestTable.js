import { env } from "custom-env";
env(true);
import pg from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import imageToBase64 from "image-to-base64";
import sharp from "sharp";
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
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});
export async function get_All_Content_Creators(req, res) {
    try {
        const { page } = req.query;
        const limit = 4;
        const pageNum = typeof page !== "number" ? parseFloat(page) : page;
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
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error getting all the content creator data" });
    }
}
export async function get_All_Vidoe_Links_By_Id(req, res) {
    try {
        const { creatorId } = req.body;
        const text = 'SELECT * FROM "videoLink" WHERE creator = $1 ';
        const data = await pool.query(text, [creatorId]);
        res.status(200).json(data.rows);
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error getting the vidoe links" });
    }
}
export async function get_All_Books(req, res) {
    try {
        const { page } = req.query;
        const limit = 10;
        // Page number sent from frontend
        const pageNum = typeof page !== "number" ? parseFloat(page) : page;
        const startIndex = (pageNum - 1) * limit;
        // Dont need endIndex becasue I am using limit with postgresql
        // const endIndex = pageNum * limit
        // These 2 values return the total amount of books in my database
        const totalCountQuery = await pool.query('SELECT COUNT(*) FROM books ');
        const totalCountVal = parseFloat(totalCountQuery.rows[0].count);
        const text = 'SELECT * FROM books ORDER BY "title" DESC LIMIT $1 OFFSET $2';
        const values = [limit, startIndex];
        const allBooks = await pool.query(text, values);
        // If the total amount of books from my database is less than or equal to 0 || not a number ... we return an error
        if (typeof totalCountVal !== 'number' || totalCountVal <= 0)
            return res.status(401).json("There was an error calculating the total count for the books api. Sorry");
        const totalPages = Math.ceil(totalCountVal / limit);
        const paginatedData = {
            data: allBooks.rows,
            page: pageNum,
            limit,
            totalPages,
            totalCount: totalCountVal
        };
        res.status(200).json(paginatedData);
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json("There was an error getting all books");
    }
}
// ------------------------------------ Dev Functions for createing the data -------------------------------------
// This controller is only responsable for adding new content creator ... dev use only
export async function add_Content_Creator(req, res) {
    const { photo, name, instagram, twitter, about, youtube } = req.body;
    // Turn img to base 64 type
    const newImg = await imageToBase64(photo);
    const base64Data = Buffer.from(newImg.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const resizeBase64Img = await sharp(base64Data)
        .resize(700, 700, {
        fit: 'fill'
    })
        .jpeg()
        .toBuffer();
    const paramsKey = name.replace(/\s/g, "");
    const params = {
        Bucket: process.env.CONTENT_CREATOR_BUCKET,
        Key: paramsKey,
        Body: resizeBase64Img,
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
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error adding a content creator" });
    }
}
export async function add_Video_Link(req, res) {
    try {
        const { link, about, creator, title } = req.body;
        const text = 'INSERT INTO "videoLink" (link, "aboutVideoLink", creator, title) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [link, about, creator, title];
        const data = await pool.query(text, values);
        res.status(200).json(data.rows[0]);
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error adding a video link" });
    }
}
// These controllers only responsable for adding new book ... dev use only
export async function add_Book(req, res) {
    try {
        const { title, author, img, about, amazonLink, haveRead } = req.body;
        // Turn img to base 64 type
        const newImg = await imageToBase64(img);
        const base64Data = Buffer.from(newImg.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const resizeBase64Img = await sharp(base64Data)
            .resize(400, 500, {
            fit: 'fill'
        })
            .jpeg()
            .toBuffer();
        const paramsKey = title.replace(/\s/g, "");
        // Im going to send the book pictures to the same bucket as my content creators ... theres not going to be no overlap because all the name and titles are going to be diffrenet
        const params = {
            Bucket: process.env.CONTENT_CREATOR_BUCKET,
            Key: paramsKey,
            Body: resizeBase64Img,
            ContentType: "jpeg",
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const imageUrl = `https://${process.env.CONTENT_CREATOR_BUCKET}.s3.amazonaws.com/${paramsKey}`;
        // send data to database
        const text = 'INSERT INTO books (title, author, about, "amazonLink", img, "haveRead") VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ';
        const values = [title, author, about, amazonLink, imageUrl, haveRead];
        const book = await pool.query(text, values);
        res.status(200).json(book.rows[0]);
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error adding a book" });
    }
}
// This controller is only responsable for adding new content creator ... dev use only
export async function update_Book_Img(req, res) {
    try {
        const { title, img } = req.body;
        // Turn img to base 64 type
        const newImg = await imageToBase64(img);
        const base64Data = Buffer.from(newImg.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const resizeBase64Img = await sharp(base64Data)
            .resize(400, 500, {
            fit: 'fill'
        })
            .toBuffer();
        const paramsKey = title.replace(/\s/g, "");
        // Im going to send the book pictures to the same bucket as my content creators ... theres not going to be no overlap because all the name and titles are going to be diffrenet
        const params = {
            Bucket: process.env.CONTENT_CREATOR_BUCKET,
            Key: paramsKey,
            Body: resizeBase64Img,
            ContentType: "jpeg",
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const imageUrl = `https://${process.env.CONTENT_CREATOR_BUCKET}.s3.amazonaws.com/${paramsKey}`;
        // send data to database
        const text = 'UPDATE books SET img = $1 WHERE title = $2 RETURNING * ';
        const values = [imageUrl, title];
        const book = await pool.query(text, values);
        res.status(200).json(book.rows[0]);
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error adding a book" });
    }
}
// This controller is only responsable for adding new content creator ... dev use only
export async function update_Content_Creator_Img(req, res) {
    try {
        const { name, photo } = req.body;
        // Turn img to base 64 type
        const newImg = await imageToBase64(photo);
        const base64Data = Buffer.from(newImg.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const resizeBase64Img = await sharp(base64Data)
            .resize(700, 700, {
            fit: 'fill'
        })
            .jpeg()
            .toBuffer();
        const paramsKey = name.replace(/\s/g, "");
        const params = {
            Bucket: process.env.CONTENT_CREATOR_BUCKET,
            Key: paramsKey,
            Body: resizeBase64Img,
            ContentType: "jpeg",
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        res.send("Done");
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error adding updating content creator image" });
    }
}
