import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController.js";
import mediaController from "../controllers/mediaController.js";
import albumController from "../controllers/albumController.js";
import childController from "../controllers/childController.js";
import searchController from "../controllers/searchController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import passport from "../config/passport.js";
import { generateToken } from "../helpers/generateToken.js";
let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/about", homeController.getHomePage);
  router.post("/api/login", userController.handleLogin);
  router.post("/api/register", userController.handleRegister);
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      const token = generateToken(req.user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });
      res.redirect("http://localhost:5173/home");
    }
  );

  router.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );
  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
      const token = generateToken(req.user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.redirect("http://localhost:5173/home");
    }
  );

  router.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );
  router.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    (req, res) => {
      const token = generateToken(req.user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.redirect("http://localhost:5173/home");
    }
  );

  //api nào cần token thì thêm token vào route như ví dụ:
  //router.get("/getAllUsers", verifyToken, userController.getAllUsers);

  //user
  router.get("/api/user/profile", verifyToken, userController.getUserProfile);
  router.put("/api/users/:id", verifyToken, userController.updateUser);
  //media
  router.post("/api/media/upload", verifyToken, mediaController.uploadMedia);
  router.get("/api/media", verifyToken, mediaController.getAllMediaByUser);
  router.delete("/api/media/:id", verifyToken, mediaController.deleteMedia);
  router.get("/api/media/search", verifyToken, mediaController.searchByAiTags);
  //album
  router.post("/api/albums", verifyToken, albumController.createAlbum);
  router.get("/api/albums", verifyToken, albumController.getAllAlbumsByUser);

  //search
  router.get("/api/search", verifyToken, searchController.searchMedia);

  //add media to album
  router.post(
    "/api/albums/:albumId/media",
    verifyToken,
    albumController.addMediaToAlbum
  );
  //view album
  router.get("/api/albums/:albumId", verifyToken, albumController.getAlbumById);
  router.delete(
    "/api/albums/:albumId/media/:mediaId",
    verifyToken,
    albumController.removeMediaFromAlbum
  );

  //child
  router.post("/api/children", verifyToken, childController.addChild);
  router.get("/api/children", verifyToken, childController.getChildrenByUser);
  router.put("/api/children/:id", verifyToken, childController.updateChild);
  router.delete("/api/children/:id", verifyToken, childController.deleteChild);
  router.get(
    "/api/children/:childId/vaccines",
    verifyToken,
    childController.getVaccinesByChild
  );
  router.get(
    "/api/children/:childId/vaccines/:vaccineId",
    verifyToken,
    childController.getChildVaccineDetail
  );
  router.put(
    "/api/children/:childId/vaccines/:vaccineId",
    verifyToken,
    childController.updateChildVaccineStatus
  );
  router.get(
    "/api/vaccines/injected",
    verifyToken,
    childController.getInjectedVaccines
  );
  router.get(
    "/api/children/:childId/history",
    verifyToken,
    childController.getChildHistory
  );
  // child history
router.post("/api/children/:childId/history", verifyToken, childController.createChildHistory);
router.get("/api/children/:childId/history/:historyId", verifyToken, childController.getChildHistoryDetail);
router.put("/api/children/:childId/history/:historyId", verifyToken, childController.updateChildHistory);
router.delete("/api/children/:childId/history/:historyId", verifyToken, childController.deleteChildHistory);

// child milk log
router.get("/api/children/:childId/milk-logs",verifyToken, childController.getChildMilkLogs);
router.post("/api/children/:childId/milk-logs",verifyToken, childController.createChildMilkLog);
router.put(
  "/api/children/:childId/milk-logs/:milkLogId",verifyToken,
  childController.updateChildMilkLog
);
router.delete(
  "/api/children/:childId/milk-logs/:milkLogId",verifyToken,
  childController.deleteChildMilkLog
);



  return app.use("/", router);
};



module.exports = initWebRoutes;
