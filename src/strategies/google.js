import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import "dotenv/config";
import userModel from '../model/userModel.js'
import mongoose from "mongoose";

passport.use(
    new GoogleStrategy(
    {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL,
    scope: ['email', 'profile'],
}, async (
    accessToken,
    refreshToken,
    profile,
    done
) => {
    console.log('-----------------------',profile.emails[0].value);
    console.log(accessToken);
    console.log(profile);
  //  done(null, { username: profile.displayName});
    //iiiii
    const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
    const newUser = {
      username: profile.displayName,
      email: profile.emails[0].value,
    };

    userModel.findOne({
        id: profile.id
      }).then(user => {
        if (user) {
          done(null, user);
        } else {
          new userModel(newUser)
            .save()
            .then(user => done(null, user));
        }
      });
}
)
);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
  