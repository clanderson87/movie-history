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
  ["jquery", "hbs", "bootstrap", "bootstrap-star-rating", "lodash", "q", "firebase", "dataControl", "loginRegister", "domControl", "filtering"],
  function($, Handlebars, bootstrap, bootstrapStarRating, _, q, Firebase, dataControl, loginRegister, domControl, filtering) {

  var firebaseRef = new Firebase("https://nss-movie-history.firebaseio.com");


  loginRegister.getLogin("mncross@gmail.com", "abc");

  $(document).on('click', '#searchOMDbButton', function(){
    dataControl.OMDbSearch($('#searchText').val())
    .then(function(OMDbSearchResults) {
      // console.log("data returned from promise");
      // console.log("'search' array in object returned", OMDbSearchResults);
      var OMDbMovie = OMDbSearchResults.map(function(currentValue, i, array) {
        // console.log("imdbID", array[i].imdbID);
        if (array[i].Poster === "N/A") {
          return {
            title: array[i].Title,
            year: array[i].Year,
            imdbID: array[i].imdbID,
            poster: "../images/defaultPoster.jpg"
          };
        } else{
          return {
            title: array[i].Title,
            year: array[i].Year,
            imdbID: array[i].imdbID,
            poster: "http://img.omdbapi.com/?i=" + array[i].imdbID + "&apikey=8513e0a1"
          };
        }
      });
      // console.log("new OMDbMovie object", OMDbMovie);
      require(['hbs!../templates/addMovie'], function(addMovie) {
        $('#OMDbSearchResults').html(addMovie({movies: OMDbMovie}));
      });
      $('#addMovieModal').modal();
    });
  });

  $(document).on('click', '#searchMyMoviesButton', function() {
    dataControl.OMDbSearch($('#searchText').val())
    .then(function(OMDbSearchResults) {
      console.log("OMDbSearchResults", OMDbSearchResults);
      dataControl.getUsersMovies().then(function(firebaseMovies) {
        console.log("firebaseMovies", firebaseMovies);
        var firebaseMoviesArray = _.values(firebaseMovies);
        console.log("firebaseMoviesArray", firebaseMoviesArray);
      });
    });

    // filtering.searchMyMovies();
  });

  $(document).on('click', '.addMovieButton', function() {
    var thisMovie = $(this).attr("imdbid");
    // console.log(thisMovie);
    dataControl.OMDbIDSearch(thisMovie)
    .then(function(OMDbExactMatch) {
      $('#addMovieModal').modal('hide');
      // console.log("OMDb exact match", OMDbExactMatch);
      var currentUser = firebaseRef.getAuth().uid;
      // console.log("currentUser", currentUser);
      dataControl.addUserMovie(currentUser, OMDbExactMatch);
    }).then(function(){
      dataControl.getUsersMovies()
      .then(function(moviesReturnedByPromise){
        domControl.loadProfileHbs(moviesReturnedByPromise);
      });
    });
  });

  $("#loginButton").click(function(){
    // console.log("loginButton clicked");
    loginRegister.getLogin();
  });

  $('#registerButton').click(function(){
    // console.log("registerButton clicked");
    loginRegister.getRegister();
  });

  $(document).on("click", ".deleteButton", function() {
    var imdbid = $(this).attr("imdbid");
    console.log("imdbid", imdbid);
    dataControl.deleteUsersMovies(imdbid);
    dataControl.getUsersMovies()
    .then(function(movies) {
      domControl.loadProfileHbs(movies);
    });
  });


  $(document).on('click', '.watchedButton', function() {
    // console.log("watchedButton clicked for", $(this).attr("imdbid"));
    var thisMovie = $(this).attr("imdbid");
    // console.log("thisMovie", thisMovie);
    var thisMovieWatched = $(this).attr("watched");
    // console.log("is watched", thisMovieWatched);
    var thisButton = $(this);
    if (thisMovieWatched == "false") {
      dataControl.markWatched(thisMovie, thisButton);
    } else {
      dataControl.markUnwatched(thisMovie, thisButton);
    }
  });

  $(document).on('rating.change', '.starRating', function(event, value, caption) {
    var thisButton = $(this);
    var thisMovie = $(this).attr("imdbid");
    // console.log("starRating changed");
    // console.log(value);
    dataControl.changeRating(thisMovie, thisButton, value);
  });
});