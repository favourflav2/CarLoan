import pg from "pg";
const { Pool } = pg;
import { env } from "custom-env";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import NodeMailer from "nodemailer";
//import schedule from "node-schedule";
import { Request, Response } from "express";
import { SignUpReq, LoginReq, ForgotPassword, Reset_Password, CheckOtp } from "./controllerTypes/authTypes.js";

env(true);

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI_AUTH,
});
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});






export async function signUp(req:SignUpReq, res:Response) {
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
    const token = jwt.sign({ email: email, id: user?.rows[0].id }, process.env.SECRET as string, { expiresIn: "1d" });

    // Send Token and User to frontend
    res.status(200).json({ userObj: user.rows[0], token });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}



export async function logIn(req:LoginReq, res:Response) {
  try {
    const { email, password } = req.body;

    const loginCheck = "SELECT * FROM login WHERE email = $1";
    const loginValue = [email];
    const loginTable = await pool.query(loginCheck, loginValue);

    if (!loginTable.rows[0]) {
      return res.status(400).json({ msg: "There is no users with that email" });
    }

    // If the email from the frontend matches the one in our login table we check if the passwords are the same
    const isMatch = await bcrypt.compare(password, loginTable.rows[0].hash);

    if (!isMatch) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const text = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const user = await pool.query(text, values);
    const token = jwt.sign({ email: email, id: user.rows[0].id }, process.env.SECRET as string, { expiresIn: "1d" });

    // Send Token and User to frontend
    res.status(200).json({ userObj: user.rows[0], token });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}



export async function forgot_Password(req:ForgotPassword, res:Response) {
  try {
    const { email } = req.body;

    const loginCheck = "SELECT * FROM login WHERE email = $1";
    const loginValue = [email];
    const loginTable = await pool.query(loginCheck, loginValue);

    if (!loginTable.rows[0]) {
      return res.status(400).json({ msg: "There is no users with that email" });
    }

    // otp number that will be sent to the users email
    const otpVal = parseInt(otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false }));

    // This expier takes the current time/date the request was made
    //* Then we add a 1 min timer on the code
    const otpExpier = new Date();
    otpExpier.setMinutes(otpExpier.getMinutes() + 1);

    // Set otp code and otp expire
    const otpText = "UPDATE login SET otp = $1, otpexpire = $2 WHERE email = $3 RETURNING *";
    const otpValues = [otpVal, otpExpier, email];
    await pool.query(otpText, otpValues);

    const transporter = NodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.BUISNESS_EMAIL,
        pass: process.env.BUISNESS_PASSWORD,
      },
    });

    const mailOptions = {
      from: `${process.env.BUISNESS_EMAIL}`,
      to: email,
      subject: "Password reset OTP",
      text: `Your OTP (It will expire after 1 min) : ${otpVal}`,
    };

     // Token
     //* Sending token to frontend so I can privatize the reset password page
     const token = jwt.sign({ email: email }, process.env.SECRET as string, { expiresIn: "65s" });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json({ msg: "There was an error sending the otp code to your email" });
      } else {
        res.status(200).json({msg:"Your OTP was sent to your email",token});
      }
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}



export async function check_Otp_Value(req:CheckOtp,res:Response){
  try{
    
    const {code} = req.body

    const text = 'SELECT * FROM login WHERE otp = $1 AND otpexpire > NOW()'
    const values = [code]
    const data = await pool.query(text,values)

    
    if(data.rows[0]){
      const token = jwt.sign({ email: data.rows[0].email }, process.env.SECRET as string, { expiresIn: "10m" });
      res.status(200).json({msg:"Your OTP was correct, you will now be able to change your password",token});
    }else{
      res.status(400).json({ msg: "Invalid or expired OTP" });
    }
   
  }catch(e){
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}



export async function reset_Password(req:Reset_Password,res:Response){
  try{
    const userEmail = req.resetUserEmail
    const {password} = req.body

    if(!userEmail) return res.status(400).json({msg:"Not authorized, your session has expired"})
    
      const logInText = "SELECT * FROM login WHERE email = $1"
      const loginValues = [userEmail]
      const loginTable = await pool.query(logInText,loginValues)

      

      if(loginTable.rows[0]){
        const hashedPassword = loginTable.rows[0].hash

        // if new password is equal to the password already saved in table we return an error
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if(isMatch) return res.status(400).json({msg:"This password is not different from your current password"})

        // if the password doesnt match the previous password we then set password to new password ... and set otp to null
        const hash = await bcrypt.hash(password, 10);
        const updateText = "UPDATE login SET hash = $1, otp = $2, otpexpire = $3 WHERE email = $4 RETURNING *"
        const updateValues = [hash,null,null,userEmail]
         await pool.query(updateText,updateValues)

        return res.status(200).json("Your password was updated")
      }
      

  }catch(e){
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export function practiceToken(req:Request, res:Response) {
  try {
    const decode = jwt.verify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNodWt3YWdvbjFAZ21haWwuY29tIiwiaWF0IjoxNzE3MTQ1MDcyLCJleHAiOjE3MTcxNDUxMzd9.mvwhdi1gEZHAKOpeGlE161hbK501nxeFdO7bS1XqZsc",
      process.env.SECRET as string
    );
    res.send(decode);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}


