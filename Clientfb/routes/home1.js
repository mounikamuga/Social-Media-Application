var ejs = require("ejs");
var mq_client = require('../rpc/client');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://root:root@ds045704.mongolab.com:45704/273sample";

function sign_in(req,res) {

	ejs.renderFile('./views/login.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

function signup(req,res) {

	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	
	var msg_payload = { "email": email, "password": password,"firstname" :firstname ,"lastname" : lastname};
    mq_client.make_request('signup_queue',msg_payload, function(err,results){	
    	
	//MongoClient.connect("mongodb://root:root@ds045704.mongolab.com:45704/273sample/", function(err, db) {
	/*	  if(err) {
		    console.log("Error");
		  }else{
			  console.log("Successful connection");
			  var collection = db.collection('users');
			  collection.insert( msg_payload,
					  function(err,result){
				  if(err) {
			            console.log(err);
			            res.code = "401";
						res.value = "Failed Signup";
			            res.render("failure",{title: 'Failure'});
			        }
			        else {
			        	res.code = "200";
						res.value = "Success Signup";
			        }
					//Close connection
				      db.close();
				      callback(null, res);
			  }); 
		  }   
		
	});*/
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			    
			if(results.code == 200){
				console.log("valid signup");
//				req.session.email = email;
//	        	req.session.password = password;
//	        	req.session.firstname = firstname;
//	        	req.session.lastname = lastname;

	        	res.render("login", {"statusCode": 200});
			}
			else {    				
				console.log("Invalid Login");
				res.render("failure",{title: 'Failure', "statusCode": 401});
			}
		} 
	});
}

function getSignup(req,res) {

	ejs.renderFile('./views/signup.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

function after_sign_in(req,res)
{
	// check user already exists
	//var getUser="select * from users where emailid='"+req.param("username")+"'";
	var username = req.param("username");
	var password = req.param("password");
	var msg_payload = { "username": username, "password": password };
		
	console.log("In POST Request = UserName:"+ username+" "+password);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		console.log("inside");
		console.log(results.code);
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				console.log(results);
				req.session.user =results.result[0]; 
				console.log("results.email :"+req.session.user.email);
				res.send({"login":"Success", "statusCode" : 200});
				
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"login":"Fail", "statusCode" : 401});
			}
		}  
	});
	
}

/*
function signup_success(req,res)
{
//	ejs.renderFile('./views/signup_success.ejs',function(err, result) {
	console.log(req.session);
        // render on success
   
            res.render("signup_success",{signupdetails: 'Username:'+ req.session.username +'\r\n\tPassword:' +
            	req.session.password +'\r\n\tFirst Name:' + req.session.firstname +'\r\n\tLast Name:'   + req.session.lastname +
        		'\r\n\tDate Of Birth:'  + req.session.dateOfBirth +'\r\n\tGender:'  + req.session.gender});

     
}
*/

function success_login(req,res)
{
	/*ejs.renderFile('./views/success_login.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });*/
	     console.log("inside success_login redirection method");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');   
		res.render("success_login", {"email":req.session.user.email, "firstname":req.session.user.firstname, "lastname":req.session.user.lastname });  
	
}


function fail_login(req,res)
{
	ejs.renderFile('./views/fail_login.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

exports.sign_in=sign_in;
exports.after_sign_in=after_sign_in;
exports.success_login=success_login;
exports.fail_login=fail_login;
exports.getSignup=getSignup;
exports.signup=signup;
exports.signup_success=signup_success;