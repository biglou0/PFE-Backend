const express = require('express')
const  router = express.Router()


const Tarif  = require('../Controllers/TarifsC')


router.get('/show', Tarif.showtarifs)






module.exports = router