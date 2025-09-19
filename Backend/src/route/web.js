import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController.js";

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/about", homeController.getHomePage);
  router.post("/api/login", userController.handleLogin);
  router.post("/api/register", userController.handleRegister);

  return app.use("/", router);
};

module.exports = initWebRoutes;
