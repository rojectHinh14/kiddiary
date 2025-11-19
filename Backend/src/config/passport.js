import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github2";
import db from "../models/index.js";
import dotenv from "dotenv";
dotenv.config();

// Mật khẩu placeholder cho OAuth
const OAUTH_PLACEHOLDER_PASSWORD = "OAUTH_USER_PLACEHOLDER_SAFE_TO_DELETE";

// --- Serialize ---
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ✨ Hàm chuẩn hóa email ✨
const normalizeEmail = (email) => {
  if (!email) return null;
  return email.trim().toLowerCase();
};

/* ---------------------------------------------------
   GOOGLE STRATEGY
--------------------------------------------------- */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = normalizeEmail(profile.emails[0].value);

        let user =
          (await db.User.findOne({ where: { googleId: profile.id } })) ||
          (await db.User.findOne({ where: { email } }));

        if (!user) {
          user = await db.User.create({
            googleId: profile.id,
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            email,
            password: OAUTH_PLACEHOLDER_PASSWORD,
            image: profile.photos?.[0]?.value,
            roleId: "R4",
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

/* ---------------------------------------------------
   FACEBOOK STRATEGY
--------------------------------------------------- */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = normalizeEmail(
          profile.emails?.[0]?.value || `${profile.id}@facebook.com`
        );

        let user =
          (await db.User.findOne({ where: { facebookId: profile.id } })) ||
          (await db.User.findOne({ where: { email } }));

        if (!user) {
          user = await db.User.create({
            facebookId: profile.id,
            firstName:
              profile.name?.givenName || profile.displayName || "FacebookUser",
            lastName: profile.name?.familyName || "",
            email,
            password: OAUTH_PLACEHOLDER_PASSWORD,
            image: profile.photos?.[0]?.value,
            roleId: "R4",
          });
        } else if (!user.facebookId) {
          user.facebookId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

/* ---------------------------------------------------
   GITHUB STRATEGY
--------------------------------------------------- */
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = normalizeEmail(
          profile.emails?.[0]?.value || `${profile.username}@github.com`
        );

        let user =
          (await db.User.findOne({ where: { githubId: profile.id } })) ||
          (await db.User.findOne({ where: { email } }));

        if (!user) {
          user = await db.User.create({
            githubId: profile.id,
            firstName: profile.displayName || profile.username || "GithubUser",
            lastName: "",
            email,
            password: OAUTH_PLACEHOLDER_PASSWORD,
            image: profile.photos?.[0]?.value,
            roleId: "R4",
          });
        } else if (!user.githubId) {
          user.githubId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
