const Chauffeur   = require('../Models/Chauffeur')
const bcrypt  =require('bcryptjs')
const config = require("../config.json");
const jwt    =require('jsonwebtoken')
const nodemailer = require('nodemailer');



/**--------------------Ajouter un agnet------------------------  */

const register = async (req, res) => {
    const { Nom , Prenom, email, phone,DateNaissance,gender,role ,Nationalite,cnicNo,address,ratingsAverage,ratingsQuantity,postalCode} = req.body;
    
 
// const {firebaseUrl} =req.file ? req.file : "";


const photoAvatarUrl = req.uploadedFiles.photoAvatar || '';
const photoPermisRecUrl = req.uploadedFiles.photoPermisRec || '';
const photoPermisVerUrl = req.uploadedFiles.photoPermisVer || '';
const photoVtcUrl = req.uploadedFiles.photoVtc || '';
const photoCinUrl = req.uploadedFiles.photoCin || '';



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
      nouveauUtilisateur.password = mdpEncrypted; 
      nouveauUtilisateur.photoAvatar = photoAvatarUrl;
       nouveauUtilisateur.photoCin = photoCinUrl;
      nouveauUtilisateur.photoPermisRec = photoPermisRecUrl;
      nouveauUtilisateur.photoPermisVer = photoPermisVerUrl;
      nouveauUtilisateur.photoVtc = photoVtcUrl;
      nouveauUtilisateur.gender = gender;
      nouveauUtilisateur.role = "Chauffeur";
      nouveauUtilisateur.Cstatus = "En_cours";
      nouveauUtilisateur.DateNaissance = DateNaissance
      nouveauUtilisateur.Nationalite = Nationalite
      nouveauUtilisateur.cnicNo = cnicNo
      nouveauUtilisateur.address = address
      // nouveauUtilisateur.ratingsAverage = ratingsAverage
      // nouveauUtilisateur.ratingsQuantity = ratingsQuantity
      nouveauUtilisateur.postalCode = postalCode
      nouveauUtilisateur.isActive = true;
      
  
      console.log (
        nouveauUtilisateur
    )


    
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
  const username= req.body.username;
  const password = req.body.password;
  Chauffeur.findOne({ username: username }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Error retrieving user with username " + username });
      return;
    }
    if (!user) {
      res.status(403).send({ message: "User not found with email " + username });
      return;
    }

   
    if (bcrypt.compare(password, user.password)) {
      res.json({
        role: user.role,
        email: user.email,
        password: user.password,
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
    const photoPermisRecUrl = req.uploadedFiles.photoPermisRec ;
    const photoPermisVerUrl = req.uploadedFiles.photoPermisVer ;
    const photoVtcUrl = req.uploadedFiles.photoVtc ;
    const photoCinUrl = req.uploadedFiles.photoCin ;
    let updateData ={

  
        Nom : req.body.Nom,
        Prenom : req.body.Prenom,
        email : req.body.email,
        phone : req.body.phone,
        photoAvatar : photoAvatarUrl,
        photoCin : photoCinUrl,
        photoPermisRec : photoPermisRecUrl,
        photoPermisVer : photoPermisVerUrl,
        photoVtc : photoVtcUrl,
        gender:req.body.gender,
        role:req.body.role,
        Nationalite : req.body.Nationalite,
        DateNaissance : req.body.DateNaissance,
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
        message : 'error with updtaing Chauffeur !'
    })
})

}

const updatestatus = async (req, res, next) => {
  const { id } = req.params;

  try {
    const chauffeurUpdated = await Chauffeur.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
          Cstatus: "Désactivé"
        }
      }
    );

    if (!chauffeurUpdated) {
      return res.status(404).send({
        message: "Chauffeur not found!"
      });
    }

    console.log(chauffeurUpdated);

    return res.status(200).send({
      message: "Chauffeur was Disabled successfully!"
    });

  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
const Comptevald = async (req, res, next) => {
  const { id } = req.params;

  try {
    const chauffeurUpdated = await Chauffeur.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: true,
          Cstatus: "Validé"
        }
      }
    );

    if (!chauffeurUpdated) {
      return res.status(404).send({
        message: "Chauffeur not found!"
      });
    }

    console.log(chauffeurUpdated);

    return res.status(200).send({
      message: "Chauffeur was updated successfully!"
    });

  } catch (error) {
    return res.status(500).send({ error: error });
  }
};



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


        const recupereruse = async(req,res ,data) =>{
          Chauffeur.find(
            { Cstatus: { $in: ["Validé", "Désactivé"] } },
            (err, data) => {
              if (err) {
                console.error(err);
                res.status(500).send("An error occurred");
              } else {
                res.json(data);
                console.log(data);
              }
            }
          );
}

// const recupereruse = async(req,res,data) =>{
   
//   Chauffeur.find({ isActive: true },(err, data)=>{
    
//       res.json(data);
//       console.log(data)
      
//   });
// }

const recuperernewchauf = async (req, res, data) => {
  Chauffeur.find({ Cstatus: "En_cours" }, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    } else {
      res.json(data);
      console.log(data);
    }
  });
};

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

    const updatestatuss = async (req, res, next) => {
      const { id } = req.params;
    
      try {
        const chauffeurUpdated = await Chauffeur.findByIdAndUpdate(
          id,
          {
            $set: {
              isActive: true,
              Cstatus: "Validé"
            }
          }
        );
    
        if (!chauffeurUpdated) {
          return res.status(404).send({
            message: "Chauffeur not found!"
          });
        }
    
        console.log(chauffeurUpdated);
    
        return res.status(200).send({
          message: "Chauffeur was Disabled successfully!"
        });
    
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    };
    

  module.exports ={
    register, login,recupereruse,destroy,searchuse,update,updatestatus,chauffdes,updatestatuss,Comptevald,recuperernewchauf
    }