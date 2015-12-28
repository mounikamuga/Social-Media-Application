//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/login')
var signup = require('./services/signup')
var posts = require('./services/posts')
var user = require('./services/user')
var about = require('./services/about')
var friends = require('./services/friends')
var groups = require('./services/groups')


var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			login.handle_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('signup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			signup.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('post_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			posts.poststatus(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	cnn.queue('getuserids_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			posts.getuserids(message, function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
			});
		});
	});

	cnn.queue('getfrienduserids_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			friends.getuserids(message, function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
			});
		});
	});

	cnn.queue('getpost_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
				posts.getstatus(message,function(err,res){
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				})
		});
	});

	cnn.queue('getallusers_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			user.getallusers(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	cnn.queue('getprofile_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			about.profile(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('getfriends_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			friends.getfriends(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('friendaction_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			about.frndaction(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	cnn.queue('getinterests_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			about.getinterests(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	cnn.queue('postinterests_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			about.postinterests(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	cnn.queue('deleteinterests_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			about.deleteinterests(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	cnn.queue('saveabout_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			about.saveabout(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	cnn.queue('creategroup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			groups.creategroup(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('getgroups_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			groups.getgroups(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	cnn.queue('getallgroups_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			groups.getallgroups(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('joingroup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			groups.joingroup(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('exitgroup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			groups.exitgroup(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('deletegroup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			groups.deletegroup(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

});
