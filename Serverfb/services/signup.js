var mongo = require('./mongodbconnection');
var MongoClient = require('mongodb').MongoClient;

exports.handle_request = function (msg, callback){

	var res = {};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
		  var collection = db.collection('user');
		  var collectionId = db.collection('userId');
		   collectionId.findOne({field:"userid"},function(err,userid){
				 console.log(err);
				 console.log(userid);
			   collectionId.update({field:"userid"},{$set:{seq:userid.seq+1}},function(err,test){
				  collection.insert({userid : userid.seq+1, username: msg.username, password:msg.password,firstname:msg.firstname
						,lastname: msg.lastname, birthday:msg.birthday, mobile:msg.mobile ,gender:msg.gender},
				  function (err, user) {
					  if (err) {
				        console.log(err);
				        res.code = "401";
								res.value = "Failed Signup";
								db.close();
								callback(null, res);
				      } else  {
				        res.code = "200";
								res.value = "Success Signup";
								db.close();
					      callback(null, res);
				      }
				      //Close connection

				  })
		   });
		   });
	  }
	});
}
