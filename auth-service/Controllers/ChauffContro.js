const Chauffeur   = require('../Models/Chauffeur')
const bcrypt  =require('bcryptjs')
const config = require("../config.json");
const jwt    =require('jsonwebtoken')
const nodemailer = require('nodemailer');
const crypto = require('crypto');


/**--------------------Ajouter un agnet------------------------  */

const register = async (req, res) => {
    const { Nom , Prenom, email, phone,DateNaissance,gender,role ,Nationalite,licenseNo,cnicNo,address,ratingsAverage,ratingsQuantity,postalCode} = req.body;
    
 
const {firebaseUrl} =req.file ? req.file : "";


const cipher = crypto.createCipher('aes-256-cbc', 'passwordforencrypt');
let encryptedPassword = cipher.update(phone, 'utf8', 'hex');
encryptedPassword += cipher.final('hex');
  
    const verifUtilisateur = await Chauffeur.findOne({ email });
    if (verifUtilisateur) {
      res.status(403).send({ message: "Chauffeur existe deja !" });
    } else {
      const nouveauUtilisateur = new Chauffeur();

  
      mdpEncrypted = bcrypt.hashSync(phone,10);

      const nounIndex = Math.floor(Math.random() * Nom.length);
      const preIndex = Math.floor(Math.random() * Prenom.length);
      const randomNumber = Math.floor(Math.random() * 90000);

      nouveauUtilisateur.username = `${Nom[Math.floor(Math.random() * Nom.length)]}${Prenom[Math.floor(Math.random() * Prenom.length)]}${Math.floor(Math.random() * 90000)}`;
      nouveauUtilisateur.Nom = Nom;
      nouveauUtilisateur.Prenom = Prenom;
      nouveauUtilisateur.email = email;
      nouveauUtilisateur.phone = phone;
      nouveauUtilisateur.password = encryptedPassword; 
      nouveauUtilisateur.photoAvatar = firebaseUrl;
      // nouveauUtilisateur.photoCin = req.file;
      // nouveauUtilisateur.photoPermis = firebaseUrl;
      ///nouveauUtilisateur.photoVtc = firebaseUrl;
      nouveauUtilisateur.gender = gender;
      nouveauUtilisateur.role = "Chauffeur";
      nouveauUtilisateur.DateNaissance = DateNaissance
      nouveauUtilisateur.Nationalite = Nationalite
      nouveauUtilisateur.licenseNo = licenseNo
      nouveauUtilisateur.cnicNo = cnicNo
      nouveauUtilisateur.address = address
      // nouveauUtilisateur.ratingsAverage = ratingsAverage
      // nouveauUtilisateur.ratingsQuantity = ratingsQuantity
      nouveauUtilisateur.postalCode = postalCode
      nouveauUtilisateur.isActive = true;
  
      console.log (
        nouveauUtilisateur
    )

    console.log(firebaseUrl)
    
      nouveauUtilisateur.save();
  
      console.log(
        mdpEncrypted
      )
      // token creation
      const token = jwt.sign({ _id: nouveauUtilisateur._id }, config.token_secret, {
        expiresIn: "120000", // in Milliseconds (3600000 = 1 hour)
      });
  
      sendConfirmationEmail(email , Nom[nounIndex]+Prenom[preIndex]+randomNumber);
      res.status(201).send({ message: "success", uses: nouveauUtilisateur, "Token": jwt.verify(token, config.token_secret) });
    }
  };




  
  async function sendConfirmationEmail(Email ,Username) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'louay.kasdallah12@gmail.com',
        pass: 'tpteyexpxgzjeqac'
      }
    });
  
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        console.log("Server not ready");
      } else {
        console.log("Server is ready to take our messages");
      }
    });
  

  
    const mailOptions = {
      from: 'Transport_APP<louay.kasdallah12@gmail.com>',
      to: Email,
      subject: 'Transport_APP Compte Pour Chauffeur ',
      html: '<h3>Your Transport_APP Account Has been created. \n Username : ' +Username+ '\n Password : Your Phone Number.</h3>'
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  

/**--------------Login Admin-------------------- */
  
  const login = (req, res) => {


    console.log(
      req.body.email
    )
  
    console.log(
      req.body.password
    )
  
  
  
  
    var email = req.body.email
    var password = req.body.password
    Chauffeur.findOne({ email: email }, function (err, user) {
  
      if (err) {
        console.log(err);
      }
  
  
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err
            })
          }
  
          if (result) {
            let token = jwt.sign({ Firstname: user.Firstname }, 'verysecretValue', { expiresIn: '1h' })
           
            
            return res.json({
  
              Firstname: user.Firstname,
              Lastname: user.Lastname,
              email: user.email,
              phone: user.phone,
              password: user.password,
         
              token
  
  
  
  
            })
            
            
          } else {
            res.status(403).send({ message: "password does not matched !" });
  
          }
        })
  
  
      } else {
        res.status(403).send({ message: "Wrong email adress!" });
  
  
  
  
  
      }

      
    })

  
  }

  /**----------Update Agent----------------- */
  const update = (req, res, next)=>{
    const {id} = req.params
    const {firebaseUrl} =req.file ? req.file : "";
    let updateData ={

  
        Nom : req.body.Nom,
        Prenom : req.body.Prenom,
        email : req.body.email,
        phone : req.body.phone,
        photoAvatar : firebaseUrl,
        gender:req.body.gender,
        role:req.body.role,
        Nationalite : req.body.Nationalite,
        DateNaissance : req.body.DateNaissance,
       licenseNo : req.body.licenseNo,
       cnicNo : req.body.cnicNo,
       address : req.body.address,
      postalCode : req.body.postalCode,
    
    }
    console.log(updateData)

    Chauffeur.findByIdAndUpdate(id , {$set :  updateData})
    .then (() =>{
        res.json({
            message : ' Chauffeur  update with succes !'
        })

    })
.catch(error =>{
    res.json({
        message : 'error with updtaing Agent !'
    })
})

}

  const updatestatus = async (req,res, next) => {
    const {id} = req.params

     try{
    const adminUpdated = await Chauffeur.findByIdAndUpdate(id,{$set:{isActive:false}})
    console.log(adminUpdated)

    return res.status(200).send({
        message: "Chauffeur was updated successfully!"
       
        
      })
      
    }catch(error){
        return res.status(500).send({err:error})
    }
    console.log(res)
    }


    const chauffdes = async(req,res,data) =>{
   
      Chauffeur.find({ isActive: false }, (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        
        console.log(data);
        res.json(data);
      });
    }
    

/**-----------Cherche sur un agent ------------- */


   const  searchuse = async(req,res) => {
        const id = req.params.id;
        Chauffeur.findById(id)
          .then(data => {
            if (!data)
              res.status(404).send({ message: "Agent introuvable pour id " + id });
            else res.send(data);
            console.log(data)
          })
          .catch(err => {
            res
              .status(500)
              .send({ message: "Erreur recuperation Agent avec id=" + id });
          });

          
      }


      //   const recupereruse = async(req,res ,data) =>{
//     Chauffeur.find((err, data)=>{
//         res.json(data);
        
//     });
// }

const recupereruse = async(req,res,data) =>{
   
  Chauffeur.find({ isActive: true },(err, data)=>{
    
      res.json(data);
      console.log(data)
      
  });
}

/**----------------------Supprimer un agent------------------- */


const destroy = async (req, res) => {
    const id = req.params.id;
    Chauffeur.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer Agent avec id=${id}. velo est possiblement introuvable!`
        });
      } else {
        res.send({
          message: "Agent supprimée avec succès!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Impossible de supprimer Agent avec id=" + id
      });
    });
    }

    const updatestatuss = async (req,res, next) => {
      const {id} = req.params
    
       try{
      const adminUpdated = await Chauffeur.findByIdAndUpdate(id,{$set:{isActive:true}})
      console.log(adminUpdated)
    
      return res.status(200).send({
          message: "Chauffeur was updated successfully!"
         
          
        })
        
      }catch(error){
          return res.status(500).send({err:error})
      }
      console.log(res)
      }
    

  module.exports ={
    register, login,recupereruse,destroy,searchuse,update,updatestatus,chauffdes,updatestatuss
    }