import mongoose from 'mongoose'

const IMG = "/img/image.jpeg";

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Pas de nom de carte"]
    },
    price: {
        type: Number,
        required: [true, "Pas de prix de carte"]
    },
    image: {
        type:String,
        default: IMG
    },
    collections: {
        type: [],
        required: [true, "Pas de collection"]
    },
    ifAvalaible: { type: Number, default: 1 },
   // ifUserSell: { type: Number, default: 0 },
    users: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

const cardModel = mongoose.model('card', cardSchema)

export default cardModel 