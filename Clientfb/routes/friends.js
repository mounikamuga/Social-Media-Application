
var util = require("util");
var mq_client = require('../rpc/client');

exports.getfriends = function(req,res){
	var msg_payload = { "userid": req.session.user.userid,"accepted":1};
    mq_client.make_request('getfrienduserids_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
				var msg_payload = { "userids": result.userids,"userid":req.session.user.userid};
			  mq_client.make_request('getfriends_queue',msg_payload, function(err,friendsresult){
					if(result.code=="200")
    				res.send(friendsresult.friends);
				});
    	}
    	else {
    		res.render('friends', { name:req.session.user.firstname +" " + req.session.user.lastname });
    	}
    });
};

exports.gettobefriends = function(req,res){
	var msg_payload = { "userid": req.session.user.userid,"accepted":0};
    mq_client.make_request('getfrienduserids_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
				var msg_payload = { "userids": result.userids,"userid":req.session.user.userid};
			  mq_client.make_request('getfriends_queue',msg_payload, function(err,friendsresult){
					if(result.code=="200")
    				res.send(friendsresult.friends);
				});
    	}
    	else {
    		res.render('friends', { name:req.session.user.firstname +" " + req.session.user.lastname });
    	}
    });
};

exports.home = function(req, res){
	  res.render('friends', { name:req.session.user.firstname +" " + req.session.user.lastname });
	};
