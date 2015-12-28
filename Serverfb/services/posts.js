var mongo = require('./mongodbconnection');
var MongoClient = require('mongodb').MongoClient;
var util = require("util");
var async = require("async");

exports.poststatus = function(msg, callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
		  var collection = db.collection('posts');
		  collection.insert({userid : msg.userid, status: msg.status},
		  function (err, post) {
			  if (err) {
		        console.log(err);
		        res.code = "401";
				res.value = "Failed posting update";
		      } else  {

		        res.code = "200";
				res.value = "Success getting update";

		      }
		      //Close connection
		      db.close();
		      callback(null, res);
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
					    	accepted : 1
					    }]
			    }, {
			    	"$and": [{
					     frienduserid: msg.userid
					    },
					    {
					    	 accepted : 1
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

exports.getstatus = function(msg,msgcallback){
	var res={};
	var posts=[];
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
			async.each(msg.userids, function(userid, usercallback) {
				var usercollection = db.collection('user');
				var postcollection = db.collection('posts');
				usercollection.findOne({userid:userid},{password:0},function(err,user){
						console.log(userid);
						postcollection.find({userid:user.userid}).toArray(function(err,postsresults){
							async.each(postsresults, function(postresult,postcallback){
									var post={};
									post.userid=user.userid;
									post.firstname=user.firstname;
									post.lastname=user.lastname;
									post.post=postresult.status;
									posts.push(post);
									postcallback();
							},function(err){
									usercallback();
							});
						})
					})
		}, function(err){
		    if( err ) {
					res.code="200";
					res.value="successs";
					db.close();
					msgcallback(null,res);
		    } else {
					res.code="200"
					res.value="success";
					res.posts=posts;
					db.close();
					msgcallback(null,res);
		    }
		})
	}
	});
}
