import collectionModel from "../model/collectionModel.js";

export class collectionController {
    static async setAddCollection(req) {
        req.body.image = req.file.filename;
        let collection = new collectionModel(req.body)
        await collection.save()
    }
    static async setCollectionAdmin(req) {
        req.body.logo = req.files.logo[0].filename;
        req.body.cover = req.files.cover[0].filename;
        req.body.image = req.files.image[0].filename;
        console.log(req.body);
        let overview = new collectionModel(req.body)
        await overview.save()
    }
}

export default collectionController