var mq_client = require('../rpc/client');
var util = require("util");


exports.poststatus = function(req, res){
	var msg_payload = { "userid": req.session.user.userid, "status": req.body.status};
    mq_client.make_request('post_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
    		res.send("success");
    	}
    	else {
    		res.send('failure');
    	}
    });
}


exports.getstatus = function(req,res){
	var userid = req.query.userid ? req.query.userid:req.session.user.userid;
	var msg_payload = { "userid": userid};
    mq_client.make_request('getuserids_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
    		var msg_payload = { "userids": result.userids};
    	    mq_client.make_request('getpost_queue',msg_payload, function(err,result){
    	    	if(result.code="200")
    	    	{
    	    		res.send(result.posts);
    	    	}
    	    });
    	}
    	else {
    		res.send('failure');
    	}
    });
}
