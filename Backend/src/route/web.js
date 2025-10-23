import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController.js";
import mediaController from "../controllers/mediaController.js";
import albumController from "../controllers/albumController.js";
import { verifyToken } from "../middleware/verifyToken.js";
let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/about", homeController.getHomePage);
  router.post("/api/login", userController.handleLogin);
  router.post("/api/register", userController.handleRegister);

  //api nào cần token thì thêm token vào route như ví dụ:
  //router.get("/getAllUsers", verifyToken, userController.getAllUsers);

  //user
  router.get("/api/user/profile", verifyToken, userController.getUserProfile);
  router.put("/api/users/:id", verifyToken, userController.updateUser);
  //media
  router.post("/api/media/upload", verifyToken, mediaController.uploadMedia);
  router.get("/api/media", verifyToken, mediaController.getAllMediaByUser);
  //album
  router.post("/api/albums", verifyToken, albumController.createAlbum);
  router.get("/api/albums", verifyToken, albumController.getAllAlbumsByUser);
  //add media to album
  router.post(
    "/api/albums/:albumId/media",
    verifyToken,
    albumController.addMediaToAlbum
  );
  //view album
  router.get("/api/albums/:albumId", verifyToken, albumController.getAlbumById);

  return app.use("/", router);
};

module.exports = initWebRoutes;
