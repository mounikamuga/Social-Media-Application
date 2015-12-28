var MongoClient = require('mongodb').MongoClient;


function fetchData(req,res){
	
console.log('here');
MongoClient.connect("mongodb://root:root@ds045704.mongolab.com:45704/273sample/", function(err, db) {
	console.log('successful connection');
  if(err) {
    console.log("Error");
  }else{
  var collection = db.collection('users');
  collection.find({$and: [{username: msg.username},{password:msg.password}]}).toArray(function (err, result) {
      if (err) {
        console.log(err);
        return 0;
      } else if (result.length) {
        console.log('Found:', result);
        return 1;
     /*   res.render("signup_success",{signupdetails: 'Username:'+ req.session.username +'\r\n\tPassword:' +
        	req.session.password +'\r\n\tFirst Name:' + req.session.firstname +'\r\n\tLast Name:'   + req.session.lastname +
    		'\r\n\tDate Of Birth:'  + req.session.dateOfBirth +'\r\n\tGender:'  + req.session.gender});*/
      } else {
        console.log('No document(s) found with defined "find" criteria!');
    //    res.render("failure",{title: 'Incorrect username/password'});
        return -1;
      }
      //Close connection
      db.close();
    });
  }
});
}

function insertData(req,res,msg){
	
	
	
	MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
		  if(err) {
		    console.log("Error");
		  }else{
			  console.log("Succesful connection");
			  var collection = db.collection('users');
			  collection.insert( {username : username, password : password, firstname:firstname,lastname : lastname,dateOfBirth:dateOfBirth, gender:gender },
					  function(err,result){
				  if(err) {
			            console.log(err);
			            res.render("failure",{title: 'Failure'});
			        }
			        else {
			        	req.session.username = username;
			        	req.session.password = password;
			        	req.session.firstname = firstname;
			        	req.session.lastname = lastname;
			        	req.session.dateOfBirth = dateOfBirth;
			        	req.session.gender = gender;
			        	res.render("login");
			           
			        }
				  
					//Close connection
				      db.close();
				      
			  }); 
		  }   
		
	});
	
}


exports.fetchData=fetchData;
exports.insertData=insertData;