export default ConcertData;

import { bindAllFunc } from './../../../../js-common/utils';

/**
 * Loading information from server and givings this data to other modules
 * @constructor
 * @param  {Object}  data  Information from server
 */
function ConcertData(data) {
  bindAllFunc(this);
  this.data = data;
}

/**
 * Get concerts place
 * @return  {String}  Place, where concert will be
 */
ConcertData.prototype.getConcertPlace = function() {
  return this.data.place;
};

/**
 * Get concerts city and country
 * @return  {String}  Concerts city
 */
ConcertData.prototype.getConcertCity = function() {
  return this.data.city;
};

/**
 * Get concerts date
 * @return  {String}  Concerts date
 */
ConcertData.prototype.getConcertDate = function() {
  return new Date(this.data.date);
};
