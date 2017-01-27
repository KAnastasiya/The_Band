export default ArtistList;

import Artist from './Artist';
import { bindAllFunc } from './../../../../js-common/utils';

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
  'artistItem': '.artists__item',
  'name': '.artists__name',
  'task': '.artists__task'
};

/**
 * Render artists card
 * @constructor
 * @param  {Element}     template   DOM-element, that contains template for card of artist
 * @param  {ArtistData}  data       Artists information (name, photo...)
 */
function ArtistList(data, template, container) {
  bindAllFunc(this);
  this.data = data;
  this._createArtistListElement(template);
  this._setArtistListDataToElement();
  this._renderTo(container);
}

/**
 * Create record of artist list by template
 * @param  {Element}  template  DOM-element, that contains template
 */
ArtistList.prototype._createArtistListElement = function(template) {
  let artistToClone;

  if ('content' in template) {
    artistToClone = template.content.querySelector(className.artistItem);
  } else {
    artistToClone = template.querySelector(className.artistItem);
  }

  this.element = artistToClone.cloneNode(true);
};

/**
 * Set data in record of artist list
 */
ArtistList.prototype._setArtistListDataToElement = function() {
  this.element.querySelector(className.name).textContent = this.data.getArtistFirstName() + ' '
                                                        + this.data.getArtistSecondName();
  this.element.querySelector(className.task).textContent = this.data.getArtistTask();
};

/**
 * Insert record of artists list to the container
 * @param  {Element}  container  DOM-element of container
 */
ArtistList.prototype._renderTo = function(container) {
  container.appendChild(this.element);
  this.element.addEventListener('click', this._onArtistClick);
};

/**
 * Clicking on artists list item handler
 * @param  {Element}  artistElement  DOM-element, that clicked
 */
ArtistList.prototype.chooseArtist = function(element) {
  let artists = document.querySelectorAll(className.artistItem);

  for(let i = 0; i < artists.length; i++) {
    artists[i].removeAttribute(dataAttr.state);
  }
  element.setAttribute(dataAttr.state, dataAttr.stateValue);

  let artist = new Artist(this.data);
};

/**
 * Clicking on artists list item handler
 * @param  {Object}  event  Event
 */
ArtistList.prototype._onArtistClick = function(event) {
  event.stopPropagation();
  this.chooseArtist(this.element);
};
