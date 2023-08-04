const Contact  = require("../Models/Contact")
 
exports.add = async (req, res) => {
    const {Nom, Prenom, Email,Cin, Tel , Message} = req.body

 

    let contact = await new Contact({
        Nom,
        Prenom,
        Email,
        Cin,
        Tel,
        Message,
        status:"En_cours",
       
        isActive : true,
    }).save()

    return res.status(200).send({message: "Contact us added successfully", contact});
}

exports.getAll = async(req,res ,data) =>{
    Contact.find((err, data)=>{
        res.json(data);
        
    });
}