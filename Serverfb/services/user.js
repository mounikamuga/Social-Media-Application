var mongo = require('./mongodbconnection');
var MongoClient = require('mongodb').MongoClient;
var util = require("util");

exports.getallusers = function(msg, callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
		  var collection = db.collection('user');
		  var search = msg.search;
		  collection.find({

			    "$and": [{
			    	"$or": [{
			    			 lastname: new RegExp(search)
					    }, {
					    	 firstname: new RegExp(search)
					    }],
			    }, {
			        "userid": {$ne:msg.userid}
			    }]
		  },{password:0}).toArray(function (err, users) {
			  console.log(users);
			  if (err) {
		        console.log(err);
		        res.code = "401";
				res.value = "Failed posting update";
		      } else  {

		        res.code = "200";
				res.value = "Success getting users";
				res.result = users;

		      }
		      //Close connection
		      db.close();
		      callback(null, res);
		  })
	  }
	});
};
