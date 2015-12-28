var mongo = require('./mongodbconnection');
var MongoClient = require('mongodb').MongoClient;
var util = require("util");
var async = require('async');


exports.getfriends = function(msg,callback){
	console.log("in getfriends");
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
			console.log(msg.userids);
			console.log(msg.userid);
			var usercollection = db.collection('user');
				usercollection.find({
					"$and": [{
							 "userid":{$in:msg.userids}
							},
							{
							"userid":{$ne:msg.userid}
							}]
					},{password:0}).toArray(function(err,userresults){
							if(err){
								res.code="200";
								console.log(err);
								db.close();
								callback(null, res);
							}
							else {
								console.log(userresults);
								res.friends = userresults;
								res.code="200";
								db.close();
								callback(null, res);
							}
				})
		}
	});
};

exports.getuserids = function(msg,callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
		  var collection = db.collection('friends');
		  var usercollection = db.collection('user');
		  var postcollection = db.collection('posts');
			collection.find({
			  "$or": [{
				  "$and": [{
		    			 userid: msg.userid
					    },
					    {
					    	accepted : msg.accepted
					    }]
			    }, {
			    	"$and": [{
					     frienduserid: msg.userid
					    },
					    {
					    	 accepted : msg.accepted
					    }]
			    }]
		  }).toArray(function (err, friends) {
			  if (err) {
		        console.log(err);
		        res.code = "401";
				res.value = "Failed posting update";
		      } else  {
			    	var userids = [];
						userids.push(parseInt(msg.userid));
						async.each(friends,function(friend,friendcallback){
							if(userids.indexOf(friend.userid) ===-1){
								userids.push(friend.userid);
							}
							if(userids.indexOf(friend.frienduserid)===-1){
								userids.push(friend.frienduserid);
							}
							friendcallback();
						},function(err){
							res.code="200";
							res.userids = userids;
							db.close();
							callback(null, res);
						})

		      }
		  })
	  }
	});
}
