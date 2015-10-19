define(["firebase", "dataControl", "domControl"], function(firebase, dataControl, domControl) {

	var ref = new firebase("https://nss-movie-history.firebaseio.com");

	return {
		getLogin: function(email, password) {
			ref.authWithPassword({
					email    : email/*$('#email').val()*/,
					password : password/*$('#pwd').val()*/
			}, function(error, authData) {
				if (error) {
					// console.log("Login Failed!", error);
				} else {
					// console.log("Authenticated successfully with payload:", authData);
					dataControl.getUsersMovies(authData.uid)
					.then(function(moviesReturnedByPromise){
							domControl.loadProfileHbs(moviesReturnedByPromise);
						});
					}
			});
		},
		getRegister: function(){
			// console.log("getRegister run");
			var newUserEmail = $('#email').val();
			ref.createUser({
					email    : newUserEmail,
					password : $('#pwd').val()
			}, function(error, userData) {
					if (error) {
						// console.log("Error creating user:", error);
					} else {
						// console.log("Successfully created user account with uid:", userData.uid);
					var newUser ={
						userEmail: newUserEmail
					};
						ref.child('users').child(userData.uid).set(newUser);
					}
			});
		}
	};
});


