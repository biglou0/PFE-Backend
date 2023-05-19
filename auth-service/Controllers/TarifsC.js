const Chauffeur = require("../Models/Chauffeur");
const Tarifs = require ("../Models/Tarifs")

exports.addTarifAndUpdateChauffeurs = async (req, res, next) => {
    const { tarifName } = req.body;
  
    try {
      const existingTarif = await Tarifs.findOne();
  
      // Step 1: Check if the Tarif table is not empty
      if (existingTarif) {
        // Step 2: Update the existing tariff
        existingTarif.tarif = tarifName;
        const updatedTarif = await existingTarif.save();
        const tariffId = updatedTarif._id;
        
        // Step 3: Update the chauffeur table to add the updated tariff ID to all chauffeurs
        const updateResult = await Chauffeur.updateMany({}, { $set: { tarif: tariffId } });
  
        console.log(`Updated ${updateResult.nModified} chauffeurs`);
  
        return res.status(200).send({
          message: "Existing tariff updated and chauffeurs updated!"
        });
      }
  
      // Step 4: Create a new tariff entry if the Tarif table is empty
      const newTarif = new Tarifs({ tarif: tarifName });
      const savedTarif = await newTarif.save();
      const tariffId = savedTarif._id;
  
      // Step 5: Update the chauffeur table to add the tariff ID to all chauffeurs
      const updateResult = await Chauffeur.updateMany({}, { $set: { tarif: tariffId } });
  
      console.log(`Updated ${updateResult.nModified} chauffeurs`);
  
      return res.status(200).send({
        message: "Tarif added and chauffeurs updated!"
      });
  
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  };
  
  
  