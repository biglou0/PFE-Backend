const Agent   = require('../Models/Agent')
const bcrypt  =require('bcryptjs')
const config = require("../config.json");
const jwt    =require('jsonwebtoken')
const nodemailer = require('nodemailer');
const crypto = require('crypto');

/**--------------------Ajouter un agnet------------------------  */

const register = async (req, res) => {
    const { Nom , Prenom, email, phone,DateNaissance,gender,role ,Nationalite} = req.body;
    console.log(
      req.body.Nom
  )
  console.log(
    req.body.Prenom
)
  console.log(
  req.body.email
  )
  console.log(
  req.body.phone
  )
  console.log(
    req.body.DateNaissance
    )
    console.log(
      req.body.Nationalite
      )
  console.log(
    req.file
    )
    console.log(
        req.body.gender
        )
        console.log(
            req.body.role
            )

 
            const photoAvatarUrl = req.uploadedFiles.photoAvatar || '';
            console.log('tetsimage',photoAvatarUrl)
  
const cipher = crypto.createCipher('aes-256-cbc', 'passwordforencrypt');
let encryptedPassword = cipher.update(phone, 'utf8', 'hex');
encryptedPassword += cipher.final('hex');

    const verifUtilisateur = await Agent.findOne({ email });
    if (verifUtilisateur) {
      res.status(403).send({ message: "Agent existe deja !" });
    } else {
      const nouveauUtilisateur = new Agent();

  
      // mdpEncrypted = bcrypt.hashSync(phone,10);

      nouveauUtilisateur.Nom = Nom;
      nouveauUtilisateur.Prenom = Prenom;
      nouveauUtilisateur.email = email;
      nouveauUtilisateur.phone = phone;
      nouveauUtilisateur.password = encryptedPassword; 
      nouveauUtilisateur.photoAvatar = photoAvatarUrl;
      nouveauUtilisateur.gender = gender;
      nouveauUtilisateur.role = role;
      nouveauUtilisateur.DateNaissance = DateNaissance
      nouveauUtilisateur.Nationalite = Nationalite
      nouveauUtilisateur.isActive = true;
      console.log (
        nouveauUtilisateur
    )
    
      nouveauUtilisateur.save();
  
      // token creation
      const token = jwt.sign({ _id: nouveauUtilisateur._id }, config.token_secret, {
        expiresIn: "120000", // in Milliseconds (3600000 = 1 hour)
      });
  
      sendConfirmationEmail(email);
      res.status(201).send({ message: "success", uses: nouveauUtilisateur, "Token": jwt.verify(token, config.token_secret) });
    }
  };

  async function sendConfirmationEmail(Email) {
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
      subject: 'Transport_APP Account For Agent ',
      html: '<h3>Your Transport_APP Account Has been created. \n Email : ' +Email+ '\n Password : Your Phone Number.</h3>'
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
  const email = req.body.email;
  const password = req.body.password;
  Agent.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Error retrieving user with email " + email });
      return;
    }
    if (!user) {
      res.status(403).send({ message: "User not found with email " + email });
      return;
    }
    const decipher = crypto.createDecipher('aes-256-cbc', 'passwordforencrypt');
    let decryptedPassword = decipher.update(user.password, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');
    if (password === decryptedPassword) {
      res.json({
        role: user.role,
        email: user.email,
        password: decryptedPassword,
        id : user.id,
        Nom: user.Nom,
        Prenom: user.Prenom,
        photoAvatar : user.photoAvatar
      });
    } else {
      res.status(403).send({ message: "Password does not match!" });
    }
  });
};

  /**----------Update Agent----------------- */
  const update = (req, res, next)=>{
    const {id} = req.params
    const photoAvatarUrl = req.uploadedFiles.photoAvatar ;

    let updateData ={

  
        Nom : req.body.Nom,
        Prenom : req.body.Prenom,
        email : req.body.email,
        phone : req.body.phone,
        photoAvatar : photoAvatarUrl,
        gender:req.body.gender,
        role:req.body.role,
        Nationalite : req.body.Nationalite,
        DateNaissance : req.body.DateNaissance
    
    }
    console.log(updateData)

    Agent.findByIdAndUpdate(id , {$set :  updateData})
    .then (() =>{
        res.json({
            message : ' Agent update with succes !'
        })

    })
.catch(error =>{
    res.json({
        message : 'error with updtaing Agent !'
    })
})

}

  const updateuse = async (req,res, next) => {
    const {id} = req.params
    const {firebaseUrl} =req.file ? req.file : "";

     try{
    const adminUpdated = await Agent.findByIdAndUpdate(id,{$set:{ Firstname : req.body.Firstname, photo:firebaseUrl}})
    console.log(adminUpdated)
    console.log(adminUpdated)
    return res.status(200).send({
        message: "Agent was updated successfully!"
      })
    }catch(error){
        return res.status(500).send({err:error})
    }
   
    }


/**-----------Cherche sur un agent ------------- */


   const  searchuse = async(req,res) => {
        const id = req.params.id;
        Agent.findById(id)
          .then(data => {
            if (!data)
              res.status(404).send({ message: "Agent introuvable pour id " + id });
            else res.send(data);
          })
          .catch(err => {
            res
              .status(500)
              .send({ message: "Erreur recuperation Agent avec id=" + id });
          });
      }


//   const recupereruse = async(req,res ,data) =>{
//     Agent.find((err, data)=>{
//         res.json(data);
        
//     });
// }

const recupereruse = async(req,res,data) =>{
   
  Agent.find({ isActive: true },(err, data)=>{
    
      res.json(data);
      console.log(data)
      
  });
}

const agentdes = async(req,res,data) =>{
   
  Agent.find({ isActive: false }, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    
    console.log(data);
    res.json(data);
  });
}

const updatestatus = async (req,res, next) => {
  const {id} = req.params

   try{
  const adminUpdated = await Agent.findByIdAndUpdate(id,{$set:{isActive:false}})
  console.log(adminUpdated)

  return res.status(200).send({
      message: "Chauffeur was updated successfully!"
     
      
    })
    
  }catch(error){
      return res.status(500).send({err:error})
  }
  console.log(res)
  }


  const updatestatuss = async (req,res, next) => {
    const {id} = req.params
  
     try{
    const adminUpdated = await Agent.findByIdAndUpdate(id,{$set:{isActive:true}})
    console.log(adminUpdated)
  
    return res.status(200).send({
        message: "Agent was updated successfully!"
       
        
      })
      
    }catch(error){
        return res.status(500).send({err:error})
    }
    console.log(res)
    }
/**----------------------Supprimer un agent------------------- */


const destroy = async (req, res) => {
    const id = req.params.id;
    Agent.findByIdAndRemove(id)
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

  module.exports ={
    register, login,recupereruse,updateuse,destroy,searchuse,update,updatestatus,agentdes,updatestatuss
    }