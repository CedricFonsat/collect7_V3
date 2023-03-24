import overviewModel from "../model/overviewModel.js";

export class overviewController {
    static async setAddOverview(req) {
        req.body.backgroundImageOverview = req.files.backgroundImageOverview[0].filename;
        req.body.imageOverview = req.files.imageOverview[0].filename;
        console.log(req.body);
        let overview = new overviewModel(req.body)
        await overview.save()
    }
}

export default overviewController