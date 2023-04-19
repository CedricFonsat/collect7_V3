import 'dotenv/config'
import userController from "../controller/userController.js";
import collectionModel from "../model/collectionModel.js";
import userModel from "../model/userModel.js";
import cardModel from "../model/cardModel.js";
import { validationResult } from "express-validator";
import { validatorRegister } from "../service/validator-security.js";
import appController from "../controller/appController.js";
import { login_error, visitorRouter, urlencodedParser } from '../service/constant.js'




/* HOME */

visitorRouter.post("/", async (req, res) => {
  try {
    //newsletter recup mail start
    await appController.setNewsletter(req, res);
    //newsletter recup mail end
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
    let cardsVisible = await cardModel.find({ ifAvalaible: 1 }).count();
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


visitorRouter.post("/register", urlencodedParser, validatorRegister, async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('auth/register.html.twig', { errors: errors.array() });
  } else {
    // le formulaire est valide, on peut enregistrer l'utilisateur
    await userController.setRegistration(req, res);
    res.redirect('/login');
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
      res.render("auth/login.html.twig", {
        login_error
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









visitorRouter.get("/contact", async (req, res) => {
  try {
    res.render("site/contact.html.twig");
  } catch (error) {
    res.send(error);
  }
});


export default visitorRouter;