var express = require('express');
var router = express.Router();

var Users = require('../../models/users');

router.get('/', function(req, res, next) {

  Users.find({},function(err, users){

    if(err){
     return res.json({'success':false, 'error': err});
    }

    return res.json({'success':true, 'users': users});

  });

});

router.get('/:userId', function(req,res){

  var userId = req.params.userId;
  Users.findOne({'_id':userId}, function(err, user){
    if(err){
      return res.json({'success':false, 'error': err});
    }
     return res.json({'success':true, 'user': user});
   });

 });

//~line 32 before routes
app.use(require('express-session')({
  //Define the session store
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  //Set the secret
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    domain: config.cookie.domain,
    //httpOnly: true,
    //secure: true,
    maxAge:3600000 //1 hour
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null,{
    id: user._id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name
  });
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

 router.post('/', function(req, res) {

  Users.create(new Users({
    username: req.body.username,
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name
  }), function(err, user){

    if(err){
      return res.json({success: false, user: req.body, error: err});
    }

    return res.json({success: true, user: user});

  });

});

router.put('/', function(req, res){

  Users.findOne({'_id': req.body._id}, function(err, user){

   if(err) {
     return res.json({success: false, error: err});
   }

   if(user) {

    let data = req.body;

    if(data.username){
      user.username = data.username;
    }

    if(data.email){
      user.email = data.email;
    }

    if(data.first_name){
      user.first_name = data.first_name;
    }

    if(data.last_name){
      user.last_name = data.last_name;
    }

    user.save(function(err){
      if(err){
        return res.json({success: false, error: err});
      }else{
        return res.json({success: true, user:user});
      }
    });

   }

  });

});

router.delete('/:userId', function(req,res){

  var userId = req.params.userId;

  Users.remove({'_id':userId}, function(err,removed){

    if(err){
      return res.json({success: false, error: err});
    }

    return res.json({success: true, status: removed});

  });

});

module.exports = router;

