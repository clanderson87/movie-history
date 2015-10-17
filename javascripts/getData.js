define(["jquery"], function($) {

	return {
		OMDbSearch: function(searchString) {
			searchString = searchString.split(' ').join('+');
	    console.log("movie searched", searchString);
	    $.ajax("http://www.omdbapi.com/?s=" + searchString + "&type=movie&r=json").done(function(potentialMatches) {
	      console.log("OMDb data", potentialMatches);
	      console.log("IMDb ID", potentialMatches.imdbID);
	    });
		}
	}
});