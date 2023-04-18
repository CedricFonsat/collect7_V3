import bodyParser from "body-parser";
import { Router } from "express";

const visitorRouter = Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const login_error = "Il y a eu une erreur, vos identifiants ne correspondent pas";



export {login_error}
export {urlencodedParser}
export {visitorRouter}