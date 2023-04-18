import { body, validationResult } from "express-validator";
import userModel from "../model/userModel.js";

const validatorRegister =  [
    body('username')
      .notEmpty()
      .withMessage('Le champ nom d\'utilisateur est obligatoire')
      .isLength({ min: 3 })
      .withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
      .custom(async (username) => {
        const user = await userModel.findOne({ username });
        if (user) {
          throw new Error('Le nom d\'utilisateur existe déjà');
        }
      })
      .matches(/^(?![_])^(?!.*[_]{2})[a-zA-Z0-9_]+(?<![_])$/)
      .withMessage('Le format du nom d\'utilisateur est incorrect'),
    body('email')
      .notEmpty()
      .withMessage('Le champ d\'adresse email est obligatoire')
      .isEmail()
      .withMessage('L\'adresse email doit être valide')
      .custom(async (email) => {
        const user = await userModel.findOne({ email });
        if (user) {
          throw new Error('L\'adresse email existe déjà');
        }
      }),
    body('password')
      .notEmpty()
      .withMessage('Le mot de passe est requis')
      .matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/)
      .withMessage('Le mot de passe doit contenir au moins 12 caractères, y compris des lettres majuscules et minuscules, des chiffres et des caractères spéciaux'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
        return true;
      })
      .withMessage('Les mots de passe ne correspondent pas'),
  ]



  export {validatorRegister}