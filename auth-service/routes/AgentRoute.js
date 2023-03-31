const express = require('express')
const  router = express.Router()


const AuthController  = require('../Controllers/AgentContro')

const UploadImage = require ("../services/firebase");

const multer = require('multer')

const Multer = multer({
  storage:multer.memoryStorage(),
  limits:1024 * 1024,
})


router.get('/affiche', AuthController.recupereruse)



router.delete('/destroyAg/:id', AuthController.destroy);
 
router.post('/AjoutAg',Multer.single("photoAvatar"),UploadImage,AuthController.register)
router.post('/loginAg',AuthController.login)
router.get('/searchAg/:id', AuthController.searchuse);
router.get('/getAg', AuthController.recupereruse);
router.get('/getAgdes', AuthController.agentdes);
router.put('/updateAg/:id',Multer.single("photoAvatar"),UploadImage, AuthController.update);
router.put('/updatestatus/:id', AuthController.updatestatus);
router.put('/updatestatuss/:id', AuthController.updatestatuss);



module.exports = router