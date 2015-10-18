define(["jquery", "q", "firebase"], function($, q, firebase) {

	var firebaseRef = new firebase("https://nss-movie-history.firebaseio.com/");

	return {
		OMDbSearch: function(searchString) {
			var deferred = q.defer();
			searchString = searchString.split(' ').join('+');
			console.log("movie searched", searchString);
			$.ajax("http://www.omdbapi.com/?s=" + searchString + "&type=movie&r=json")
			.done(function(potentialMatches) {
				deferred.resolve(potentialMatches.Search);
				console.log("OMDb search data", potentialMatches);
			}).fail(function() {
				console.log("OMDb search failed");
			});
			return deferred.promise;
		},
		OMDbIDSearch: function(imdbID) {
			var deferred = q.defer();
			$.ajax("http://www.omdbapi.com/?i=" + imdbID + "&r=json")
			.done(function(exactMatch) {
				deferred.resolve(exactMatch);
				// console.log("OMDb exact match", exactMatch);
			})
			.fail(function() {
				console.log("OMDb exact match failed");
			});
			return deferred.promise;
		},
		addUserMovie: function(uid, movieObject) {
			console.log("uid", uid);
			console.log("movieObject", movieObject);
			if (movieObject.Poster == "N/A") {

			} else{};
			var newMovie = {
				title: movieObject.Title,
				year: movieObject.Year,
				actors: movieObject.Actors.replace(/(, )/g, "|").split('|'),
				watched: false
			};
			console.log("newMovie to be added", newMovie);
			firebaseRef.child('users').child(uid).child('movies').child(movieObject.imdbID).set(newMovie);
		},

		getUsersMovies: function(uid) {
			var deferred = q.defer();
			$.ajax("https://nss-movie-history.firebaseio.com/users/" + uid + "/movies/.json")
			.done(function(userMovies) {
				console.log("userMovies", userMovies);
				deferred.resolve(userMovies);
			})
			.fail(function() {
				console.log("getUsersMovies was a fail");
			});
			return deferred.promise;
		}
	};
});


