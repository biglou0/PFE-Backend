var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');




const mongoose  = require('mongoose')
const morgan    = require('morgan')
const bodyParser = require('body-parser')
const config = require("./config.json");

const Agentchauff = require  ('./routes/ChauffeurRoute');
const con = require ('./routes/ContactRoute');
const Voi = require ('./routes/VoitureRoutes');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


mongoose.connect(config.database,{useNewUrlParser : true , useUnifiedTopology:true})
const db  = mongoose.connection

db.on('error',(err) =>{
    console.log(err)
} )

db.once('open', ()=> {
    console.log('DB Connection Estabblished !')
  
})


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}



app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/Chauff',Agentchauff);
app.use('/Voi',Voi);
app.use('/Con',con);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
