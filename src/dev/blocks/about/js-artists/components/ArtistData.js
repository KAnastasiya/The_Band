export default ArtistData;

import { bindAllFunc } from './../../../../js-common/utils';

/**
 * Loading information from server and givings this data to other modules
 * @constructor
 * @param  {Object}  data  Information from server
 */
function ArtistData(data) {
  bindAllFunc(this);
  this.data = data;
}

/**
 * Get artists first name
 * @return  {String}  First name of the artist
 */
ArtistData.prototype.getArtistFirstName = function() {
  return this.data.firstName;
};

/**
 * Get artists second name
 * @return  {String}  Second name of the artist
 */
ArtistData.prototype.getArtistSecondName = function() {
  return this.data.secondName;
};

/**
 * Get artists task
 * @return  {String}  Artists task
 */
ArtistData.prototype.getArtistTask = function() {
  return this.data.task;
};

/**
 * Get artists photo
 * @return  {String}  Artists photo
 */
ArtistData.prototype.getArtistPhoto = function() {
  return this.data.photo;
};

/**
 * Get artists description
 * @return  {Object}  Artists description
 */
ArtistData.prototype.getArtistDescription = function() {
  return this.data.descr;
};
