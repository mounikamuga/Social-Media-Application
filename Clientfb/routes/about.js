var mq_client = require('../rpc/client');
var util = require("util");

exports.about = function(req, res){
	res.render('about', { name:req.session.user.firstname +" " + req.session.user.lastname});

};

exports.getdetails = function(req, res){
	res.send(req.session.user);
};

exports.saveabout = function(req,res){
			var msg_payload = {
				  "userid":req.session.user.userid ,
				  "username" : req.body.email,
					"firstname":req.body.firstname,
					"lastname":req.body.lastname,
					"mobile":req.body.mobilenumber,
					"birthday": req.body.birthday,
					"workexperience":req.body.workex,
					"description":req.body.description,
					"lifeevents":req.body.lifeevents,
					"education":req.body.education
				};
			mq_client.make_request('saveabout_queue',msg_payload, function(err,result){
	    	if(result.code == "200"){
					//req.session.destroy();
					req.session.user=msg_payload;
					console.log(req.session.user);
				res.send("");
	    	}
	    	else {
	    		res.redirect('/home');
	    	}
	    });
};

exports.profile = function(req,res){
	if(req.params.userid==req.session.user.userid)
		{
			res.render("home",{name:req.session.user.firstname+" "+req.session.user.lastname});
		}
		var msg_payload = { "userid":req.session.user.userid , "friendid" : parseInt(req.params.userid)};
		mq_client.make_request('getprofile_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
			res.render("profile",{user:result.friend, action:result.action , name:req.session.user.firstname +" " + req.session.user.lastname});
    	}
    	else {
    		res.redirect('/home');
    	}
    });

};

exports.frndaction = function(req,res){
	var msg_payload = { "userid":req.session.user.userid , "friendid" : parseInt(req.body.frndid) , "action" : req.body.action};
	mq_client.make_request('friendaction_queue',msg_payload, function(err,result){
	if(result.code == "200"){
		res.send("Success");
	}
	else {
		res.redirect('/home');
	}
	});
}

exports.getinterests = function(req,res){
	var msg_payload = { "userid":req.session.user.userid};
	mq_client.make_request('getinterests_queue',msg_payload, function(err,result){
		if(result.code == "200"){
			res.send(result.interests);
		}
		else{
				console.log("getting interests failed");
		}
	});
};

exports.postinterests = function(req, res){
	var msg_payload = { "userid":req.session.user.userid, "interest":req.body.interest };
	mq_client.make_request('postinterests_queue',msg_payload, function(err,result){
		if(result.code == "200"){
			res.send("success");
		}
		else{
				console.log("posting interests failed");
		}
	});
};

exports.interests = function(req, res){
	res.render('interests', { name:req.session.user.firstname +" " + req.session.user.lastname});

};

exports.deleteinterests = function(req, res){
	console.log("interestsid"+req.body.interestsid);
	var msg_payload = { "interestsid":req.body.interestsid };
	mq_client.make_request('deleteinterests_queue',msg_payload, function(err,result){
		if(result.code == "200"){
			res.send("success");
		}
		else{
				console.log("Deleting interests failed");
		}
	});
};
