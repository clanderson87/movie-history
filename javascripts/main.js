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

  var firebaseRef = new Firebase("https://movie-history-redux.firebaseio.com/");

  // calls to login register js
  //authorizes
  //if successful, retrieves user data
  //then calls loadprofile handlebar and create the dom for #mymovies
  $("#loginButton").click(function(){
    loginRegister.getLogin();
  });

  // calls to login register js
  //creates user
  //initiates callback function which sets new user into the database with email as first value
  $('#registerButton').click(function(){
    loginRegister.getRegister();
  });

  //grabs value of input search box and then calls omdb search with value passed
  $(document).on('click', '#searchMyMoviesButton', function() {
    dataControl.OMDbSearch($('#searchText').val())
    .then(function(OMDbSearchResults) {
      console.log("OMDbSearchResults", OMDbSearchResults);
      //after resutls come back calls get user movies
      dataControl.getUsersMovies()
      .then(function(firebaseMovies) {
        //this only a check to see what movies are in the firebase account
        console.log("firebaseMovies", firebaseMovies);
      });
    });
  });

  //deletes a movie from user account
  $(document).on('click', '.addRemoveMovieButton', function() {
    //grabs specific movie imdbid
    var thisMovie = $(this).attr("imdbid");
    //this is actually a toggle between either an add/watched or delete button
    // goes and checks to see if the data attribute is true on this movie and if so runs delete movie. true means the user has added it to their list
    if ($(this).attr("savedToFirebase") == "true") {
      $(this).prop({"hidden": 1});
      //this next part deletes the movie from the dom by hiding then actually removing
      $(this).parents(".panel").hide('slow', function() {
        $(this).remove();
      });
    } else {
      // if the movie is not in the list then the user can add or watch the movie
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

  // dead function... i think
  $(document).on("click", ".deleteButton", function() {
    var imdbid = $(this).attr("imdbid");
    // dataControl.deleteUsersMovies(imdbid);
    dataControl.getUsersMovies()
    .then(function(movies) {
      domControl.loadProfileHbs(movies);
    });
  });

  //onclick event for the watched button
  //grabs imdbid and if the movie has been watched it turns the button to not watched
  // if it has been watched it marks the button as watched
  $(document).on('click', '.watchedButton', function() {
    var thisMovie = $(this).attr("imdbid");
    var thisButton = $(this);
    if ($(this).attr("watched") == "true") {
      dataControl.markUnwatched(thisMovie, thisButton);
    } else {
      dataControl.markWatched(thisMovie, thisButton);
    }
  });

  //grabs a change to the star rater. if a user changes the rating it...
  //grabs the value and passes it to the change rating function, which changes the rating in firebase
  $(document).on('rating.change', '.starRating', function(event, value, caption) {
    var thisButton = $(this);
    var thisMovie = $(this).attr("imdbid");
    dataControl.changeRating(thisMovie, thisButton, value);
  });

//for all filter methods below.
// it runs the get user movies function
// then runs set filter function with those results
//then passes to template

// filter for movies watched
  $(document).on("click", "#filterWatched", function(){
    dataControl.getUsersMovies()
     .then(function(allMovies) {
        var filterWatchedMovies = dataControl.setFilterWatched(allMovies);
        domControl.loadProfileHbs(filterWatchedMovies);
    });
    console.log("watched filter has been clicked");
  });


// filter for movies NOT watched

  $(document).on("click", "#filterToWatch", function(){
    dataControl.getUsersMovies()
      .then(function(allMovies) {
        domControl.loadProfileHbs(dataControl.setFilterNotWatched(allMovies));
      });
  });


// filter for 5 star movies
//*** this is where the refactored code will go for the slider bar we can use the same id and structure.
//we will need to grab the value of the slider and pass it to the datacontrol set filter 5 star function

    $(document).on("click", "#filterRated5", function(){
      dataControl.getUsersMovies()
        .then(function(allMovies){
          domControl.loadProfileHbs(dataControl.setFilter5stars(allMovies));
        });
    });


    // filter back to all

    $(document).on("click", "#filterAll", function (){
      dataControl.getUsersMovies()
      .then(function(allMovies){
        domControl.loadProfileHbs(allMovies);
      });
    });
});
