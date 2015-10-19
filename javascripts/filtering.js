define(["jquery", "lodash", "dataControl", "firebase", "domControl"],
	function($, _, dataControl, firebase, domControl) {

	var firebaseRef = new firebase("https://nss-movie-history.firebaseio.com/");

	return {
		searchMyMovies: function() {
			console.log("searchMyMovies run");
			console.log("search field is", $('#searchText').val());
			dataControl.getUsersMovies(firebaseRef.getAuth().uid)
			.then(function(userMovies) {
				console.log("userMovies", userMovies);
				var userMoviesArray = [];
				for (var currentkey in userMovies) {
					userMoviesArray.push(userMovies[currentkey]);
				}
				var filteredMovies = _.filter(userMoviesArray, function(movie) {
					return movie.title == $('#searchText').val();
				});
				console.log("filteredMovies", filteredMovies);
				domControl.loadProfileHbs(filteredMovies);
			});
		}
	};
});