export default Album;

import { bindAllFunc } from './../../../../js-common/utils';

/**
 * Timeout of loading cover image from server
 * @constant
 * @type  {Number}
 */
const LOAD_COVER_TIMEOUT = 10000;

/**
 * Path to default cover image
 * @constant
 * @type  {String}
 */
const DEFAULT_COVER = 'images/music/img/cover.png';

/**
 * Names of data-attributes and its values
 * @constant
 * @type  {Object}
 */
const dataAttr = {
  'state': 'data-state',
  'stateValue': 'is-active'
};

/**
 * Names of DOM-elements classes
 * @constant
 * @type  {Object}
 */
const className = {
  'discography': '.discography__item',
  'cover': '.album__cover',
  'name': '.album__name',
  'year': '.album__year',
  'play': '.album__play'
};

/**
 * Render album
 * @constructor
 * @param  {Element}    template   DOM-element, that contains template for card of album
 * @param  {AlbumData}  data  Albums information (name, year, tracks...)
 */
function Album(template, data) {
  bindAllFunc(this);
  this.data = data;
  this._createAlbumElement(template);
  this._setAlbumDataToElement();
}

/**
 * Create card of album by template
 * @param  {Element}  template  DOM-element, that contains template
 */
Album.prototype._createAlbumElement = function(template) {
  let albumToClone;

  if ('content' in template) {
    albumToClone = template.content.querySelector(className.discography);
  } else {
    albumToClone = template.querySelector(className.discography);
  }

  this.element = albumToClone.cloneNode(true);
};

/**
 * Set data in card of album
 */
Album.prototype._setAlbumDataToElement = function() {
  this.element.querySelector(className.name).textContent = this.data.getAlbumName();
  this.element.querySelector(className.year).textContent = this.data.getAlbumYear();
};

/**
 * Load albums cover image
 */
Album.prototype._loadAlbumCover = function() {
  let coverImage = new Image(380, 380),
    coverImageLoadTimeout;

  // If cover loaded
  coverImage.onload = function() {
    clearTimeout(coverImageLoadTimeout);
    document.querySelector(className.cover).src = coverImage.src;
  };
  coverImage.src = this.data.getAlbumCover();

  // If download has failed
  coverImage.onerror = function() {
    document.querySelector(className.cover).src = DEFAULT_COVER;
  };

  coverImageLoadTimeout = setTimeout( function() {
    document.querySelector(className.cover).src = DEFAULT_COVER;
  }, LOAD_COVER_TIMEOUT);
};

/**
 * Insert card of album to the container
 * @param  {Element}  container  DOM-element of container
 */
Album.prototype.renderTo = function(container) {
  container.appendChild(this.element);
  this.element.querySelector(className.play).addEventListener('click', this._onAlbumListen);
};

/**
 * Cliking on 'Listen' button handler
 * @param  {Object}  event  Event
 */
Album.prototype._onAlbumListen = function(event) {
  event.stopPropagation();
  this.chooseAlbum(this.element);
};

/**
 * Choose album
 * @param  {Element}  album  DOM-element, that clicked
 */
Album.prototype.chooseAlbum = function(album) {
  let albums = document.querySelectorAll(className.discography);

  for(let i = 0; i < albums.length; i++) {
    albums[i].removeAttribute(dataAttr.state);
    albums[i].querySelector(className.play).removeAttribute('disabled');
  }
  album.setAttribute(dataAttr.state, dataAttr.stateValue);
  album.querySelector(className.play).setAttribute('disabled', 'disabled');

  this._loadAlbumCover();
  this._onChooseAlbum();
};

/**
 * @param   {Function}  callback
 */
Album.prototype.onChooseAlbum = function(callback) {
  this._onChooseAlbum = callback;
};
