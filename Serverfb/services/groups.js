var mongo = require('./mongodbconnection');
var MongoClient = require('mongodb').MongoClient;
var util = require("util");
var async = require("async");

exports.creategroup = function(msg, callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
		  var collection = db.collection('groups');
			var collectionId = db.collection('userId');
		  collectionId.findOne({field:"groupid"},function(err,groupid){
				collectionId.update({field:"groupid"},{$set:{seq:groupid.seq+1}},function(err,test){
				  collection.insert({groupid: groupid.seq+1, adminuserid : msg.userid, groupname: msg.groupname},
					  function (err, group) {
						  if (err) {
					        console.log(err);
					        res.code = "401";
									res.value = "Failed posting update";
									db.close();
						      callback(null, res);
					      } else  {
									var collection = db.collection('groupsusers');
								  collection.insert({userid : msg.userid, groupid: groupid.seq+1},
								  function (err, post) {
									  if (err) {
								        console.log(err);
								        res.code = "401";
												res.value = "Failed posting update";
												db.close();
									      callback(null, res);
								      } else  {
								        res.code = "200";
												res.value = "Success getting update";
												db.close();
									      callback(null, res);
								      }
					      });
							}
						});
					});
				});
			}
		})
	};

exports.deletegroup = function(msg,callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
				var groupsuserscollection = db.collection('groupsusers');
				groupsuserscollection.remove({groupid:msg.groupid},function(err,groups){
								if(err){
									console.log(err);
									res.code="400";
									res.value="Failure";
									db.close();
									callback(null,res);
								}
								else{
								res.code="200";
								res.value="Success";
								db.close();
								callback(null,res);
						}
					})
				}
			});
};

exports.joingroup = function(msg,callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
				var groupsuserscollection = db.collection('groupsusers');
				groupsuserscollection.insert({userid:msg.userid,groupid:msg.groupid},function(err,groupids){
								if(err){
									console.log(err);
									res.code="400";
									res.value="Failure";
									db.close();
									callback(null,res);
								}
								else{
								res.code="200";
								res.value="Success";
								db.close();
								callback(null,res);
						}
					})
				}
			});
};

exports.exitgroup = function(msg,callback){
	var res={};
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
				var groupsuserscollection = db.collection('groupsusers');
				groupsuserscollection.remove({userid:msg.userid,groupid:msg.groupid},function(err,groupids){
								if(err){
									console.log(err);
									res.code="400";
									res.value="Failure";
									db.close();
									callback(null,res);
								}
								else{
								res.code="200";
								res.value="Success";
								db.close();
								callback(null,res);
						}
					})
				}
			});
};

exports.getgroups = function(msg,callback){
	var res={};
	var groups=[];
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
				var groupscollection = db.collection('groups');
				var groupsuserscollection = db.collection('groupsusers');
				groupsuserscollection.find({userid:msg.userid},{groupid:1,_id:0}).toArray(function(err,groupids){
						async.each(groupids,function(group,groupcallback){
							groupscollection.findOne({groupid:group.groupid},function(err,groupresults){
								if(err){
									console.log(err);
									res.code="400";
									res.value="Failure";
									//db.close();
									callback(null,res);
								}
								else{
									groups.push(groupresults);
								}
								groupcallback();
							});
						},function(err){
								res.code="200";
								res.value="Success";
								res.groups=groups;
								//db.close();
								callback(null,res);
						})
					});
				}
			});
};

exports.getallgroups = function(msg,callback){
	var res={};
	var groups=[];
	var groupids=[];
	MongoClient.connect("mongodb://root:root@ds033297.mongolab.com:33297/cmpe273/", function(err, db) {
		console.log('successful connection');
	  if(err) {
	    console.log("Error");
	  }
	  else{
		var groupscollection = db.collection('groups');
		var groupsuserscollection = db.collection('groupsusers');
		groupsuserscollection.find({userid:msg.userid},{groupid:1,_id:0}).toArray(function(err,groupidsresults){
				async.each(groupidsresults,function(group,groupcallback){
					groupids.push(group.groupid);
					console.log(group.groupid);
					groupcallback();
				},function(err){
						groupscollection.find({groupname:new RegExp(msg.gname),groupid:{$nin:groupids}}).toArray(function(err,results){
							res.code="200";
							res.value="Success";
							console.log('inside %j',results);
							res.groups=results;
							db.close();
							callback(null,res);
						})
				})
			});
		}
	});
};
