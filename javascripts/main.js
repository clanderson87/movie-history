requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../lib/bower_components/jquery/dist/jquery.min',
    'lodash': '../lib/bower_components/lodash/lodash.min',
    'hbs': '../lib/bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../lib/bower_components/bootstrap/dist/js/bootstrap.min',
    'q': '../lib/bower_components/q/q',
    'firebase' : '../lib/bower_components/firebase/firebase'
  },
  shim: {
    'bootstrap': ['jquery'],
    'firebase': {exports: 'Firebase'}
  }
});

requirejs(
  ["jquery", "hbs", "bootstrap", "lodash", "q", "firebase", "dataControl", "loginRegister"],
  function($, Handlebars, bootstrap, _, q, Firebase, dataControl, loginRegister) {

  var firebaseRef = new Firebase("https://nss-movie-history.firebaseio.com");

  loginRegister.getLogin("mncross@gmail.com", "abc");

  dataControl.getUsersMovies(firebaseRef.getAuth().uid);

  $('#searchOMDbButton').click(function(){
    dataControl.OMDbSearch($('#searchText').val())
    .then(function(OMDbSearchResults) {
      console.log("data returned from promise");
      console.log("'search' array in object returned", OMDbSearchResults);
      var OMDbMovie = OMDbSearchResults.map(function(currentValue, i, array) {
        console.log("imdbID", array[i].imdbID);
        if (array[i].Poster === "N/A") {
          return {
            title: array[i].Title,
            year: array[i].Year,
            imdbID: array[i].imdbID,
            poster: "http://www.chabotcollege.edu/Library/subjectindex/film.jpg"
          };
        } else{
          return {
            title: array[i].Title,
            year: array[i].Year,
            imdbID: array[i].imdbID,
            poster: "http://img.omdbapi.com/?i=" + array[i].imdbID + "&apikey=8513e0a1"
          };
        };
      });
      console.log("new OMDbMovie object", OMDbMovie);
      require(['hbs!../templates/addMovie'], function(addMovie) {
        $('#OMDbSearchResults').html(addMovie({movies: OMDbMovie}));
      });
      $('#addMovieModal').modal();
    });
  });

  $(document).on('click', '.addMovieButton', function() {
    var thisMovie = $(this).attr("imdbid");
    console.log(thisMovie);
    dataControl.OMDbIDSearch(thisMovie)
    .then(function(OMDbExactMatch) {
      $('#addMovieModal').modal('hide');
      console.log("OMDb exact match", OMDbExactMatch);
      var currentUser = firebaseRef.getAuth().uid;
      console.log("currentUser", currentUser);
      dataControl.addUserMovie(currentUser, OMDbExactMatch);
    });
  });

  $("#submit").click(function(){
    console.log("YES");
  });

  $('#registerButton').click(function(){
    console.log("registerButton clicked");
    loginRegister.getRegister();
  });
});