import { Router } from "express";
import userModel from "../model/userModel.js";
import collectionModel from "../model/collectionModel.js";
import cardModel from "../model/cardModel.js";
import { uploadAvatarCover } from "../service/multer.js";
import userController from "../controller/userController.js";
import uploadAvatar from "../service/avatar.js";
import nodemailer from "nodemailer";


import crypto from 'crypto';
import appController from "../controller/appController.js";



const userRouter = Router();

//___________________________________________________________________________________________
//___________________________________________________________________________________________
//___________________________________________________________________________________________
//___________________________________________________________________________________________
userRouter.get('/forgot', function(req, res) {
  res.render('auth/reset-password/forgot.html.twig');
});

userRouter.post("/forgot", async (req, res) => {

  const user = userModel.findOne({ email: req.body.email })
  if (!user) {
    return res.redirect('/forgot');
 }else{
  crypto.randomBytes(20, function(err, buf) {
    if (err) throw err;
    const token = buf.toString('hex')
    userModel.resetToken = token;
    userModel.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    userModel.upd();
 

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fonsat.nodemailer@gmail.com',
        pass: 'dlclhbrybfcawlgi'
    }
  });

  const mailOptions = {
    to: 'fonsat.nodemailer@gmail.com',
    from: req.body.email,
    subject: 'Reset your password',
    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

 
  res.redirect('/forgot')
  console.log('yes,yes,yes')
  return transporter.sendMail(mailOptions);
})

 }
    
 
  res.redirect("/account");
})

userRouter.get('/reset/:token', function(req, res) {
  userModel.findOne({ resetToken: req.params.token, resetTokenExpiration: { $gt: Date.now() } }, function(err, user) {
    if (err) throw err;

    if (!user) {
      return res.redirect('/forgot');
    }

    res.render('auth/reset-password/reset.html.twig', { token: req.params.token });
  });
});


userRouter.post('/reset/:token', function(req, res) {
  userModel.findOne({ resetToken: req.params.token, resetTokenExpiration: { $gt: Date.now() } }, function(err, userModel) {
    if (err) throw err;

    if (!userModel) {
      return res.redirect('/forgot');
    }

    userModel.password = req.body.password;
    userModel.resetToken = undefined;
    userModel.resetTokenExpiration = undefined;

    userModel.save(function(err) {
      if (err) throw err;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fonsat.nodemailer@gmail.com',
            pass: 'dlclhbrybfcawlgi'
        }
      });

      const mailOptions = {
        to: 'fonsat.nodemailer@gmail.com',
        from: req.body.email,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n',
      };

      transporter.sendMail(mailOptions, function(err) {
        if (err) throw err;

         res.redirect('/');
      });
    });
  });
});

//___________________________________________________________________________________________
//___________________________________________________________________________________________
//___________________________________________________________________________________________
//___________________________________________________________________________________________


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
            //$pull: { cards: req.params.cardId }
        );
        await userModel.updateOne(
            { _id: process.env.IDADMIN },
            { wallet: adminCash }
        );
        await cardModel.updateOne(
            { _id: req.params.cardId },
            { ifAvalaible: 1 }
        );
        await cardModel.updateOne(
            { _id: req.params.cardId },
            { $push: { user: userOnline.id } }
        );
        res.redirect("/home");

// Create an instance of Notyf
const notyf = new Notyf();

// Display an error notification 
notyf.error('Please fill out the form');
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
        let filter = {};
        let priceSort = "";
        let cards;
    
        // Filtrer les cartes par collection
        if (req.query.collection) {
          filter.collections = req.query.collection;
        }
    
        // Filtrer les cartes par prix
        // if (req.query.price) {
        //   filter.price = { $lte: req.query.price };
        // }

        if (req.query.price_max) {
         // priceSort = req.query.price_max;
          cards = await cardModel.find(filter).sort({"price" : -1});
        }

        console.log(priceSort,"-------------------------");
    
        cards = await cardModel.find(filter)
        let userConnect = await userModel.findOne({ _id: req.session.user });
        let collectionA = await collectionModel.find();
        res.render("site/shop.html.twig",{
          cards: cards,
          userConnect: userConnect,
          collectionA: collectionA
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

    if (req.body.username) {
      update.username = req.body.username;
    }

    if (req.body.email) {
      update.email = req.body.email;
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

userRouter.get('/follow/:id', async (req, res) => {
  let ids = await userModel.findOne({ _id: req.params.id }, req.body);
  let userConnect = await userModel.findOne({ _id: req.session.user });
  const userId = userConnect.id;

  console.log('/account/' + ids.id);

  userModel.findById(userId)
  .exec()
  .then((user) => {
    if (!user) throw new Error('User not found');
    user.following.push(req.params.id);
    return user.save();
  })
  .then(() => {
    return userModel.findById(req.params.id).exec();
  })
  .then((followedUser) => {
    if (!followedUser) throw new Error('Followed user not found');
    followedUser.followers.push(userId);
    return followedUser.save();
  })
  .then(() => {
    res.redirect('/account/' + ids.id);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('An error occurred');
  });

});

userRouter.get('/unfollow/:id', async (req, res) => {
  let ids = await userModel.findOne({ _id: req.params.id }, req.body);
  let userConnect = await userModel.findOne({ _id: req.session.user });
  const userId = userConnect.id;

  console.log('/account/' + ids.id);

  userModel.findById(userId)
  .exec()
  .then((user) => {
    if (!user) throw new Error('User not found');
    const index = user.following.indexOf(req.params.id);
    if (index > -1) {
        user.following.splice(index, 1);
        return user.save();
    }
    return Promise.resolve();
  })
  .then(() => {
    return userModel.findById(req.params.id).exec();
  })
  .then((followedUser) => {
    if (!followedUser) throw new Error('Followed user not found');
    const index = followedUser.followers.indexOf(userId);
    if (index > -1) {
        followedUser.followers.splice(index, 1);
        return followedUser.save();
    }
    return Promise.resolve();
  })
  .then(() => {
    res.redirect('/account/' + ids.id);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('An error occurred');
  });

});



export default userRouter;