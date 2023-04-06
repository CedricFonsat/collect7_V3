import { Router } from "express";
import 'dotenv/config'
import userController from "../controller/userController.js";
import collectionModel from "../model/collectionModel.js";
import userModel from "../model/userModel.js";
import cardModel from "../model/cardModel.js";
import bodyParser from "body-parser";
import { check, validationResult } from "express-validator";
import { createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";


const visitorRouter = Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const ERROR_LOGIN = "There was an error, your identifiers not match";
const ERROR_REGISTER_USERNAME = 'Username must be longer than 3 characters';
const ERROR_REGISTER_EMAIL = 'Email is not valid';


/* HOME */

visitorRouter.post("/", async (req, res) => {
  try{
       //newsletter recup mail
   const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'fonsat.nodemailer@gmail.com',
        pass: 'dlclhbrybfcawlgi'
    }
})

const mailOptions = {
    from: req.body.email,
    to: 'fonsat.pro@gmail.com',
    subject: 'Newsletter - Collect7',
    html: `<!-- Free to use, HTML email template designed & built by FullSphere. Learn more about us at www.fullsphere.co.uk -->

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
    
      <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
    
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    
        <!-- Your title goes here -->
        <title>Newsletter</title>
        <!-- End title -->
    
        <!-- Start stylesheet -->
        <style type="text/css">
          a,a[href],a:hover, a:link, a:visited {
            /* This is the link colour */
            text-decoration: none!important;
            color: #0000EE;
          }
          .link {
            text-decoration: underline!important;
          }
          p, p:visited {
            /* Fallback paragraph style */
            font-size:15px;
            line-height:24px;
            font-family:'Helvetica', Arial, sans-serif;
            font-weight:300;
            text-decoration:none;
            color: #000000;
          }
          h1 {
            /* Fallback heading style */
            font-size:22px;
            line-height:24px;
            font-family:'Helvetica', Arial, sans-serif;
            font-weight:normal;
            text-decoration:none;
            color: #000000;
          }
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        </style>
        <!-- End stylesheet -->
    
    </head>
    
      <!-- You can change background colour here -->
      <body style="text-align: center; margin: 0; padding-top: 10px; padding-bottom: 10px; padding-left: 0; padding-right: 0; -webkit-text-size-adjust: 100%;background-color: #f2f4f6; color: #000000" align="center">
      
      <!-- Fallback force center content -->
      <div style="text-align: center;">
    
        <!-- Email not displaying correctly -->
        <table align="center" style="text-align: center; vertical-align: middle; width: 600px; max-width: 600px;" width="600">
          <tbody>
            <tr>
              <td style="width: 596px; vertical-align: middle;" width="596">
    
                <p style="font-size: 11px; line-height: 20px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #000000;">Is this email not displaying correctly? <a class="link" style="text-decoration: underline;" target="_blank" href="https://fullsphere.co.uk/html-emails/free-template/"><u>Click here</u></a> to view in browser</p>
    
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Email not displaying correctly -->
        
        <!-- Start container for logo -->
        <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #ffffff;" width="600">
          <tbody>
            <tr>
              <td style="width: 596px; vertical-align: top; padding-left: 0; padding-right: 0; padding-top: 15px; padding-bottom: 15px;" width="596">
    
                <!-- Your logo is here -->
                <img style="width: 180px; max-width: 180px; height: 85px; max-height: 85px; text-align: center; color: #ffffff;" alt="Logo" src="https://fullsphere.co.uk/misc/free-template/images/logo-white-background.jpg" align="center" width="180" height="85">
    
              </td>
            </tr>
          </tbody>
        </table>
        <!-- End container for logo -->
    
        <!-- Hero image -->
        <img style="width: 600px; max-width: 600px; height: 350px; max-height: 350px; text-align: center;" alt="Hero image" src="https://fullsphere.co.uk/misc/free-template/images/hero.jpg" align="center" width="600" height="350">
        <!-- Hero image -->
    
        <!-- Start single column section -->
        <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #ffffff;" width="600">
            <tbody>
              <tr>
                <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;" width="596">
    
                  <h1 style="font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 600; text-decoration: none; color: #000000;">Bienvenue sur la newsletter de Collect7</h1>
    
                  <p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #919293;">En vous inscrant sur la newsletter de collect7 vous benificier de certain avantage dont les features en avant premiere et plein chose future (c que du blabla)</p>              
    
                  <p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #919293;">Commence a collectionner des cartes</p>
    
                  <!-- Start button (You can change the background colour by the hex code below) -->
                  <a href="#" target="_blank" style="background-color: #000000; font-size: 15px; line-height: 22px; font-family: 'Helvetica', Arial, sans-serif; font-weight: normal; text-decoration: none; padding: 12px 15px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;">
                      <!--[if mso]>
                      <i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt;">&nbsp;</i>
                    <![endif]-->
    
                      <span style="mso-text-raise: 15pt; color: #ffffff;">Commencer</span>
                      <!--[if mso]>
                      <i style="letter-spacing: 25px; mso-font-width: -100%;">&nbsp;</i>
                    <![endif]-->
                  </a>
                  <!-- End button here -->
    
                </td>
              </tr>
            </tbody>
          </table>
          <!-- End single column section -->
          
    
    
          <!-- Start footer -->
          <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #000000;" width="600">
            <tbody>
              <tr>
                <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 30px;" width="596">
    
                  <!-- Your inverted logo is here -->
                  <img style="width: 180px; max-width: 180px; height: 85px; max-height: 85px; text-align: center; color: #ffffff;" alt="Logo" src="https://fullsphere.co.uk/misc/free-template/images/logo-black-background.jpg" align="center" width="180" height="85">
    
                  <p style="font-size: 13px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #ffffff;">
                    Aubagne 155 Rue du dirigeable
                  </p>
    
                  <p style="margin-bottom: 0; font-size: 13px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #ffffff;">
                    <a target="_blank" style="text-decoration: underline; color: #ffffff;" href="https://fullsphere.co.uk">
                      www.collect7.fr
                    </a>
                  </p>
    
                </td>
              </tr>
            </tbody>
          </table>
          <!-- End footer -->
        
          <!-- Start unsubscribe section -->
          <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px;" width="600">
            <tbody>
              <tr>
                <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 30px;" width="596">
                  
                  <p style="font-size: 12px; line-height: 12px; font-family: 'Helvetica', Arial, sans-serif; font-weight: normal; text-decoration: none; color: #000000;">
                    Not wanting to receive these emails?
                  </p>
    
                  <p style="font-size: 12px; line-height: 12px; font-family: 'Helvetica', Arial, sans-serif; font-weight: normal; text-decoration: none; color: #000000;">
                    You can <a style="text-decoration: underline; color: #000000;" href="insert-unsubscribe-link-here"><u>unsubscribe here</u></a>
                  </p>
    
                  <p style="font-size: 12px; line-height: 12px; font-family: 'Helvetica', Arial, sans-serif; font-weight: normal; text-decoration: none; color: #919293; margin-top: 30px;">
                    Email template built by <a style="text-decoration: none; color: #919293;" href="https://fullsphere.co.uk"><u>FullSphere</u></a>
                  </p>
    
                </td>
              </tr>
            </tbody>
          </table>
          <!-- End unsubscribe section -->
      
      </div>
    
      </body>
    
    </html>`
}

transporter.sendMail(mailOptions, (error, info)=>{
    if (error) {
        console.log(error);
        res.send('error')
    }else{
        console.log('Email sent: '+info.res);
        res.redirect('/#newsletter')
    }
})

//end
  } catch (error) {
    res.send(error);
  }
})

visitorRouter.get("/", async (req, res) => {
  try {
    let cardsCount = await cardModel.find(req.body).count();
    let collectionsCount = await collectionModel.find(req.body).count();
    let bestUser = await userModel.find(req.body).limit(10);
    let cardDiscovery = await cardModel.find(req.body).limit(5);
    let collections = await collectionModel.find(req.body).limit(4);
    let bestCard = await cardModel.find(req.body).limit(1); 
    let usersCount = await userModel.find(req.body).count();
   // let cards = await cardModel.find({ users: { $in: users.map(user => user.id) } });

   //Transaction calcule start
   let cardsVisible = await cardModel.find({ifAvalaible: 1}).count();

   console.log(cardsVisible);
   //Transaction calcule end

    res.render("site/index.html.twig", {
      cardsCount: cardsCount,
      usersCount: usersCount,
      collectionsCount: collectionsCount,
      bestUser: bestUser,
      cardDiscovery: cardDiscovery,
      collections: collections,
      bestCard: bestCard,
      cardsVisible: cardsVisible
    });
  } catch (error) {
    res.send(error);
  }
});


/* REGISTRATION */

visitorRouter.get("/register", async (req, res) => {
  try {
    res.render("auth/register.html.twig");
  } catch (error) {
    res.send(error);
  }
});


visitorRouter.post("/register", urlencodedParser, [
  check('username', ERROR_REGISTER_USERNAME)
      .exists()
      .isLength({ min: 3 }),
  check('email', ERROR_REGISTER_EMAIL)
      .isEmail()
      .normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const alert = errors.array()
        res.render('auth/register.html.twig', {
            alert
        })
    } else {
        await userController.setRegistration(req, res);
        res.redirect("/");
    }
  } catch (error) {
    res.send(error);
  }
});



/* CONNEXION */

visitorRouter.get("/login", async (req, res) => {
  try {
    res.render("auth/login.html.twig");
  } catch (error) {
    res.send(error);
  }
});


visitorRouter.post("/login", async (req, res) => {
  try {
    let user = await userController.setLogin(req, res)
    if (user) {
      req.session.user = user._id
      res.redirect("/home");
    } else {
      const alert = ERROR_LOGIN;
      res.render("auth/login.html.twig",{
        alert
      });
    }
  }
  catch (error) {
    console.log(error);
    res.send(error);
  }
});


/* LOGOUT */

visitorRouter.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/');
});


/* LOSTPASSWORD TEMPORAIRE */



/* USERMANUAL */



/* CONTACT */

/* FA */
visitorRouter.get("/faq", async (req, res) => {
  try {
    res.render("faq/privacy-policy.html.twig");
  } catch (error) {
    res.send(error);
  }
}); 











export default visitorRouter;