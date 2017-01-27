import AlbumData from './components/AlbumData';
import Album from './components/Album';
import PlayList from './components/PlayList';
import AudioPlayer from './components/AudioPlayer';
import { loadingIsProgress, endLoading, showLoadingError } from './../../../js-common/utils';

/**
 * Server URL
 * @constant
 * @type  {String}
 */
const DATA_URL = 'server/albums.json';

/**
 * Timeout for loading data from server
 * @constant
 * @type  {Number}
 */
const SERVER_TIMEOUT = 10000;

/**
 * DOM-elements
 * @constant
 * @type  {Element}
 */
const albumTemplate = document.querySelector('#discography-item'),
  albumsContainer = document.querySelector('.discography__list'),
  tracksContainer = document.querySelector('.playlist__list'),
  trackTemplate = document.querySelector('#playlist-item'),
  playerContainer = document.querySelector('.audio'),
  trackState = document.querySelector('.player__state'),
  nextTrack = document.querySelector('.player__next'),
  prevTrack = document.querySelector('.player__prev'),
  progress = document.querySelector('.player__total-progress');

  /**
 * Albums, loaded from server
 * @type  {Array}
 */
let albumDataList = [];

/**
 * Loading data from server
 */
(function loadData() {
  let xhr = new XMLHttpRequest();
  loadingIsProgress(albumsContainer);

  // If information loaded
  xhr.onload = function(event) {
    let albums = JSON.parse(event.target.response),
      firstAlbum = null;

    endLoading(albumsContainer);

    albumDataList = albums.map(function(album) {
      return new AlbumData(album);
    });

    albumDataList.forEach(function(albumData) {
      let album = new Album(albumTemplate, albumData),
        albumTracks = albumData.getAlbumTrackList();

      // Render albums
      album.renderTo(albumsContainer);

      // Albume selection
      album.onChooseAlbum(function() {
        let albumName = albumData.getAlbumName(),
          playList = new PlayList(trackTemplate, albumTracks, tracksContainer),
          player = new AudioPlayer(albumName, albumTracks, playerContainer, trackState, nextTrack, prevTrack, progress);

        // Set first albums track as default
        player.setNewTrack(0);

        // Synchronization track, that playing in player, and track, that chosen in playlist
        playList.onChooseTrack((index) => {
          player.setNewTrack(index);
        });

        player.onChooseTrack((index) => {
          playList.setNewTrack(index);
        });
      });

      firstAlbum = firstAlbum || album;
    });

    // Set first album as default
    firstAlbum.chooseAlbum(document.querySelectorAll('.discography__item')[0]);
  };

  // If errors occurred when data was loading
  xhr.onerror = showLoadingError(albumsContainer);
  xhr.timeout = SERVER_TIMEOUT;
  xhr.ontimeout = showLoadingError(albumsContainer);

  // Send request to server
  xhr.open('GET', DATA_URL);
  xhr.send();
})();
