var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

var mq_client = require('../rpc/client');
var util = require("util");

exports.login = function(req, res){
	
	res.render('login',{error:""});
};

exports.checklogin = function(req,res)
{
	var username = req.body.username;
	var password = req.body.password;
    if(username!=='' && password!=='')
	{
    	var msg_payload = { "username": username, "password": password};
        mq_client.make_request('login_queue',msg_payload, function(err,result){
        	if(result.code == "200"){
        		
        		req.session.user = result.result; 
        		console.log(req.session.user);
        		res.redirect('/home');
        	}
        	else {
        		res.render('login',{error:"please enter correct username and password"});
        	}
        });
	}
	else
	{
		res.render('login',{error:"please enter username and password"});
	}
};

exports.logout = function(req, res){
	req.session.destroy();
	res.render("login",{"error":""});
	};