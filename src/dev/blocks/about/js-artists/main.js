import ArtistData from './components/ArtistData';
import ArtistList from './components/ArtistList';
import { loadingIsProgress, endLoading, showLoadingError } from './../../../js-common/utils';

/**
 * Server URL
 * @constant
 * @type  {String}
 */
const DATA_URL = 'server/artists.json';

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
const aboutContainer = document.querySelector('.artist'),
  artistListItemTemplate = document.querySelector('#artists-item'),
  artistRecordContainer = document.querySelector('.artists__list');

/**
 * Albums, loaded from server
 * @type  {Array}
 */
let artistDataList = [];

/**
 * Loading data from server
 */
(function loadData() {
  let xhr = new XMLHttpRequest();
  loadingIsProgress(aboutContainer);

  // If information loaded
  xhr.onload = function(event) {
    let artists = JSON.parse(event.target.response);

    endLoading(aboutContainer);

    artistDataList = artists.map(function(artist) {
      return new ArtistData(artist);
    });

    artistDataList.forEach(function(artistData) {
      let artistList = new ArtistList(artistData, artistListItemTemplate, artistRecordContainer);
      artistList.chooseArtist(document.querySelectorAll('.artists__item')[0]);
    });
  };

  // If errors occurred when data was loading
  xhr.onerror = showLoadingError(aboutContainer);
  xhr.timeout = SERVER_TIMEOUT;
  xhr.ontimeout = showLoadingError(aboutContainer);

  // Send request to server
  xhr.open('GET', DATA_URL);
  xhr.send();
})();
