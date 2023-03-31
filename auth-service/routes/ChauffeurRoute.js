const express = require('express')
const  router = express.Router()


const ChauffContro  = require('../Controllers/ChauffContro')

const UploadImage = require ("../services/firebase");


const multer = require('multer')

const Multer = multer({
  storage:multer.memoryStorage(),
  limits:1024 * 1024,
})


router.get('/affiche', ChauffContro.recupereruse)

router.get('/getchdes', ChauffContro.chauffdes)



router.delete('/destroychauff/:id', ChauffContro.destroy);
 
router.post('/AjoutChauf',Multer.single("photoAvatar"),UploadImage,ChauffContro.register)

// router.post('/AjoutChauf',Multer.fields([
//   { name: "photoAvatar", maxCount: 1  },
//   { name: "photoPermis", maxCount: 1  },

// ]),UploadImage,ChauffContro.register)


//router.post('/loginAg',AuthController.login)
router.get('/searchchauf/:id', ChauffContro.searchuse);
//router.get('/getAg', AuthController.recupereruse);
router.put('/updatechauf/:id',Multer.single("photoAvatar"),UploadImage, ChauffContro.update);
router.put('/updatestatus/:id', ChauffContro.updatestatus);
router.put('/updatestatuss/:id', ChauffContro.updatestatuss);



module.exports = router