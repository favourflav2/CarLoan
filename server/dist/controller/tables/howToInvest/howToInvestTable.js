import { env } from "custom-env";
env(true);
import pg from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import imageToBase64 from "image-to-base64";
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
// This controller is only responsable for adding new content creator ... dev use only
export async function add_Content_Creator(req, res) {
    const { photo, name, instagram, twitter, about, youtube } = req.body;
    // Turn img to base 64 type
    const newImg = await imageToBase64(photo);
    const base64Data = Buffer.from(newImg.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const paramsKey = name.replace(/\s/g, "");
    const params = {
        Bucket: process.env.CONTENT_CREATOR_BUCKET,
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
        console.log(req.body);
        res.send("hello");
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error adding a book" });
    }
}
