const mongoose = require('mongoose');

const tarifSchema = new mongoose.Schema({
  tarif: {
    type: String,
    required: true
  },
  tarifmaj: {
    type: String,
    
  },
  
  // Add other properties specific to your tariff model if needed
});

const Tarifs = mongoose.model('Tarif', tarifSchema);

module.exports = Tarifs;
