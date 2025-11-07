import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github2";
import db from "../models/index.js";
import dotenv from "dotenv";
dotenv.config();

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

// ✅ GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await db.User.findOne({ where: { email } });

        if (!user) {
          user = await db.User.create({
            firstName: profile.name.givenName || "",
            lastName: profile.name.familyName || "",
            email,
            password: "", // Không cần password
            image: profile.photos?.[0]?.value,
            roleId: "R4",
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// ✅ FACEBOOK
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
        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        let user = await db.User.findOne({ where: { email } });

        if (!user) {
          user = await db.User.create({
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            email,
            password: "",
            image: profile.photos?.[0]?.value,
            roleId: "R4",
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// ✅ GITHUB
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
        const email =
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : `${profile.username}@github.com`;

        let user = await db.User.findOne({ where: { email } });

        if (!user) {
          user = await db.User.create({
            firstName: profile.displayName || profile.username,
            lastName: "",
            email,
            password: "",
            image: profile.photos?.[0]?.value,
            roleId: "R4",
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
