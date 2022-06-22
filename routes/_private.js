var express = require('express');
const { Pool } = require("pg");

const { getTopics } = require('./Fetch.js');

var dashboardRouter = express.Router();
var triviaRouter = express.Router();
var productsRouter = express.Router();
var debugRouter = express.Router();
var logoutRouter = express.Router();

app = express();

//Add this function as middleware for your restricted routes
function restrict(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.session.error = 'Access denied!';
      res.redirect('/login');
    }
  }

  dashboardRouter.get('/', restrict, async function(req, res, next) {
    const pool = new Pool({
      user: "fxngyvob",
      host: "suleiman.db.elephantsql.com",
      database: "fxngyvob",
      password: "xK1LgvxhElyW2xo1Xo_FqDmAfuspS6dI",
      port: 5432
    });
    try {
      var dashboard_data = {}
  
      var sql_search = `SELECT * FROM "public"."favorite_topics" LIMIT 100`;
      var result = await pool.query(sql_search);
    
      if(result.rowCount) {
        //console.log("Quotes Found");
        topicsObject = result.rows;
        var randNum = Math.floor(Math.random() * topicsObject.length);
        topicObject = topicsObject[randNum];
        //console.log(topicObject)
      }
      else {
        console.log('Quotes Not Found')
        topicsObject = {};
        topicObject = {};
      }
  
      sql_search = `SELECT * FROM "public"."favorites" LIMIT 100`;
      result = await pool.query(sql_search);
  
      if(result.rowCount) {
        //console.log("Favorites Found");
        favoritesObject = result.rows;
        //console.log(favoritesObject);

        var randArray = []
        for(var i=0; i<30; i++) {
          var randNum = Math.floor(Math.random() * favoritesObject.length);
            if(randArray.indexOf(randNum) === -1) {
                randArray.push(randNum);
            }
            if(randArray.length === 3) break;
        }
        //console.log(randArray);
      }
      else {
        console.log('Favorites Not Found')
        favoritesObject = {};
        randArray = [];
      }

      getTopics.getQuote()
      .then(quote => {
        //console.log(quote);
        if(quote['quoteText']) {
          var quote = quote['quoteText'];
          var quoteAuthor = quote['quoteAuthor'];
        }
        else {
          quote = "Quote Description";
          quoteAuthor = "Quote Author";
        }
        getTopics.getImages(topicObject.topic)
        .then(Image_list => {
          //console.log(Image_list);
          var photoCount = Image_list['total_results'];
          //console.log(photoCount);
          var randomPictureId = Math.floor(Math.random() * photoCount)
          //console.log(randomPictureId);
          if(photoCount > 0) {
            getTopics.getImage(randomPictureId, topicObject.topic)
            .then(Image => {
              //console.log(Image);
              var imageMedium = Image['photos'][0]['src']['medium'];
              var imageUrl = Image['photos'][0]['url'];
              var photographerUrl = Image['photos'][0]['photographer_url'];
              var photographerName = Image['photos'][0]['photographer'];

              res.render('dashboard', {
                title: 'Family Favorites - Dashboard',
                topicObject,
                topicsObject,
                favoritesObject,
                randArray,
                imageMedium,
                imageUrl,
                photographerUrl,
                photographerName,
                quote,
                quoteAuthor
              })
            }) 
          }
          else {
            imageMedium = "https://images.pexels.com/photos/5088490/pexels-photo-5088490.jpeg?auto=compress&cs=tinysrgb&h=350";
            imageUrl = "https://www.pexels.com/photo/woman-in-black-long-sleeve-shirt-sitting-beside-woman-in-black-long-sleeve-shirt-5088490/";
            photographerUrl = "https://www.pexels.com/@cottonbro";
            photographerName = "cottonbro";
            
            res.render('dashboard', {
              title: 'Family Favorites - Dashboard',
              topicObject,
              topicsObject,
              favoritesObject,
              randArray,
              imageMedium,
              imageUrl,
              photographerUrl,
              photographerName,
              quote,
              quoteAuthor
            })
          }
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    catch (err) {
      console.error(err.message);
    }
  });
  
  dashboardRouter.post('/', restrict, function(req, res, next) {
    //console.log(req.body)
    const pool = new Pool({
      user: "fxngyvob",
      host: "suleiman.db.elephantsql.com",
      database: "fxngyvob",
      password: "xK1LgvxhElyW2xo1Xo_FqDmAfuspS6dI",
      port: 5432
    });
  
    try {
      let username = "Juan Johnson";
      let topic = req.body.topic;
      let favorite = req.body.favorite;
      let comments = req.body.comments;
  
      const sql_insert = `INSERT INTO favorites (username, topic, favorite, comments) 
      VALUES ($1, $2, $3, $4);`;
      let values = [username, topic, favorite, comments];
      let result = pool.query(sql_insert, values)
      //result.then(result => {console.log(result);});
      res.redirect('/dashboard');
  
    }
    catch (err) {
      console.error(err.message);
      res.redirect('/dashboard');
    }
  });

triviaRouter.get('/', restrict, function(req, res, next) {
    app.locals.title = 'Family Favorites - Trivia Game';
    res.render('trivia', { title: 'Family Favorites - Trivia Game' });
});

triviaRouter.post('/', restrict, function(req, res, next) {
    app.locals.title = 'Family Favorites - Trivia Game';
    username = req.body.username;
    console.log(app.locals);
    res.render('debug', {
        _username: username, 
  });
});

productsRouter.get('/', restrict, function(req, res, next) {
    app.locals.title = 'Family Favorites - Products';
    res.render('products', { title: 'Family Favorites - Family Products' });
});

productsRouter.post('/', restrict, function(req, res, next) {
    app.locals.title = 'Family Favorites - Products';    
    username = req.body.username;
    console.log(app.locals);
    res.render('debug', {
        _username: username, 
  });
});

debugRouter.get('/', restrict, function(req, res, next) {
    app.locals.title = 'Family Favorites - Debug Page';
    res.render('debug', { title: 'Family Favorites - Debug Page' });
});

debugRouter.post('/', restrict, function(req, res, next) {
    app.locals.title = 'Family Favorites - Debug Page';
    username = req.body.username;
    console.log(app.locals);
    res.render('debug', {
        _username: username, 
  });
});

logoutRouter.get('/', restrict, function(req, res, next) {
    app.locals.title = 'Family Favorites - Logout';
    req.session.destroy(function(){
        res.redirect('/');
      });
  });
  
logoutRouter.post('/', restrict, function(req, res, next) {
    app.locals.title = 'Family Favorites - Logout';
    username = req.body.username;
    console.log(app.locals);
    req.session.destroy(function(){
        res.redirect('/');
      });
});
  
  
module.exports.logoutRouter = logoutRouter;
module.exports.triviaRouter = triviaRouter;
module.exports.dashboardRouter = dashboardRouter;
module.exports.productsRouter = productsRouter;
module.exports.debugRouter = debugRouter;