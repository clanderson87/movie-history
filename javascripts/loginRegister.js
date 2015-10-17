define(["firebase"], function(firebase) {

	//creates user variable to create json data
	// function createUserData(userData){
	// 	var ref = new Firebase("https://nss-movie-history.firebaseio.com/users");
	// 	console.log(userData.uid);
	// 	 userObject = ref.child(userData.uid);
	// }
	var ref = new firebase("https://nss-movie-history.firebaseio.com");

	return {
		getLogin: function(email, password) {
			ref.authWithPassword({
  				email    : email/*$('#email').val()*/,
  				password : password/*$('#pwd').val()*/
			}, function(error, authData) {
				if (error) {
		    		console.log("Login Failed!", error);
		  		} else {
		    		console.log("Authenticated successfully with payload:", authData);
		  		}
			});
		},
		getRegister: function(){
			console.log("getRegister run");
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
	  			}
			});

		}
	};
});


