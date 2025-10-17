import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import viewEngine from "./config/viewEngine.js";
import initWebRoutes from "./route/web.js";
import dotenv from "dotenv";
const path = require("path");
dotenv.config();

const app = express();

//Dùng CORS để cookie hoạt động đúng
app.use(
  cors({
    origin: process.env.URL_REACT || "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
viewEngine(app);
initWebRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Backend is running on port " + port);
});
