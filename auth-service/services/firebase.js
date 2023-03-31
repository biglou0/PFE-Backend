
var admin = require("firebase-admin");

var serviceAccount = require("../firebase-key.json");

const BUCKET ="imagestor-768b5.appspot.com"
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:BUCKET
});


const bucket = admin.storage().bucket();

const UploadImage = (req,res,next)=>{

    if (!req.file)return next();

    const photo = req.file;

    const nomeArquivo = Date.now() + "." + photo.originalname.split(".").pop();

    const file = bucket.file(nomeArquivo);

    const stream = file.createWriteStream({
        metadata:{
            contentType: photo.mimetype,
        },
    });

    stream.on("error",(e) =>{
        console.error(e);
    })


    stream.on("finish", async () =>{
        await file.makePublic();

        req.file.firebaseUrl =`https://storage.googleapis.com/${BUCKET}/${nomeArquivo}`;

        next();
    })

    stream.end(photo.buffer);
}

module.exports = UploadImage;
