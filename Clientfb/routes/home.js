exports.home = function(req, res){
  res.render('home', { name:req.session.user.firstname+" "+req.session.user.lastname });
};
