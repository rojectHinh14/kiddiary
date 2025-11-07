import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import viewEngine from "./config/viewEngine.js";
import initWebRoutes from "./route/web.js";
import dotenv from "dotenv";
import geminiRoute from "./route/geminiRoute.js";
import passport from "./config/passport.js";
import session from "express-session";
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
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
viewEngine(app);
initWebRoutes(app);

app.use("/api/gemini", geminiRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Backend is running on port " + port);
});
