import mongoose from 'mongoose'

const url = "https://i.stack.imgur.com/34AD2.jpg";

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Pas de nom de collection"]
    },
    author: {
        type: String,
        default: "Collect7"
    },
    category: {
        type: String,
        required: [true, "Pas de categorie"]
    },
    description: {
        type: String,
        required: [true, "Pas de description"]
    },
    logo: {
        type: String,
        default: url
    },
    cover: {
        type: String,
        default: url
    },
    image: {
        type: String,
        default: url
    },
    ifVisible: { 
        type: Boolean, 
        default: 0
    },
    cards: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "card" }] }
})

const collectionModel = mongoose.model('collections', collectionSchema)

export default collectionModel 