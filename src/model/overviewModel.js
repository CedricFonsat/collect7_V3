import mongoose from 'mongoose'

const overviewSchema = new mongoose.Schema({
    titleOverview: {
        type: String,
        required: [true, "Pas de titre"]
    },
    descriptionOverview: {
        type: String,
        required: [true, "Pas de description"]
    },
    backgroundImageOverview: {
        type: String,
        default: "carouselOne.png"
    },
    imageOverview: {
        type: String,
        default: "carouselOne.png"
    },
})

const overviewModel = mongoose.model('overviews', overviewSchema)

export default overviewModel 