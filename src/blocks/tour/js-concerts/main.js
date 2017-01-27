import ConcertData from './components/ConcertData';
import ConcertList from './components/ConcertList';
import Concert from './components/Concert';
import { loadingIsProgress, endLoading, showLoadingError } from './../../../js-common/utils';

/**
 * Server URL
 * @constant
 * @type  {String}
 */
const DATA_URL = 'server/concerts.json';

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
const futureConcertsContainer = document.querySelector('.artist'),
  concertListItemTemplate = document.querySelector('#concerts-item'),
  concertRecordContainer = document.querySelector('.concerts__list'),
  concertTemplate = document.querySelector('#future-concert'),
  futureConcertContainer = document.querySelector('.future-concert__list');

/**
 * Albums, loaded from server
 * @type  {Array}
 */
let concertDataList = [];

/**
 * Next concerts
 * @type  {Array}
 */
let nextConcerts = [];

/**
 * Loading data from server
 */
(function loadData() {
  let xhr = new XMLHttpRequest();
  loadingIsProgress(futureConcertsContainer);

  // If information loaded
  xhr.onload = function(event) {
    let concerts = JSON.parse(event.target.response);

    endLoading(futureConcertsContainer);

    concertDataList = concerts.map(function(concert) {
      return new ConcertData(concert);
    });

    // Render concerts list
    concertDataList.forEach(function(concertData, index, array) {
      let concertList = new ConcertList(concertData, index, concertListItemTemplate, concertRecordContainer);

      // Find next concerts
      let concertDate = concertData.getConcertDate(),
        concertDateMilliseconds = concertDate.getTime(),
        currentDateMilliseconds = Date.now();

      if(concertDateMilliseconds > currentDateMilliseconds) {
        nextConcerts.push(index);
        // Render future concerts
        let concert = new Concert(concertData, concertTemplate, futureConcertContainer);
      }

      // Set nearest next concert as default
      if(index === array.length - 1) {
        concertList.chooseConcert(nextConcerts[0]);
      }
    });
  };

  // If errors occurred when data was loading
  xhr.onerror = showLoadingError(futureConcertsContainer);
  xhr.timeout = SERVER_TIMEOUT;
  xhr.ontimeout = showLoadingError(futureConcertsContainer);

  // Send request to server
  xhr.open('GET', DATA_URL);
  xhr.send();
})();
