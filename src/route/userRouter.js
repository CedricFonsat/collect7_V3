import { Router } from "express";
import userModel from "../model/userModel.js";
import collectionModel from "../model/collectionModel.js";
import cardModel from "../model/cardModel.js";
import { uploadAvatar } from "../service/multer.js";
import userController from "../controller/userController.js"

const userRouter = Router();



/* EN VENTE */

// userRouter.get("/sell/:cardId", async (req, res) => {
//   await cardModel.updateOne(
//     { _id: req.params.cardId },
//     { ifAvalaible: 1 }
//   );
//   res.redirect("/account");
// })

// userRouter.get("/removeSale/:cardId", async (req, res) => {
//   await cardModel.updateOne(
//     { _id: req.params.cardId },
//     { ifAvalaible: 0 }
//   );
//   res.redirect("/account");
// })


/* ACHAT CARTE COLLECTION */

// userRouter.get("/buyCard/:cardId", async (res) => {
//   try {
//     await userController.buyCard()
//   } catch (error) {
//     res.send(error);
//   }
// });


/* HOME */

userRouter.get("/home", async (req, res) => {
  try {
    await userController.getHome()
  } catch (error) {
    res.send(error);
  }
});


/* COMMUNAUTE */

// userRouter.get("/community", async (req, res) => {
//   try {
//     let users = await userModel.find(req.body);
//     let cards = await cardModel.find({ user: { $in: users.map(user => user.id) } });
//     let userConnect = await userModel.findOne({ _id: req.session.user });
//     let userCards = await userModel.find().populate("cards");
//     res.render("pages/community.twig", {
//       cards: cards,
//       userConnect: userConnect,
//       userCards: userCards
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });


/* CLASSEMENT */

// userRouter.get("/ranking", async (req, res) => {
//   try {
//     const users = await userModel.find().limit(8);
//     users.sort((a, b) => b.cards.length - a.cards.length);
//     let userConnect = await userModel.findOne({ _id: req.session.user });
//     res.render("pages/ranking.twig", {
//       userConnect: userConnect,
//       users: users
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });


/* ACCOUNT */

userRouter.get("/account", async (req, res) => {
  try {
    // let userCo = await userModel
    //   .findOne({ _id: req.session.user })
    //   .populate("cards");
    // let cards = userCo.cards;
    let userConnect = await userModel.findOne({ _id: req.session.user });
    console.log(userConnect.id);
    res.render("user/account.html.twig", {
      userConnect: userConnect,
      // cards: cards,
    });
  } catch (error) {
    res.send(error);
  }
});

userRouter.get("/account/update/:id", async (req, res) => {
  try {
    // let userCo = await userModel
    //   .findOne({ _id: req.session.user })
    //   .populate("cards");
    let userConnect = await userModel.findOne({ _id: req.session.user });
    
    res.render("user/edit.html.twig",{
      userConnect: userConnect,
    });
  } catch (error) {
    res.send(error);
  }
});


// userRouter.post("/account/update/:id", uploadAvatar.single('avatar'), async (req, res) => {
//   try {
//     if (req.file) {
//       req.body.avatar = req.file.filename;
//     }
//     await userModel.updateOne({ _id: req.params.id }, req.body);
//     res.redirect('/account')
//   } catch (error) {
//     res.send(error);
//   }
// });


// userRouter.get("/account/:id", async (req, res) => {
//   try {
//     let user = await userModel.findOne({ _id: req.params.id }, req.body);
//     let userConnect = await userModel.findOne({ _id: req.session.user });
//     let userCards = await userModel.findOne({ _id: req.params.id }, req.body).populate("cards");
//     let cards = userCards.cards;
//     res.render("pages/user/user.twig", {
//       user: user,
//       cards: cards,
//       userConnect: userConnect
//     })
//   } catch (error) {
//     res.send(error);
//   }
// });

// userRouter.get('/users', async (req, res) => {
//   try {
//     let users = await userModel.findOne({ _id: req.params.id }, req.body);
//     let userConnect = await userModel.findOne({ _id: req.session.user });
//     res.render("pages/users.twig", {
//       users: users,
//       userConnect: userConnect
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });






// userRouter.get("/buy/:cardId", async (res) => {
//   try {
//     await userController.buy()
//   } catch (error) {
//     res.send(error);
//   }
// });


/* COLLECTION */

// userRouter.get("/collection", async (req, res) => {
//   try {
//     let collection = await collectionModel.find(req.body);
//     let userConnect = await userModel.findOne({ _id: req.session.user });
//     res.render("pages/collection.twig", {
//       collection: collection,
//       userConnect: userConnect
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// userRouter.get("/collection/:id", async (req, res) => {
//   try {
//     let collection = await collectionModel
//       .findOne({ _id: req.params.id })
//       .populate("cards");
//     let cards = collection.cards;
//     let userConnect = await userModel.findOne({ _id: req.session.user });
//     res.render("pages/cards.twig", {
//       collection: collection,
//       cards: cards,
//       userConnect: userConnect
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });


/* FOLLOW */

// userRouter.get('/follow/:id', async () => { /* CONTROLLER */
//   await userController.follow()
// });

// userRouter.get('/unfollow/:id', async () => { /* CONTROLLER */
//   await userController.unfollow()
// });


export default userRouter;