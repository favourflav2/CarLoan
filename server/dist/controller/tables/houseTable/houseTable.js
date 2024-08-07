import { env } from "custom-env";
env(true);
import pg from "pg";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
export async function create_House_Goal(req, res) {
    try {
        const { data, creator } = req.body;
        // id sent from front end is just a date formatted with dayjs
        const { id, streetAddress, price, downPayment, interest, term, extraPayment, img, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, rent, showInputs, showOppCostInputs, showTax, type, } = data;
        const userId = req.userId;
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
        if (!checkValues)
            return res.status(400).json({ msg: "One of the inputs you typed is not a valid number" });
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
                Bucket: process.env.BUCKET,
                Key: paramsKey,
                Body: base64Data,
                ContentType: imgType,
            };
            const command = new PutObjectCommand(params);
            await s3.send(command);
            // Img is sent to aws ... we then save the url with the Key to our database
            const imageUrl = `https://${process.env.BUCKET}.s3.amazonaws.com/${paramsKey}`;
            // send data to database
            const textWithImg = 'INSERT INTO house (creator, type, "streetAddress", "price", "downPayment", "interest", "term", "extraPayment", img, "propertyTax", insurance, "mortgageInsurance", "appreciation", "opportunityCostRate", maintenance, "showTax", "showInputs", rent, "showOppCostInputs", date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *';
            const valuesWIthImg = [
                userId,
                type,
                streetAddress,
                price,
                downPayment,
                interest,
                term,
                extraPayment,
                imageUrl,
                propertyTax,
                insurance,
                mortgageInsurance,
                appreciation,
                opportunityCostRate,
                maintenance,
                showTax,
                showInputs,
                rent,
                showOppCostInputs,
                id,
            ];
            const obj = await pool.query(textWithImg, valuesWIthImg);
            res.status(200).json(obj.rows[0]);
        }
        else {
            // user did not add an image
            const textWithNoImg = 'INSERT INTO house (creator, type, "streetAddress", "price", "downPayment", "interest", "term", "extraPayment", img, "propertyTax", insurance, "mortgageInsurance", "appreciation", "opportunityCostRate", maintenance, "showTax", "showInputs", rent, "showOppCostInputs", date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *';
            const valuesWIthNoImg = [
                userId,
                type,
                streetAddress,
                price,
                downPayment,
                interest,
                term,
                extraPayment,
                "",
                propertyTax,
                insurance,
                mortgageInsurance,
                appreciation,
                opportunityCostRate,
                maintenance,
                showTax,
                showInputs,
                rent,
                showOppCostInputs,
                id,
            ];
            const objNoImg = await pool.query(textWithNoImg, valuesWIthNoImg);
            res.status(200).json(objNoImg.rows[0]);
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ msg: e.message });
    }
}
export async function update_House_Goal(req, res) {
    try {
        const { id, inputData } = req.body;
        const { price, downPayment, interest, term, extraPayment, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, rent, showInputs, showOppCostInputs, date, } = inputData;
        const userId = req.userId;
        // making sure all number values are of typeof numbers
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
        if (!checkValues)
            return res.status(400).json({ msg: "One of the inputs you typed is not a valid number" });
        if (!date)
            return res.status(400).json({ msg: "Date value is null" });
        const text = 'UPDATE house SET price = $1, "downPayment" = $2, interest = $3, term = $4, "extraPayment" = $5, "propertyTax" = $6, insurance = $7, "mortgageInsurance" = $8, appreciation = $9, "opportunityCostRate" = $10, maintenance = $11, "showInputs" = $12, "showOppCostInputs" = $13 WHERE id = $14 AND creator = $15 RETURNING * ';
        const values = [
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
            showInputs,
            showOppCostInputs,
            id,
            userId,
        ];
        await pool.query(text, values);
        res.status(200).json("You successfully updated your goal :)");
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ msg: e.message });
    }
}
export async function delete_House_Goal(req, res) {
    try {
        const { itemUUID, dateAsAWSId, img } = req.query;
        const userId = req.userId;
        if (!img || img.length <= 0) {
            // If theres no img theres no need to delete img from aws
            const text = "DELETE FROM house WHERE creator = $1 AND id = $2";
            const values = [userId, itemUUID];
            // delete from db
            await pool.query(text, values);
            return res.status(200).json("Deleted Goal");
        }
        else {
            // This means we have an img and we need to delete it from my aws and database
            if (!itemUUID || !dateAsAWSId)
                return res.status(400).json({ msg: "Item is not able to be deleted, the id sent to server is wrong" });
            //* This will be my unique id for my aws ... no post will ever have the same date (formatted with dayjs) and userId
            const paramsKey = dateAsAWSId.replace(/\s/g, "") + `${userId}`;
            const params = {
                Bucket: process.env.BUCKET,
                Key: paramsKey,
            };
            const command = new DeleteObjectCommand(params);
            const text = "DELETE FROM house WHERE creator = $1 AND id = $2";
            const values = [userId, itemUUID];
            // this deletes img from aws s3
            await s3.send(command);
            // delete from db
            await pool.query(text, values);
            return res.status(200).json("Deleted Goal");
        }
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error deleting this goal" });
    }
}
export async function update_House_Goal_Opp_Cost(req, res) {
    try {
        const { creator, goal, id } = req.body;
        const { propertyTax, appreciation, opportunityCostRate, maintenance, rent, showInputs, showOppCostInputs, date } = goal;
        const userId = req.userId;
        if (creator !== userId)
            return res.status(400).json({ msg: "The user id being sent to the server is not authenticated" });
        // making sure all number values are of typeof numbers
        const checkValues = [propertyTax, appreciation, opportunityCostRate, maintenance, rent].every((item) => typeof item === "number");
        if (!checkValues)
            return res.status(400).json({ msg: "One of the inputs you typed is not a valid number" });
        if (!date)
            return res.status(400).json({ msg: "Date value is null" });
        const text = 'UPDATE house SET "propertyTax" = $1, "appreciation" = $2, "opportunityCostRate" = $3, maintenance = $4, "rent" = $5, "showInputs" = $6, "showOppCostInputs" = $7 WHERE creator = $8 AND id = $9 ';
        const values = [propertyTax, appreciation, opportunityCostRate, maintenance, rent, showInputs, showOppCostInputs, creator, id];
        await pool.query(text, values);
        res.send("Updated Opp Cost");
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an updating opportunity cost inputs" });
    }
}
export async function update_House_Goal_Img(req, res) {
    try {
        const { id, goal, img } = req.body;
        const userId = req.userId;
        if (!img || img.length <= 0)
            return res.status(400).json({ msg: "Unable to update image, server received an empty value" });
        if (!goal.date)
            return res.status(400).json({ msg: "The date id required for updating the image was not received to the server" });
        if (!id || id.length <= 0)
            return res.status(400).json({ msg: "The id required for updating the image was not received to the server" });
        if (img.length) {
            // Ensure that you POST a base64 data to your server.
            // Let's assume the variable "base64" is one.
            const base64Data = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64");
            // Getting the file type, ie: jpeg, png or gif
            const imgType = img.split(";")[0].split("/")[1];
            // Removes white spaces for id ... id is the date in which the goal was created
            //* This will be my unique id for my aws ... no post will ever have the same date and userId
            const paramsKey = goal.date.replace(/\s/g, "") + `${userId}`;
            const params = {
                Bucket: process.env.BUCKET,
                Key: paramsKey,
                Body: base64Data,
                ContentType: imgType,
            };
            const command = new PutObjectCommand(params);
            await s3.send(command);
            // Img is sent to aws ... we then save the url with the Key to our database
            const imageUrl = `https://${process.env.BUCKET}.s3.amazonaws.com/${paramsKey}`;
            // Update Img from database
            const text = "UPDATE house SET img = $1 WHERE id = $2 AND creator = $3";
            const values = [imageUrl, id, userId];
            await pool.query(text, values);
            res.status(200).json("You successfully updated your image :)");
        }
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error updating your image" });
    }
}
export async function update_House_Goal_Address(req, res) {
    try {
        const { id, newAddress } = req.body;
        const userId = req.userId;
        const text = 'UPDATE house SET "streetAddress" = $1 WHERE id = $2 and creator = $3 ';
        const values = [newAddress, id, userId];
        await pool.query(text, values);
        res.status(200).json("You successfully updated your address:)");
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error updating your address" });
    }
}
export async function hide_And_Show_Inputs(req, res) {
    try {
        const { id, inputs } = req.body;
        const userId = req.userId;
        const text = 'UPDATE house SET "showInputs" = $1 WHERE id = $2 AND creator = $3 ';
        const values = [inputs, id, userId];
        await pool.query(text, values);
        res.status(200).json("Show/Hide input success");
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error hiding and showing your inputs" });
    }
}
export async function hide_And_Show_Opp_Cost(req, res) {
    try {
        const { id, oppCostInputs } = req.body;
        const userId = req.userId;
        const text = 'UPDATE house SET "showOppCostInputs" = $1 WHERE id = $2 AND creator = $3 ';
        const values = [oppCostInputs, id, userId];
        await pool.query(text, values);
        res.status(200).json("Show/Hide opp cost input success");
    }
    catch (e) {
        console.log(e);
        console.log("message", e.message);
        res.status(400).json({ msg: "There was an error hiding and showing your opp cost inputs" });
    }
}
