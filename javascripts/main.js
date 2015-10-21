requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../lib/bower_components/jquery/dist/jquery.min',
    'lodash': '../lib/bower_components/lodash/lodash.min',
    'hbs': '../lib/bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../lib/bower_components/bootstrap/dist/js/bootstrap.min',
    'bootstrap-star-rating': '../lib/bower_components/bootstrap-star-rating/js/star-rating.min',
    'q': '../lib/bower_components/q/q',
    'firebase' : '../lib/bower_components/firebase/firebase'
  },
  shim: {
    'bootstrap': ['jquery'],
    'bootstrap-star-rating': ['bootstrap'],
    'firebase': {exports: 'Firebase'}
  }
});

requirejs(
  ["jquery", "lodash", "hbs", "bootstrap", "bootstrap-star-rating", "q", "firebase", "dataControl", "loginRegister", "domControl", "filtering"],
  function($, _, Handlebars, bootstrap, bootstrapStarRating, q, Firebase, dataControl, loginRegister, domControl, filtering) {

  var firebaseRef = new Firebase("https://nss-movie-history.firebaseio.com");

  loginRegister.getLogin("mncross@gmail.com", "abc");

  $("#loginButton").click(function(){
    loginRegister.getLogin();
  });

  $('#registerButton').click(function(){
    loginRegister.getRegister();
  });

  // $(document).on('click', '#searchOMDbButton', function(){
  //   dataControl.OMDbSearch($('#searchText').val())
  //   .then(function(OMDbSearchResults) {
  //     require(['hbs!../templates/addMovie'], function(addMovie) {
  //       $('#OMDbSearchResults').html(addMovie({movies: OMDbSearchResults}));
  //     });
  //     $('#addMovieModal').modal();
  //   });
  // });

$(document).on('click', '.addRemoveMovieButton', function() {
  var thisMovie = $(this).attr("imdbid");
  if ($(this).attr("savedToFirebase") == "true") {
    dataControl.deleteUsersMovies(thisMovie);
    $(this).parents(".panel").hide('slow', function() {
      $(this).remove();
    });
  } else {
    dataControl.OMDbIDSearch(thisMovie)
    .then(function(OMDbExactMatch) {
      var currentUser = firebaseRef.getAuth().uid;
      dataControl.addUserMovie(OMDbExactMatch);
    });
    $(this).attr("savedToFirebase", true);
    $(this).removeClass("btn-default");
    $(this).addClass("btn-danger");
    $(this).text("Remove Movie");
  }
});


  $(document).on('click', '#searchMyMoviesButton', function() {
    var searchResultsArray;
    var combinedMoviesArray;
    dataControl.OMDbSearch($('#searchText').val())
    .then(function(OMDbSearchResults) {
      searchResultsArray = OMDbSearchResults;
      dataControl.getUsersMovies()
      .then(function(firebaseMovies) {
        var firebaseMoviesArray = _.values(firebaseMovies).sort(function(a, b) {
          if (a.Title[0] < b.Title[0]) {
            return -1;
          }
          if (a.Title[0] > b.Title[0]) {
            return 1;
          }
          return 0;
        });
        var firebaseMoviesIMDbID = _.chain(firebaseMoviesArray).pluck('imdbID').uniq().value();
        var filteredSearchResultsArray = searchResultsArray.filter(function(value, index, array) {
          if ($.inArray(value.imdbID, firebaseMoviesIMDbID) === -1) {
            return true;
          } else{
            return false;
          }
        });
        combinedMoviesArray = filteredSearchResultsArray.concat(firebaseMoviesArray);
        domControl.loadProfileHbs(combinedMoviesArray);
      });
    });
  });


  $(document).on("click", ".deleteButton", function() {
    var imdbid = $(this).attr("imdbid");
    // dataControl.deleteUsersMovies(imdbid);
    dataControl.getUsersMovies()
    .then(function(movies) {
      domControl.loadProfileHbs(movies);
    });
  });


  $(document).on('click', '.watchedButton', function() {
    var thisMovie = $(this).attr("imdbid");
    var thisButton = $(this);
    if ($(this).attr("watched") == "true") {
      dataControl.markUnwatched(thisMovie, thisButton);
    } else {
      dataControl.markWatched(thisMovie, thisButton);
    }
  });

  $(document).on('rating.change', '.starRating', function(event, value, caption) {
    var thisButton = $(this);
    var thisMovie = $(this).attr("imdbid");
    dataControl.changeRating(thisMovie, thisButton, value);
  });
});