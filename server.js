import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import visitorRouter from "./src/route/visitorRouter.js";
import userRouter from "./src/route/userRouter.js";


const db = process.env.BDD_URL;
const app = express();
const router = express.Router();

app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(cors());
app.use(express.static("./assets"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
router.use(visitorRouter);
router.use(userRouter);




//global route
router.get("/*", function (req, res) {
  res.redirect("/");
});


app.listen(process.env.PORT, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`connected to ${process.env.APP_URL}`);
  }
});

mongoose.connect(db)
  .then(() => console.log('Connexion réussie à la base de données'))
  .catch((err) => console.error('Erreur de connexion à la base de données', err));

// mongoose.connect(db, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("connected to database mongodb (c'est dur....)");
//   }
// });

export default router;