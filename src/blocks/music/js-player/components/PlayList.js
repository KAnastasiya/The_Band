export default PlayList;

import Track from './Track';
import { bindAllFunc } from './../../../../js-common/utils';

/**
 * Names of DOM-elements classes
 * @constant
 * @type  {Object}
 */
const className = {
  'playlist': '.playlist__item'
};

/**
 * Render playlist
 * @constructor
 * @param  {Element}  template   DOM-element, that contains template for card of playlist
 * @param  {Array}    data       List of tracks
 * @param  {Element}  container  DOM-element, that contains playlist
 */
function PlayList(template, data, container) {
  bindAllFunc(this);
  // this.album = album;
  this.data = data;
  this.renderTracksList(template, container);
}

/**
 * Render list of tracks
 * @param  {Element}  template    DOM-element, that contains template for card of playlist
 * @param  {Element}  container   DOM-element, that contains playlist
 */
PlayList.prototype.renderTracksList = function(template, container) {
  let elements = document.querySelectorAll(className.playlist),
    tracksToRender = [];

  // Remove tracks for previous albume
  for(let i = 0; i < elements.length; i++) {
    elements[i].remove();
  }

  // Render tracks for current albume
  this.data.forEach((data, index) => {
    let track = new Track(template, data);

    // Render track
    track.renderTo(container);
    tracksToRender.push(track);

    // Choose track
    track.onChooseTrack(() => {
      this.chooseTrack(track);
      this._onChooseTrack(index);
    });
  });

  this.tracksToRender = tracksToRender;

  // Choose first track as default
  this.chooseTrack(tracksToRender[0]);
};

/**
 * Choose track
 * @param  {Track}  track  Tracks information
 */
PlayList.prototype.chooseTrack = function(track) {
  for(let i = 0; i < this.tracksToRender.length; i++) {
    this.tracksToRender[i].stopTrack();
  }
  track.playTrack();
};

/**
 * [setNewTrack description]
 * @param  {Number}  index  Index of new track
 */
PlayList.prototype.setNewTrack = function(index) {
  this.chooseTrack(this.tracksToRender[index]);
};

/**
 * @param   {Function}  callback
 */
PlayList.prototype.onChooseTrack = function(callback) {
  this._onChooseTrack = callback;
};
