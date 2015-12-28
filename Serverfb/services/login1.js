var mongo = require('./mongodbconnection');
var MongoClient = require('mongodb').MongoClient;

function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
/*	mongo.fetchData(req,res);
	if(returnValue == 1){
		res.code = "200";
		res.value = "Succes Login";		
	}
	else if(returnValue == -1){
		res.code = "401";
		res.value = "Failed Login";
	}*/
	console.log('here');
	MongoClient.connect("mongodb://root:root@ds045704.mongolab.com:45704/273sample/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }else{
	  var collection = db.collection('users');
	  collection.find({$and: [{email: msg.username},{password:msg.password}]}).toArray(function (err, result) {
	      console.log("printing result :"+JSON.stringify(result));
	      console.log("printing result.firstname :"+result[0].firstname);
		  if (err) {
	        console.log(err);
	        res.code = "401";
			res.value = "Failed Login";
	      } else if (result.length) {
	        console.log('Found:', result);
	        res.code = "200";
			res.value = "Success Login";
			res.result = result[0];
			console.log("res.result"+res.result);
	      } else {
	        console.log('No document(s) found with defined "find" criteria!');
	        res.code = "401";
			res.value = "Failed Login";
	      }
	      //Close connection
	      db.close();
	      callback(null, res);
	    });
	  }
	});
}
exports.handle_request = handle_request;