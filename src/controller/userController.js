import userModel from "../model/userModel.js";
import { cryptPassword, comparePassword } from "../service/bcrypt.js";
import "dotenv/config";
import cookieParser from "cookie-parser";

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

    static async setLogin(req,res) {

        let userPseudo= await userModel.findOne({username: req.body.email})
        if (userPseudo) {
            const authUsername = await comparePassword(req.body.password,userPseudo.password)
            if (authUsername) {
                if (req.query.rememberMe) {
                    // Set cookie if "remember me" checkbox is checked
                    res.cookie('rememberMe', '1', { maxAge: 900000, httpOnly: true });
                    return userPseudo
                  } else {
                    // Delete cookie if "remember me" checkbox is unchecked
                    res.clearCookie('rememberMe');
                  }
                return userPseudo
            } else console.log('error de login');
        }
        let userMail= await userModel.findOne({email: req.body.email})
       
        if (userMail){
            const authEmail = await comparePassword(req.body.password,userMail.password)
            if (authEmail) {
                if (req.query.rememberMe) {
                    // Set cookie if "remember me" checkbox is checked
                    res.cookie('rememberMe', '1', { maxAge: 900000, httpOnly: true });
                    return userMail
                  } else {
                    // Delete cookie if "remember me" checkbox is unchecked
                    res.clearCookie('rememberMe');
                  }
                return userMail
            } else console.log('error de login');
        }
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




}

export default userController;