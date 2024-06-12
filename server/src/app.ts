import morgan from "morgan";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { env } from "custom-env";
import helmet from "helmet";
import carRoutes from "./routes/carRoutes.js";
import costOfLivingRoutes from "./routes/costOfLivingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import retireRoutes from "./routes/tables/retireRoutes.js";
import allGoalRoutes from "./routes/allGoalRoutes.js";
import houseRoutes from "./routes/tables/houseRoutes.js";


env(true);

const app = express();

//* Middleware
dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get("/", (req, res) => {
  console.log("Welcome to the backend");
  res.send("Hello");
});

app.use("/carData", carRoutes);
app.use("/COL",costOfLivingRoutes)
app.use("/auth",authRoutes)
app.use("/retire", retireRoutes)
app.use("/house",houseRoutes)
app.use("/allTables",allGoalRoutes)



console.log(process.env.NODE_ENV);