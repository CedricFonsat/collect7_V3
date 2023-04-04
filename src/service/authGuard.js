import userModel from "../model/userModel.js";

 let authGuard = async function (req,res,next) {
    let user = await userModel.findOne({_id: req.session.user})
    if (user) {
        next()
    }else{
        res.redirect("/");
    }
}
export default authGuard