var mq_client = require('../rpc/client');
var util = require("util");

exports.getallusers = function(req, res){	
	var msg_payload = { "userid": req.session.user.userid, "search":req.query.search};
    mq_client.make_request('getallusers_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
    		res.send(result.result);
    	}
    	else {
    		res.send('failure');
    	}
    });
};