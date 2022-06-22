var express = require('express');
const { Pool } = require("pg");
const flash = require('connect-flash');
var path = require('path');
var session = require('express-session');
var nodemailer = require('nodemailer')

var reguser = require('../models/User');
const { info } = require('console');
var userProfile = reguser.regUser;

var indexRouter = express.Router();
var contactRouter = express.Router();
var registrationRouter = express.Router();
var loginRouter = express.Router();

//var app = require('../app');
app = express();

//Index Router//////////////////////////////////////////////////////////
indexRouter.get('/', function(req, res, next) {
    app.locals.title = 'Family Favorites - Welcome';
    //console.log(app.locals);
    res.render('index', {
        title: 'Family Favorites - Welcome' 
    });
});

indexRouter.post('/', function(req, res, next) {
    app.locals.title = 'Family Favorites - Welcome';
    username = req.body.username;
    //console.log(app.locals);
    res.render('debug', {
        _username: username, 
  });
});
//Contact Router//////////////////////////////////////////////////////////
contactRouter.get('/', function(req, res, next) {
    let help_block = "";
    app.locals.title = 'Family Favorites - Contact Me';    
    res.render('contact', { 
      title: 'Family Favorites - Contact Me',
      help_block
   });
});

contactRouter.post('/', function(req, res, next) {
    app.locals.title = 'Family Favorites - Contact Me'; 
    let help_block = "";    
    username = req.body.username;
    email = req.body.email;
    phone = req.body.phone;
    comments = req.body.comments;


    var transporter = nodemailer.createTransport({
      host: 'in-v3.mailjet.com',
      port: 465,
      secure: true,
      auth: {
        user: 'f6fd294a103a7c7c3a78ef8944c0b93a',
        pass: '8a474f26e541b5d97c795b13f8fbbbb1'
      }
    });
    
    var mailOptions = {
      from: '<jejlifestyle@theaccidentallifestyle.net>',
      to: 'ericrenee21@gmail.com',
      subject: 'Family Favorites - Contact Me',
      text: comments
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


    res.render('contact', { 
      title: 'Family Favorites - Contact Me',
      help_block: "Email Sent: "
   });
});
//Registration Router//////////////////////////////////////////////////////
registrationRouter.get('/', function(req, res, next) {
  //console.log(req); console.log(res);
  app.locals.title = 'Family Favorites - Registration';
  //console.log(app.locals);
  let help_block1 = "";
  let help_block2 = "";
  let help_block3 = 'Please enter at least 6 characters for your password';
  let help_block4 = "";
  res.render('registration', {
      title: 'Family Favorites - Registration',
      help_block1,
      help_block2,
      help_block3,
      help_block4 
    });
});

registrationRouter.post('/', function(req, res, next) {
  //console.log(req); console.log(res);
  app.locals.title = 'Family Favorites - Registration';
  //console.log(app.locals);
  //Immediately capture all the values from the request(req) object
  //gathered from the submitted post object
  let username = req.body.name;
  let email = req.body.email;
  let password1 = req.body.password1;
  let password2 = req.body.password2;
  //Clear all of the help blocks to log new potential validation errors
  let help_block1 = "";
  let help_block2 = "";
  let help_block3 = "";
  let help_block4 = "";

  //create a error key:value object array to list errors on submission
  let errors = []
  //create a message variable/object to capture and console.log messages
  let mssg
  
  //Series of "Client Side" Validations
  //Check if all required fields are filled <input required/>
  if(!username || !email || !password1 || !password2) {
    //Using array push method to add message to error array
    errors.push({mssg: 'Please fill in all fields'})
    help_block1 = "Please fill in all fields";
    help_block2 = "Please fill in all fields";
  }
  //Check if password length is within range <input minlength='3' maxlength='15'/>
  if(password1.length < 6) {
    //Using array push method to add message to error array
    errors.push({mssg: 'Please enter at least 6 characters for the password'})
    help_block3 = "Please enter at least 6 characters for the password";
  }

  //Series of "Server Side Validations"
  //Check if passwords match
  if(password1 !== password2) {
    //Using array push method to add message to error array
    //check if password length is greater than 6 characters
    errors.push({mssg: 'Please enter same passwords'})
    help_block4 = "Please enter same passwords";
  }

  //Check if any errors were added to the error[] array by checking its length
  //Note: Using once 'sense=length' probed to verify another 'sense=errors'
  if(errors.length > 0) {
    //Render the individual help blocks for each error
    //Later: Render in an alert box above the form as dismissals
    res.render('registration', {
        title: 'Family Favorites - Registration',
        help_block1,
        help_block2,
        help_block3,
        help_block4 
     });
  }
  else {
    //If no errors, then start processing the submission data
    //Create a new connection to the data base
    //Later: Create a function/object/module for this step
    var myUser = new userProfile();
    if(myUser.put_user(username, email, password1)) {
      res.redirect('/login');
    }
    else {
      let help_block1 = "";
      let help_block2 = "";
      let help_block3 = 'Please enter at least 6 characters for your password';
      let help_block4 = "";
      res.render('registration', {
          title: 'Family Favorites - Registration',
          help_block1,
          help_block2,
          help_block3,
          help_block4 
        });
    }
  }
});
//Login Router//////////////////////////////////////////////////////////
loginRouter.get('/', function(req, res, next) {
    app.locals.title = 'Family Favorites - Login';
    res.render('login', { 
      title: 'Family Favorites - Login'});
});

loginRouter.post('/', function(req, res, next){
  myUser = new userProfile;
  myUser.authenticate_user(req.body.username, req.body.password,
    //Callback Function that "We Write"
    //This callback is either supplied a user or an error
    //by the authentication process - user exist and password match 
    function(err, user) {
      //console.log("User Object Passed to app.post: ", user);
      if (user) {
        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(function(){
          // Store the user's primary key
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = user;
          req.session.success = 'Authenticated as ' + user.username
            + ' click to <a href="/logout">logout</a>. '
            + ' You may now access <a href="/dashboard">/restricted</a>.';
          res.redirect('/dashboard');
        });
      } else {
        req.session.error = 'Authentication failed, please check your '
          + ' username and password.';
        res.redirect('/login');
      }
    }//end Callback Function
  );
});

module.exports.indexRouter = indexRouter;
module.exports.contactRouter = contactRouter;
module.exports.registrationRouter = registrationRouter;
module.exports.loginRouter = loginRouter;