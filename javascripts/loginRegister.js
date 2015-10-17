define(["firebase"], function(firebase) {

	//creates user variable to create json data
	// function createUserData(userData){
	// 	var ref = new Firebase("https://nss-movie-history.firebaseio.com/users");
	// 	console.log(userData.uid);
	// 	 userObject = ref.child(userData.uid);
	// }
	var ref = new firebase("https://nss-movie-history.firebaseio.com");

	var loggedInUser = uid;

	return {
		getLogin: function(id, userLoginInfo) {
			// authorizes user
			console.log(userLoginInfo);
			ref.authWithPassword({
  				email    : userLoginInfo.useremail,
  				password : userLoginInfo.userpass,
			}, function(error, authData) {
				if (error) {
		    		console.log("Login Failed!", error);
		  		} else {
		    		console.log("Authenticated successfully with payload:", authData);
		    		createUserData(authData);
		    		loggedInUser = authData;
		  		};
			});
		},
		getRegister: function(){
			console.log("getRegister run")
			var newUserEmail = $('#email').val();
			ref.createUser({
  				email    : newUserEmail,
  				password : $('#pwd').val()
			}, function(error, userData) {
	  			if (error) {
	    			console.log("Error creating user:", error);
	  			} else {
	    			console.log("Successfully created user account with uid:", userData.uid);
					var newUser ={
						userEmail: newUserEmail,
						movies: []
					};
	    			ref.child('users').child(userData.uid).set(newUser);
	  			};
			});
		},
		getCurrentUser: function(){
			return loggedInUser;
		}
	}
});


