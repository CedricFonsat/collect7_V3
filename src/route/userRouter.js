import { Router } from "express";
import userModel from "../model/userModel.js";
import collectionModel from "../model/collectionModel.js";
import cardModel from "../model/cardModel.js";
import { uploadAvatarCover } from "../service/multer.js";
import userController from "../controller/userController.js";
import uploadAvatar from "../service/avatar.js";

const userRouter = Router();



/* EN VENTE */

userRouter.get("/sell/:cardId", async (req, res) => {
  await cardModel.updateOne(
    { _id: req.params.cardId },
    { ifAvalaible: 1 }
  );
  res.redirect("/account");
})

userRouter.get("/removeSale/:cardId", async (req, res) => {
  await cardModel.updateOne(
    { _id: req.params.cardId },
    { ifAvalaible: 0 }
  );
  res.redirect("/account");
})


/* ACHAT CARTE COLLECTION */

userRouter.get("/buyCard/:cardId", async (req,res) => {
  try {
    let userOnline = await userModel.findOne({ _id: req.session.user });
    let cardSell = await cardModel.findOne({ _id: req.params.cardId });
    let cashResult = userOnline.wallet - cardSell.price;
    let adminID = await userModel.findOne({ _id: process.env.IDADMIN });
    let adminCash = adminID.wallet + cardSell.price;
    if (userOnline.wallet >= cardSell.price) {
        await userModel.updateOne(
            { _id: req.session.user },
            { wallet: cashResult, $push: { cards: req.params.cardId } }
        );
        await userModel.updateOne(
            { _id: process.env.IDADMIN },
            { wallet: adminCash }
        );
        await cardModel.updateOne(
            { _id: req.params.cardId },
            { ifAvalaible: 0 }
        );
        await cardModel.updateOne(
            { _id: req.params.cardId },
            { $push: { user: userOnline.id } }
        );
        res.redirect("/home");
        console.log('buy card');
    } else if (userOnline.wallet < cardSell.price) {
        res.redirect("/home");
    }
  } catch (error) {
    res.send(error);
  }
});


/* HOME */

userRouter.get("/home", async (req, res) => {
  try {
    let cards = await cardModel.find();
    let userConnect = await userModel.findOne({ _id: req.session.user });
    res.render("site/shop.html.twig",{
      cards: cards,
      userConnect: userConnect
    });
  } catch (error) {
    res.send(error);
  }
});


/* COMMUNAUTE */

userRouter.get("/community", async (req, res) => {
  try {
    let users = await userModel.find(req.body);
    let cards = await cardModel.find({ users: { $in: users.map(user => user.id) } });
     let userConnect = await userModel.findOne({ _id: req.session.user });
    let userCards = await userModel.find().populate("cards");
    res.render("site/community.html.twig", {
      cards: cards,
      userConnect: userConnect,
      userCards: userCards
    });
  } catch (error) {
    res.send(error);
  }
});


/* CLASSEMENT */

userRouter.get("/ranking", async (req, res) => {
  try {
    const users = await userModel.find().populate('cards');
    users.sort((a, b) => b.cards.length - a.cards.length);
   
    let userConnect = await userModel.findOne({ _id: req.session.user });
    res.render("site/ranking.html.twig", {
    userConnect: userConnect,
      users: users
    });
  } catch (error) {
    res.send(error);
  }
});


/* ACCOUNT */

userRouter.get("/account", async (req, res) => {
  try {
    let userCo = await userModel
    .findOne({ _id: req.session.user })
    .populate("cards");
  let cards = userCo.cards;
    let userConnect = await userModel.findOne({ _id: req.session.user });
    console.log(userConnect.id);
    res.render("user/account.html.twig", {
      userConnect: userConnect,
      cards: cards,
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

userRouter.post('/account/update/:id', uploadAvatar.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res) => {
  try {
    const userId = req.params.id;
    let update = {};

    if (req.files['avatar']) {
      update.avatar = req.files['avatar'][0].filename;
    }

    if (req.files['cover']) {
      update.cover = req.files['cover'][0].filename;
    }

    await userModel.updateOne({ _id: userId }, update);
    res.redirect('/account');
  } catch (error) {
    res.send(error);
  }
});

userRouter.get("/account/:id", async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id }, req.body);
    let userConnect = await userModel.findOne({ _id: req.session.user });
    let userCards = await userModel.findOne({ _id: req.params.id }, req.body).populate("cards");
    let cards = userCards.cards;
    res.render("user/user.html.twig", {
      user: user,
      cards: cards,
      userConnect: userConnect
    })
  } catch (error) {
    res.send(error);
  }
});


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

userRouter.get('/follow/:id', async (req, res) => { /* CONTROLLER */
       let ids = await userModel.findOne({ _id: req.params.id }, req.body);
        let userConnect = await userModel.findOne({ _id: req.session.user });
        const userId = userConnect.id;
        userModel.findById(userId, (err, user) => {
            if (err) throw err;
            user.following.push(req.params.id);
            user.save();
            userModel.findById(req.params.id, (err, followedUser) => {
                if (err) throw err;
                followedUser.followers.push(userId);
                followedUser.save();
                res.redirect('/account/' + ids);
            });
        });
});

userRouter.get('/unfollow/:id', async (req, res) => { /* CONTROLLER */
let ids = await userModel.findOne({ _id: req.params.id }, req.body);
console.log(ids);
let userConnect = await userModel.findOne({ _id: req.session.user });
const userId = userConnect.id;
userModel.findById(userId, (err, user) => {
    if (err) throw err;
    const index = user.following.indexOf(req.params.id);
    if (index > -1) {
        user.following.splice(index, 1);
        user.save();
    }
    userModel.findById(req.params.id, (err, followedUser) => {
        if (err) throw err;
        const index = followedUser.followers.indexOf(userId);
        if (index > -1) {
            followedUser.followers.splice(index, 1);
            followedUser.save();
        }
        res.redirect('/account/' + ids);
    });
});
});


export default userRouter;