var util = require("util");
var mongo = require('./mongodbconnection');
var MongoClient = require('mongodb').MongoClient;
var async = require("async");
var ObjectId = require("mongodb").ObjectID;

exports.saveabout = function(msg,callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
			var collection = db.collection('user');
			collection.update({userid:msg.userid},{$set:{
				username:msg.username,
				firstname:msg.firstname,
				lastname:msg.lastname,
				mobile:msg.mobile,
				birthday: msg.birthday,
				workexperience:msg.workexperience,
				description:msg.description,
				lifeevents:msg.lifeevents,
				education:msg.education
			}},function(err,result){
				if(err){
					res.code="500";
					res.value="Error ";
					db.close();
					callback(null,res);
				}
				else {
					res.code="200";
					res.value="Success";
					db.close();
					callback(null,res);
				}
			})
		}
	});
};

exports.profile = function(msg,callback){
	var res = {};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
		  var collection = db.collection('user');
		  collection.findOne({userid: msg.friendid},{password:0},
		  function (err, friend) {
			  var collection = db.collection('friends');
			  collection.findOne({
				  "$or": [{
					  "$and": [{
			    			 userid: msg.userid
						    }, {
						     frienduserid: msg.friendid
						    }]
				    }, {
				    	"$and": [{
			    			 userid: msg.friendid
						    }, {
						     frienduserid: msg.userid
						    }]
				    }]
			  },
			  function (err, friendsdetails) {
				  if (err) {
			        console.log(err);
			        res.code = "401";
					res.value = "Failed Login";
			      } else {
			    	  var action = 0;//0 for addfriend 1-cancel req 2-Unfriend 3-accept req
						if(friendsdetails){
							if(friendsdetails.userid==msg.userid){
								if(parseInt(friendsdetails.accepted)==0){
									action=1;
								}
								else{
									action=2;
								}
							}
							else{
								if(parseInt(friendsdetails.accepted)==0){
									action=3;
								}
								else{
									action=2;
								}
							}
						}
						res.code = "200";
						res.value = "success";
						res.friend = friend;
						res.action = action;
			      }
			      //Close connection
			      db.close();
			      callback(null, res);
			  })
		  })
	  }
	});
};

exports.frndaction = function(msg,callback){
	var res = {};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
		var collection = db.collection('friends');
		switch(parseInt(msg.action)){
		case 0:
			  collection.insert({userid: msg.userid, frienduserid: msg.friendid, accepted: 0},
			  function (err, friend) {
				  if(err){
					  res.code = 400 ;
					  res.value = "failed adding friend" ;
				  }
				  else{
					  res.code = 200;
					  res.value = "Success" ;
				  }
			  })
			break ;
		case 1:
			collection.remove({userid: msg.userid, frienduserid: msg.friendid},
					  function (err, friend) {
						  if(err){
							  res.code = 400 ;
							  res.value = "failed removing friend" ;
						  }
						  else{
							  res.code = 200;
							  res.value = "Success" ;
						  }
					  })
					break ;
		case 2:
		case 4:
			collection.remove({
				"$or": [{
				  "$and": [{
		    			 userid: msg.userid
					    }, {
					     frienduserid: msg.friendid
					    }]
			    }, {
			    	"$and": [{
		    			 userid: msg.friendid
					    }, {
					     frienduserid: msg.userid
					    }]
			    }]},
			  function (err, friend) {
				  if(err){
					  res.code = 400 ;
					  res.value = "failed removing friend" ;
				  }
				  else{
					  res.code = 200;
					  res.value = "Success" ;
				  }
			  })
			break ;

		case 3:
			collection.update({
				"$and": [{
	    			 userid: msg.friendid
				    }, {
				     frienduserid: msg.userid
				    }]
				},{
					$set :{"accepted":1}
				},
				  function (err, friend) {
					  if(err){
						  res.code = 400 ;
						  res.value = "failed adding friend" ;
					  }
					  else{
						  res.code = 200;
						  res.value = "Success" ;
					  }
				  })
			break ;
		}
	  }
	  });
}

exports.getinterests = function(msg,callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
			var collection = db.collection('interests');
			collection.find({userid:msg.userid}).toArray(function(err,result){
				async.each(result,function(interest,interest_callback){
					if(err){
						console.log(err);
						res.code="500";
						res.value="Error getting interest";
					}
					else {
						res.code="200";
						res.value="Success";
						res.interests = result;
					}
					interest_callback();
				},function(err){
					db.close();
					callback(null,res);
				});
			})
		}
	});
};

exports.postinterests = function(msg,callback){
			var res={};
			MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
				console.log('successful connection');
			  if(err) {
			    console.log("Error");
			  }
			  else{
					var collection = db.collection('interests');
					collection.insert({userid:msg.userid, interest:msg.interest},function(err,result){
						if(err){
							res.code="500";
							res.value="Error posting interest";
						}
						else {
							res.code="200";
							res.value="Success";
						}
					})
				}
				db.close();
				callback(null,res);
			});
};

exports.deleteinterests = function(msg,callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
			var collection = db.collection('interests');
			collection.remove({_id:ObjectId(msg.interestsid)},function(err,result){
				if(err){
					res.code="500";
					res.value="Error deleting interest";
					db.close();
					callback(null,res);
				}
				else {
					res.code="200";
					res.value="Success";
					db.close();
					callback(null,res);
				}
			})
		}
	});
};
