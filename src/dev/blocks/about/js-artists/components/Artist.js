export default Artist;

import { bindAllFunc } from './../../../../js-common/utils';

/**
 * Path to default photo
 * @constant
 * @type  {String}
 */
const DEFAULT_PHOTO = 'images/about/img/photo.png';

/**
 * Timeout of loading photo from server
 * @constant
 * @type  {Number}
 */
const LOAD_PHOTO_TIMEOUT = 10000;

/**
 * Names of DOM-elements classes
 * @constant
 * @type  {Object}
 */
const className = {
  'photo': '.artist__photo',
  'firstName': '.artist__first-name',
  'secondName': '.artist__second-name',
  'descr': '.artist__descr'
};

/**
 * Render artist card
 * @constructor
 * @param  {ArtistData}  data  Artists information (name, photo...)
 */
function Artist(data) {
  bindAllFunc(this);
  this.data = data;
  this._setArtistDataToElement();
}

/**
 * Set data in card of artist
 */
Artist.prototype._setArtistDataToElement = function() {
  // Load photo
  let photo = new Image(380, 380),
    photoLoadTimeout;

  // If cover loaded
  photo.onload = function() {
    clearTimeout(photoLoadTimeout);
    document.querySelector(className.photo).src = photo.src;
  };
  photo.src = this.data.getArtistPhoto();

  // If download has failed
  photo.onerror = function() {
    document.querySelector(className.photo).src = DEFAULT_PHOTO;
  };

  photoLoadTimeout = setTimeout( function() {
    document.querySelector(className.photo).src = DEFAULT_PHOTO;
  }, LOAD_PHOTO_TIMEOUT);

  // Set other attributes
  document.querySelector(className.firstName).textContent = this.data.getArtistFirstName();
  document.querySelector(className.secondName).textContent = this.data.getArtistSecondName();
  document.querySelector(className.descr).textContent = this.data.getArtistDescription();
};
