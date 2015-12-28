var mq_client = require('../rpc/client');
var util = require("util");

exports.groups = function(req,res){
	res.render('groups',{ name:req.session.user.firstname +" " + req.session.user.lastname,
	userid:req.session.user.userid});
};

exports.creategroup = function(req, res){
	var msg_payload = { "userid": req.session.user.userid, "groupname": req.body.groupname};
    mq_client.make_request('creategroup_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
    		res.send("success");
    	}
    	else {
    		res.send('failure');
    	}
    });
};

exports.deletegroup = function(req, res){
			var msg_payload = { "userid": req.session.user.userid, "groupid": req.body.groupid};
			mq_client.make_request('deletegroup_queue',msg_payload, function(err,result){
				if(result.code == "200"){
					res.send("Success");
				}
				else {
					res.send('failure');
				}
			});
};

exports.joingroup = function(req, res){
			var msg_payload = { "userid": req.session.user.userid, "groupid": req.body.groupid};
			mq_client.make_request('joingroup_queue',msg_payload, function(err,result){
				if(result.code == "200"){
					res.send("Success");
				}
				else {
					res.send('failure');
				}
			});
};


exports.exitgroup = function(req, res){
		var msg_payload = { "userid": req.session.user.userid, "groupid": req.body.groupid};
	  mq_client.make_request('exitgroup_queue',msg_payload, function(err,result){
	  	if(result.code == "200"){
	  		res.send("Success");
	  	}
	  	else {
	  		res.send('failure');
	  	}
	  });
};


exports.getgroups = function(req, res){
	var userid = req.query.userid ? req.query.userid:req.session.user.userid;
	var msg_payload = { "userid": userid, "groupname": req.body.groupname};
    mq_client.make_request('getgroups_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
    		res.send(result.groups);
    	}
    	else {
    		res.send('failure');
    	}
    });
};

exports.getallgroups = function(req, res){
	var msg_payload = { "userid": req.session.user.userid, "gname": req.query.gname};
    mq_client.make_request('getallgroups_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
    		res.send(result.groups);
    	}
    	else {
    		res.send('failure');
    	}
    });
};
