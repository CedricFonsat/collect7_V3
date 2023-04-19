import nodemailer,{ createTransport } from "nodemailer";
import newsletter from "../service/newsletter.js";

export class appController {

    static async setNewsletter(req, res) {
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: 'fonsat.nodemailer@gmail.com',
                pass: 'dlclhbrybfcawlgi'
            }
        })
        
        const mailOptions = {
            from: 'fonsat.nodemailer@gmail.com',
            to: req.body.email,
            subject: 'Newsletter - Collect7',
            html: newsletter
        }
        
        transporter.sendMail(mailOptions, (error, info)=>{
            if (error) {
                console.log(error);
                res.send('error')
            }else{
                console.log('Email sent: '+info.res);
                res.redirect('/#newsletter')
            } })
    }

    static async setTeste(req, res){
       
    }
}

export default appController