var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

var mq_client = require('../rpc/client');
var util = require("util");


exports.signup = function(req,res)
{	
	var password = bcrypt.hashSync(req.body.password, salt),
	username = req.body.email,
	firstname = req.body.firstname,
	lastname=req.body.lastname,
	mobile = req.body.mobile,
	birthday = req.body.birthday,
	gender = req.body.gender;
	console.log("signup cli");
	var msg_payload = { "username": username, "password": password,"firstname" :firstname ,"lastname" : lastname, 
			"mobile" : mobile, "birthday":birthday , "gender":gender};
    mq_client.make_request('signup_queue',msg_payload, function(err,result){
    	if(result.code == "200"){
    		res.redirect('/');
    	}
    	else {
    		res.render('login',{error:"enter correct details"});
    	}
    });
};
