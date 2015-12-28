var mongo = require('./mongodbconnection');
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

function handle_request(msg, callback){
	
	var res = {};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
		  var collection = db.collection('user');
		  console.log(msg);
		  collection.findOne({username: msg.username},
		  function (err, user) {
			  console.log(user);
			  if (err) {
		        console.log(err);
		        res.code = "401";
				res.value = "Failed Login";
		      } else if (user && bcrypt.compareSync(msg.password, user.password)) {
		    	  console.log("login");
		        res.code = "200";
				res.value = "Success Login";
				res.result = user;
				
		      } else {
		        res.code = "401";
				res.value = "Failed Login";
		      }
		      //Close connection
		      db.close();
		      callback(null, res);
		  })
	  }
	});
}
exports.handle_request = handle_request;

exports.logout = function(req, res){
	req.facebook.destroy();
	res.render("login",{"error":""});
	};