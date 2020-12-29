var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
// import Pusher from 'pusher';
var Pusher = require('pusher');
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/api/messages');
var usersRouter = require('./routes/api/users');
var config = require('config');
var cors = require("cors");
var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const pusher = new Pusher({
  appId: "1129126",
  key: "1d0c2b10507144f2573d",
  secret: "5c0204d3b620f3df137a",
  cluster: "ap2",
  useTLS: true
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

mongoose
  .connect(config.get("db"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongo...."))
  .catch((error) => console.log(error.message));

  const db = mongoose.connection;
db.once('open', ()=>{
    console.log("DB connected");
    const userCollection = db.collection("users");
    const userChangeStram = userCollection.watch();
    userChangeStram.on("change", (change)=>{
      const userDetails = change.fullDocument;
        if(change.operationType === 'insert' ){
            
            pusher.trigger('users', 'inserted', {
                name: userDetails.name,
                email: userDetails.email,
                password: userDetails.password,
                role: userDetails.role,
                last_scene: userDetails.last_scene,

            });
        }
        else if(change.operationType === 'update'){
          console.log(change);
          pusher.trigger('users', 'updated', 
                change.documentKey._id,
            );
        } 
        else {
            console.log("Error triggering Pusher");
        }
    });
    const msgCollection = db.collection("messages");
    const changeStram = msgCollection.watch();
    changeStram.on("change", (change)=>{
        console.log("A change occur   "+change);
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                user_to: messageDetails.user_to,
                user_from: messageDetails.user_from,
                body: messageDetails.body,
                date: messageDetails.date,
                time: messageDetails.time,
                opened: messageDetails.opened,
                viewed: messageDetails.viewed,
                deleted: messageDetails.deleted,

            });
        }else if(change.operationType === 'update'){
          console.log(change);
          pusher.trigger('messages', 'updated', 
                change.documentKey._id,
            );
        }  
        else {
            console.log("Error triggering Pusher");
        }
    });
});


module.exports = app;

