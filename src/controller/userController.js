import userModel from "../model/userModel.js";
import { cryptPassword, comparePassword } from "../service/bcrypt.js";

export class userController {

    static async setRegistration(req) {
        let userPseudo= await userModel.findOne({username: req.body.username})
        if (userPseudo) {
            console.log(userPseudo);
            throw "votre pseudo est deja utilisé"
        }
        let userMail= await userModel.findOne({email: req.body.email})
        if (userMail) {
            throw "votre email est deja utilisé"
        }
        req.body.password = await cryptPassword(req.body.password)
        let user = new userModel(req.body)
        await user.save()
        req.session.user = user._id
    }

    static async setLogin(req) {
        let userPseudo= await userModel.findOne({username: req.body.email})
        if (userPseudo) {
            if ( comparePassword(req.body.password,userPseudo.password)) {
                return userPseudo
            } 
        }
        let userMail= await userModel.findOne({email: req.body.email})
        if (userMail) {
            if (comparePassword(req.body.password,userMail.password)) {
                return userMail
            }

        }
      return null
    }

    static async buyCard(req, res) {
        let userOnline = await userModel.findOne({ _id: req.session.user });
        let cardSell = await cardModel.findOne({ _id: req.params.cardId });
        let cashResult = userOnline.wallet - cardSell.priceCard;
        let adminID = await userModel.findOne({ _id: process.env.IDADMIN });
        let adminCash = adminID.wallet + cardSell.priceCard;
        if (userOnline.wallet >= cardSell.priceCard) {
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
            res.redirect("/collection");
        } else if (userOnline.wallet < cardSell.priceCard) {
            res.redirect("/collection");
        }
    }

    static async getHome(req, res) {
       // let cards = await cardModel.find();
       // let userConnect = await userModel.findOne({ _id: req.session.user });
        // let countCards = 0;
        // for (let i = 0; i < cards.length; i++) {
        //     cards[i].user == '' ? countCards += 1 : countCards += 0;
        // }
        res.render("site/shop.html.twig");
    }

    static async buy(req, res) {
        let userSell = await userModel.findOne({ cards: req.params.cardId });
        let userOnline = await userModel.findOne({ _id: req.session.user });
        let cardSell = await cardModel.findOne({ _id: req.params.cardId });
        let cashResult = userOnline.wallet - cardSell.priceCard;
        let userSellCash = userSell.wallet + cardSell.priceCard;
        if (userOnline.wallet >= cardSell.priceCard) {
            await userModel.updateOne(
                { _id: req.session.user },
                { wallet: cashResult, $push: { cards: req.params.cardId } }
            );
            await userModel.updateOne(
                { _id: userSell.id },
                { wallet: userSellCash, $push: { cardsSold: req.params.cardId }, $pull: { cards: req.params.cardId } }
            );
            await cardModel.updateOne(
                { _id: req.params.cardId },
                { ifAvalaible: 0 }
            );
            res.redirect('/account');
        } else if (userOnline.wallet < cardSell.priceCard) {
            res.redirect('/account');
        }
    }

    static async follow(req, res) {
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
                res.redirect('/account/' + ids.id);
            });
        });
    }

    static async unfollow(req, res) {
        let ids = await userModel.findOne({ _id: req.params.id }, req.body);
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
                res.redirect('/account/' + ids.id);
            });
        });
    }

}

export default userController;