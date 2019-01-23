var express = require('express');
var router = express.Router();
var Articles = require('../models/articles');
var today = new Date();

router.get('/app', function(req, res, next) {
  res.render('articles/app', { title: 'Blog Management' });
});

console.log(today);
router.get('/', function(req, res, next) {

  Articles.find({published:{"$lte":today}},function(err, articles){
    if(err)
    {
      return handleError(err);
    }
    else{
      return res.render('articles/index', { title: 'Blog' , articles:articles});
    }
  });

});

router.get('/:slug', function(req, res, next) {
  Articles.findOne({slug:req.params.slug},function(err, articles){
    if(err)
    {
      return handleError(err);
    }
    else{
      return res.render('articles/view', { title: 'Post' , article:articles});
    }
  });
});


module.exports = router;
