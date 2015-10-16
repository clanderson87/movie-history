// define(function(require) {
// 	var q = require("q", "jquery", "firebase");

// 	return {
// 		getLogin: function() {
// 			var deferred = q.defer();

// 			$.ajax({url: "https://nss-movie-history.firebaseio.com"})

// 			.done(function(firebaseLogin) {
// 				deferred.resolve(firebaseLogin)
// 			})

// 		})

// 	}
// }):
// =======================================
define(function(require) {
	var q = require("q", "jquery", "firebase", "bootstrap");
	
	var userObject;
	//create user code
	$(document).on('click', '#submit', function(){
		console.log("hello");

		var newUser ={
			useremail: $('#email').val(),
			userpass: $('#pwd').val()
		}
	
		var ref = new Firebase("https://nss-movie-history.firebaseio.com");
			ref.createUser({
  				email    : newUser.useremail,
  				password : newUser.userpass
			}, function(error, userData) {
  			if (error) {
    			console.log("Error creating user:", error);
  			} else {
    			console.log("Successfully created user account with uid:", userData.uid);
    			authuser(userData.uid, newUser);
  			}
		});
	});

	// authorizes user
	function authuser(id, userLoginInfo){
		console.log(userLoginInfo)
		var ref = new Firebase("https://nss-movie-history.firebaseio.com");
			ref.authWithPassword({
  			email    : userLoginInfo.useremail,
  			password : userLoginInfo.userpass,
  			rememberMe: true
		}, function(error, authData) {
  		if (error) {
    		console.log("Login Failed!", error);
  		} else {
    		console.log("Authenticated successfully with payload:", authData);
    		createUserData(authData);
  		}
		});
	};

	//creates user variable to create json data
	function createUserData(userData){
		var ref = new Firebase("https://nss-movie-history.firebaseio.com/users");
		console.log(userData.uid);
		 userObject = ref.child(userData.uid);
	}


})




  var authClient = new FirebaseSimpleLogin(myRef, function(error, user) { "https://nss-movie-history.firebaseio.com" });
authClient.createUser(email, password, function(error, user) {
    if (error === null) {
      console.log("User created successfully:", user);
      } else {
        console.log("Error creating user:", error);
      }
});


var authClient = new FirebaseSimpleLogin(myRef, function(error, user) { "https://nss-movie-history.firebaseio.com" });
authClient.login('password', {
  email: '<email@domain.com>',
  password: '<password>'
  rememberMe: true
});