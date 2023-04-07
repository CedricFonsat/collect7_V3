import { Router } from "express";
import 'dotenv/config'
import userController from "../controller/userController.js";
import collectionModel from "../model/collectionModel.js";
import userModel from "../model/userModel.js";
import cardModel from "../model/cardModel.js";
import bodyParser from "body-parser";
import { check, validationResult } from "express-validator";
import { createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";
import newsletter from "../service/newsletter.js";


const visitorRouter = Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const ERROR_LOGIN = "There was an error, your identifiers not match";
const ERROR_REGISTER_USERNAME = 'Username must be longer than 3 characters';
const ERROR_REGISTER_EMAIL = 'Email is not valid';


/* HOME */

visitorRouter.post("/", async (req, res) => {
  try{
       //newsletter recup mail
   const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'fonsat.nodemailer@gmail.com',
        pass: 'dlclhbrybfcawlgi'
    }
})

const mailOptions = {
    from: 'fonsat.nodemailer@gmail.com',
    to: req.body.email,
    subject: 'Newsletter - Collect7',
    html: newsletter
}

transporter.sendMail(mailOptions, (error, info)=>{
    if (error) {
        console.log(error);
        res.send('error')
    }else{
        console.log('Email sent: '+info.res);
        res.redirect('/#newsletter')
    }
})

//end
  } catch (error) {
    res.send(error);
  }
})

visitorRouter.get("/", async (req, res) => {
  try {
    let cardsCount = await cardModel.find(req.body).count();
    let collectionsCount = await collectionModel.find(req.body).count();
    let bestUser = await userModel.find(req.body).limit(10);
    let cardDiscovery = await cardModel.find(req.body).limit(5);
    let collections = await collectionModel.find(req.body).limit(4);
    let bestCard = await cardModel.find(req.body).limit(1); 
    let usersCount = await userModel.find(req.body).count();
   // let cards = await cardModel.find({ users: { $in: users.map(user => user.id) } });

   //Transaction calcule start
   let cardsVisible = await cardModel.find({ifAvalaible: 1}).count();

   console.log(cardsVisible);
   //Transaction calcule end

    res.render("site/index.html.twig", {
      cardsCount: cardsCount,
      usersCount: usersCount,
      collectionsCount: collectionsCount,
      bestUser: bestUser,
      cardDiscovery: cardDiscovery,
      collections: collections,
      bestCard: bestCard,
      cardsVisible: cardsVisible
    });
  } catch (error) {
    res.send(error);
  }
});


/* REGISTRATION */

visitorRouter.get("/register", async (req, res) => {
  try {
    res.render("auth/register.html.twig");
  } catch (error) {
    res.send(error);
  }
});


visitorRouter.post("/register", urlencodedParser, [
  check('username', ERROR_REGISTER_USERNAME)
      .exists()
      .isLength({ min: 3 }),
  check('email', ERROR_REGISTER_EMAIL)
      .isEmail()
      .normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const alert = errors.array()
        res.render('auth/register.html.twig', {
            alert
        })
    } else {
        await userController.setRegistration(req, res);
        res.redirect("/");
    }
  } catch (error) {
    res.send(error);
  }
});



/* CONNEXION */

visitorRouter.get("/login", async (req, res) => {
  try {
    res.render("auth/login.html.twig");
  } catch (error) {
    res.send(error);
  }
});


visitorRouter.post("/login", async (req, res) => {
  try {
    let user = await userController.setLogin(req, res)
    if (user) {
      req.session.user = user._id
      res.redirect("/home");
    } else {
      const alert = ERROR_LOGIN;
      res.render("auth/login.html.twig",{
        alert
      });
    }
  }
  catch (error) {
    console.log(error);
    res.send(error);
  }
});


/* LOGOUT */

visitorRouter.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/');
});


/* LOSTPASSWORD TEMPORAIRE */



/* USERMANUAL */



/* CONTACT */

/* FA */
visitorRouter.get("/faq", async (req, res) => {
  try {
    res.render("faq/privacy-policy.html.twig");
  } catch (error) {
    res.send(error);
  }
}); 











export default visitorRouter;