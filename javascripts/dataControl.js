define(["jquery", "q", "firebase"],
	function($, q, firebase) {

	var firebaseRef = new firebase("https://nss-movie-history.firebaseio.com/");

	return {
		OMDbSearch: function(searchString) {
			var deferred = q.defer();
			searchString = searchString.split(' ').join('+');
			// console.log("movie searched", searchString);
			$.ajax("http://www.omdbapi.com/?s=" + searchString + "&type=movie&r=json")
			.done(function(potentialMatches) {
				deferred.resolve(potentialMatches.Search);
				// console.log("OMDb search data", potentialMatches);
			}).fail(function() {
				// console.log("OMDb search failed");
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
				// console.log("OMDb exact match failed");
			});
			return deferred.promise;
		},
		addUserMovie: function(uid, movieObject) {
			// console.log("uid", uid);
			// console.log("movieObject", movieObject);
			var newMovie;
			if (movieObject.Poster == "N/A") {
				newMovie = {
					title: movieObject.Title,
					year: movieObject.Year,
					actors: movieObject.Actors.replace(/(, )/g, "|").split('|'),
					watched: false,
					poster: "../images/defaultPoster.jpg",
					rating: 0
				};
			} else {
				newMovie = {
					title: movieObject.Title,
					year: movieObject.Year,
					actors: movieObject.Actors.replace(/(, )/g, "|").split('|'),
					watched: false,
					poster: "http://img.omdbapi.com/?i=" + movieObject.imdbID + "&apikey=8513e0a1",
					rating: 0
				};
			}
			// console.log("newMovie to be added", newMovie);
			firebaseRef.child('users').child(uid).child('movies').child(movieObject.imdbID).set(newMovie);
		},
		getUsersMovies: function(uid) {
			var deferred = q.defer();
			$.ajax("https://nss-movie-history.firebaseio.com/users/" + uid + "/movies/.json")
			.done(function(userMovies) {
				// console.log("userMovies", userMovies);
				deferred.resolve(userMovies);
			})
			.fail(function() {
				// console.log("getUsersMovies was a fail");
			});
			return deferred.promise;
		},
		deleteUsersMovies: function(imdbid) {
			console.log(imdbid);
			console.log("Testing delete button");
		},
		markWatched: function(imdbID, thisButton) {
			// console.log("markWatched run");
			$(thisButton).attr("watched", "true");
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({watched: true});
			$(thisButton).removeClass("btn-default");
			$(thisButton).addClass("btn-success");
			$(thisButton).text("Watched");
		},
		markUnwatched: function(imdbID, thisButton) {
			// console.log("markUnwatched run");
			$(thisButton).attr("watched", "false");
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({watched: false});
			$(thisButton).removeClass("btn-success");
			$(thisButton).addClass("btn-default");
			$(thisButton).text("Not Watched");
		},
		changeRating: function(imdbID, thisButton, ratingValue) {
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({rating: ratingValue});
		}




// $(document).on("click", "a[id^='delete#']", function() {

//       console.log(this.id, "https://nss-movie-history.firebaseio.com/movies/" + this.id.split("#")[1] + ".json");

//       $.ajax({
//         url: "https://nss-movie-history.firebaseio.com/movies/" + this.id.split("#")[1] + ".json",
//         method: "DELETE",
//         contentType: "application/json"
//       }).done(function(movie){
//         console.log("Successfully deleted movie");
//       });
//     })




	};
});


