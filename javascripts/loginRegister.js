define(["firebase", "dataControl", "domControl"], function(firebase, dataControl, domControl) {

	var firebaseRef = new firebase("https://nss-movie-history.firebaseio.com");

	return {
		getLogin: function() {
			firebaseRef.authWithPassword({
					email 	 : $('#email').val(),
					password : $('#pwd').val()
			}, function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					console.log("Authenticated successfully with payload:", authData);
					dataControl.getUsersMovies(authData.uid)
					.then(function(moviesReturnedByPromise){
							$('#loginRegister').remove();
							domControl.loadProfileHbs(moviesReturnedByPromise);
					});
				}
			});
		},
		getRegister: function(){
			// console.log("getRegister run");
			var newUserEmail = $('#email').val();
			firebaseRef.createUser({
					email    : newUserEmail,
					password : $('#pwd').val()
			}, function(error, userData) {
					if (error) {
						console.log("Error creating user:", error);
					} else {
						console.log("Successfully created user account with uid:", userData.uid);
						var newUser ={
							userEmail: newUserEmail
						};
						firebaseRef.child('users').child(userData.uid).set(newUser);
						$('#loginMessage').text(newUserEmail + " is now registered. Please login.");
					}
			});
		}
	};
});


