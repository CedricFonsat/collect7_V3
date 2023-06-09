import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Pas de nom d'utilisateur"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Pas d'adresse Email"],
  },
  password: {
    type: String,
    required: [true, "Pas de mot de passe"],
  },
  avatar: {
    type: String,
    default: "avatar.svg"
  },
  cover: {
    type: String,
    default: "background.png"
  },
  cardsSold: {
    type: [],
    required: [false, "Pas de carte(s) vendu"]
  },
  cards: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "card" }] },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  wallet: {
    type: Number,
    required: [true, "Vous n'avez pas assez de 7coins"],
    default: 300
  },
  resetToken: String,
  resetTokenExpiration: Date,
})

userSchema.methods.getFollowers = function (callback) {
  userModel.find({ following: this._id }, function (err, users) {
    if (err) throw err;
    callback(users);
  });
};

userSchema.methods.isFollowing = function (userId) {
  return this.following.some(function (followId) {
    return followId.equals(userId);
  });
};

const userModel = mongoose.model('User', userSchema)

export default userModel