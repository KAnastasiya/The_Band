export default Track;

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
  'playlist': '.playlist__item',
  'name': '.track__name',
  'duration': '.track__duration',
  'play': '.track__play'
};

/**
 * Render album
 * @constructor
 * @param  {Element}  template  DOM-element, that contains template for card of album
 * @param  {Object}   data      Tracks information (name, duration...)
 */
function Track(template, data) {
  bindAllFunc(this);
  this.data = data;
  this._createTrackElement(template);
  this._setTrackDataToElement();
}

/**
 * Create card of track by template
 * @param  {Element}  template  DOM-element, that contains template for card of album
 */
Track.prototype._createTrackElement = function(template) {
  let trackToClone;

  if ('content' in template) {
    trackToClone = template.content.querySelector(className.playlist);
  } else {
    trackToClone = template.querySelector(className.playlist);
  }

  this.element = trackToClone.cloneNode(true);
};

/**
 * Set data in card of track
 */
Track.prototype._setTrackDataToElement = function() {
  this.element.querySelector(className.name).textContent = this.data.name;
  this.element.querySelector(className.duration).textContent = this.data.duration;
};

/**
 * Insert card of track to the container
 * @param  {Element}  container  DOM-element of container
 */
Track.prototype.renderTo = function(container) {
  container.appendChild(this.element);
  this.element.querySelector(className.play).addEventListener('click', this._onTrackPlay);
};

/**
 * Play track
 */
Track.prototype.playTrack = function() {
  let trackBtnElement = this.element.querySelector(className.play);
  this.element.setAttribute(dataAttr.state, dataAttr.stateValue);
  trackBtnElement.setAttribute('disabled', 'disabled');
  trackBtnElement.setAttribute('title', 'Playing...');
};

/**
 * Stop track
 */
Track.prototype.stopTrack = function() {
  this.element.removeAttribute(dataAttr.state);
  this.element.querySelector(className.play).removeAttribute('disabled');
};

/**
 * Clicking on button 'Play' handler
 * @param  {Object}  event  Event
 */
Track.prototype._onTrackPlay = function(event) {
  event.stopPropagation();
  this._onChooseTrack(this);
};

/**
 * @param   {Function}  callback
 */
Track.prototype.onChooseTrack = function(callback) {
  this._onChooseTrack = callback;
};
