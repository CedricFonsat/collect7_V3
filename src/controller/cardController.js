import cardModel from "../model/cardModel.js";
import collectionModel from "../model/collectionModel.js";

export class cardController {

    static async setAddCard(req) {
        req.body.image = req.file.filename;
        console.log(req.body.collections)
        let card = new cardModel(req.body)
        await card.save()
        await collectionModel.updateOne({ _id: req.body.collections }, { $push: { cards: card._id } })
    }
}

export default cardController