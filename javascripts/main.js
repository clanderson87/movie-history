
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
  ["jquery", "hbs", "bootstrap", "lodash", "q", "dataControl", "loginRegister"],
  function($, Handlebars, bootstrap, _, q, dataControl, loginRegister) {

  loginRegister.getLogin("mncross@gmail.com", "abc");

  $('#searchOMDbButton').click(function(){
    dataControl.OMDbSearch($('#searchText').val())
    .then(function(OMDbSearchResults) {
      console.log("'search' array in object returned", OMDbSearchResults);
      require(['hbs!../templates/addMovie'], function(addMovie) {
        $('#OMDbSearchResults').html(addMovie({movies: OMDbSearchResults}));
      });
      $('#addMovieModal').modal();
    });
  });

  $(document).on('click', '.addMovieButton', function() {
    var thisMovie = $(this).attr("imdbid");
    console.log(thisMovie);
    var currentUser = loginRegister.getCurrentUser();
    console.log("currentUser", currentUser);
    $('#addMovieModal').modal('hide');
    dataControl.OMDbIDSearch(thisMovie)
    .then(function(OMDbExactMatch) {
      console.log("OMDb exact match", OMDbExactMatch);
      dataControl.addUserMovie(currentUser, OMDbExactMatch);
      // var newMovie = {
      //   title:
      // };
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




