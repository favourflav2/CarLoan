import pg from "pg";
const { Pool } = pg;
import { env } from "custom-env";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
env(true);

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI_AUTH,
});
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    const loginText = "SELECT * FROM users WHERE email = $1";
    const loginEmail = [email];
    const checkLoginForEmail = await pool.query(loginText, loginEmail);

    // If theres a user with the same email return error
    if (checkLoginForEmail?.rows?.length) {
      return res.status(404).json({ msg: "This email is already being used" });
    }

    // if theres no match we push data into login table and users table
    const hash = await bcrypt.hash(password, 10);
    const text = "INSERT INTO login (hash,email) VALUES ($1,$2) RETURNING *";
    const values = [hash, email];
    await pool.query(text, values);

    // Once password has been hashed we push data into users table
    const userText = "INSERT INTO users (name,email,joined) VALUES ($1, $2, $3) RETURNING *";
    const userValues = [name, email, new Date()];
    const user = await pool.query(userText, userValues);

    // Token
    const token = jwt.sign({ email: email, id: user?.rows[0].id }, process.env.SECRET, { expiresIn: "1d" });

    // Send Token and User to frontend
    res.status(200).json({ userObj: user.rows[0], token });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function logIn(req, res){
  try{
    const { email, password } = req.body;
  
    const loginCheck = 'SELECT * FROM login WHERE email = $1';
    const loginValue = [email]
    const loginTable = await pool.query(loginCheck, loginValue)

    if(!loginTable.rows[0]){
      return res.status(400).json({msg:"There is no users with that email"})
    }

    // If the email from the frontend matches the one in our login table we check if the passwords are the same
    const isMatch = await bcrypt.compare(password, loginTable.rows[0].hash)

    if(!isMatch){
      return res.status(400).json({msg:"Passwords do not match"})
    }

    const text = "SELECT * FROM users WHERE email = $1"
    const values = [email]
    const user = await pool.query(text,values)
    const token = jwt.sign({email:email, id:user.rows[0].id}, process.env.SECRET, {expiresIn:"1d"})

    // Send Token and User to frontend
    res.status(200).json({ userObj: user.rows[0], token });

  }catch(e){
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}
