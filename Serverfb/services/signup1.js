var mongo = require('./mongodbconnection');
var MongoClient = require('mongodb').MongoClient;

exports.handle_request = function(msg, callback){
	var res = {};
	MongoClient.connect("mongodb://root:root@ds045704.mongolab.com:45704/273sample/", function(err, db) {
		  if(err) {
		    console.log("Error");
		  }else{
			  console.log("Succesful connection");
			  var collection = db.collection('users');
			  collection.insert( msg, function(err,result){
				  if(err) {
			            console.log(err);
			            res.code = "401";
						res.value = "Failed Signup";
			            res.render("failure",{title: 'Failure'});
			        }
			        else {
			        	res.code = "200";
						res.value = "Success Signup";           
			        }	  
					//Close connection
				      db.close();
				      callback(null, res);
			  }); 
		  }   
	});
}