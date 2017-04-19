$(window).load(function() {
  // Giphy Image loader
  var GiphyImgLoader = (function() {
  var _gifs = [],
      _apiKey = "dc6zaTOxFJmzC",
      _apiRoot = "http://api.giphy.com/v1/gifs/";

  function getQueryURL(query) {
    return _apiRoot + "search?q=" + query + "&api_key=" + _apiKey;
  }

  function saveApiResponse(response) {
    _gifs = response.data;
    console.log(vm);
    vm.imgSrc = getRandomGifURL();
  }

  function getRandomGifURL() {
    var i = Math.floor(Math.random() * (_gifs.length - 0 + 1));
    return _gifs[i].images.original.url;
  }

  function hasGifsLoaded() {
    return _gifs.length > 0;
  }

  function placeGif() {
    if ( !hasGifsLoaded() ) {
      fetch(getQueryURL('Drake+Views'), {
        method: 'get',
        mode: 'cors'
      }).then(function(response){
        return response.json();
      }).then(saveApiResponse);
    } else {
      vm.imgSrc = getRandomGifURL();
    }
  }

  return {
    placeGif: placeGif
  }
})();
  
  // MusixMatch Lyrics Loader
  var MMLyricsLoader = (function() {
  var _apiKey = "b31df44c64b8d3bb8c8a32ae74f8940e",
      _apiRoot = "http://api.musixmatch.com/ws/1.1/",
      _drakeId = "440804",
      _viewsAlbumId = "23361516",
      _tracks = [];
  _lyrics = [];

  function hasTracks() {
    return _tracks.length > 0;
  }

  function fetchTracks() {
    $.ajax({
      type: 'GET',
      data: {
        apikey: _apiKey,
        album_id: _viewsAlbumId,
        format: "jsonp",
        callback: "jsonp_callback"
      },
      url: _apiRoot + "album.tracks.get",
      dataType: "jsonp",
      jsonpCallback: 'jsonp_callback',
      contentType: 'application/json',
      success: function(data) {
        _tracks = data.message.body.track_list;
        fetchNewLyric();
      }
    });
  }

  function fetchNewLyric() {
    var i = Math.floor(Math.random() * (_tracks.length - 0 + 1));
    fetchLyrics(_tracks[i].track);
  }

  function fetchLyrics(track) {
    $.ajax({
      type: 'GET',
      data: {
        apikey: _apiKey,
        track_id: track.track_id,
        format: "jsonp",
        callback: "jsonp_callback"
      },
      url: _apiRoot + "track.snippet.get",
      dataType: "jsonp",
      jsonpCallback: 'jsonp_callback',
      contentType: 'application/json',
      success: function(data) {
        var newLyric = data.message.body.snippet.snippet_body;
        _lyrics.push(newLyric);
        vm.track = track.track_name;
        vm.lyrics = newLyric;
      }
    });
  }

  function placeLyrics() {
    if ( !hasTracks() ) {
      fetchTracks();
    } else {
      fetchNewLyric();
    }
  }

  return {
    placeLyrics: placeLyrics
  }
})();

  // Vue.js View Model
  var vm = new Vue({
    el: '#app',
    data: {
      lyrics: "",
      imgSrc: "",
      track: ""
    },
    methods: {
      regenerate: function() {
        GiphyImgLoader.placeGif();
        MMLyricsLoader.placeLyrics();
      }
    }
  });

  // place initial GIF & Lyrics
  GiphyImgLoader.placeGif();
  MMLyricsLoader.placeLyrics();
});