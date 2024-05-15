import morgan from "morgan";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { env } from "custom-env";
import helmet from "helmet";
import carRoutes from "./routes/carRoutes.js";
import costOfLivingRoutes from "./routes/costOfLivingRoutes.js";
import { helpFormatCarName } from "./utils/helpFormatCarName.js";


env(true);

const app = express();

//* Middleware
dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json({ limit: "30mb", extended: true }));
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



console.log(process.env.NODE_ENV);


