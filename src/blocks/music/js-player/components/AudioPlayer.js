export default AudioPlayer;

import { bindAllFunc } from './../../../../js-common/utils';

/**
 * Names of data-attributes DOM-elements and them values
 * @constant
 * @type  {Object}
 */
const dataAttr = {
  state: 'data-state',
  isActive: 'is-active'
};

/**
 * Names of DOM-elements classes
 * @constant
 * @type  {Object}
 */
const className = {
  'playlist': '.playlist__item',
  'album': '.player__album',
  'track': '.player__track',
  'mp3': '.audio__source-mp3',
  'ogg': '.audio__source-ogg',
  'curProgress': '.player__current-progress'
};

/**
 * Audio player constructor
 * @param  {Element}  container  Audio player container
 * @param  {Element}  state      Play/Pause button
 * @param  {Element}  next       Next track button
 * @param  {Element}  prev       Previous track button
 * @param  {Element}  progress   Total progress element
 */
function AudioPlayer(album, tracks, container, state, next, prev, progress) {
  bindAllFunc(this);
  this.container = container;
  this.state = state;
  this.next = next;
  this.prev = prev;
  this.progress = progress;
  this.loadTracksList(album, tracks);

  // Set event handlers
  this.container.addEventListener('timeupdate', this._onProgress);
  this.progress.addEventListener('click', this._onRewindTrack);
  this.container.addEventListener('ended', this._onNextTrack);

  this.state.addEventListener('click', this._onPlayerState);
  this.next.addEventListener('click', this._onNextTrack);
  this.prev.addEventListener('click', this._onPrevTrack);
}

/**
 * Load playlist
 * @param  {String}  album  Albums name
 * @param  {Array}   list   List of tracks
 */
AudioPlayer.prototype.loadTracksList = function(album, list) {
  this.album = album;
  this.list = list;
};

/**
 * Set new track
 * @param  {Number}  index  Tracks index
 */
AudioPlayer.prototype.setNewTrack = function(index) {
  // Set track details
  for(let i = 0; i < this.list.length; i++) {
    if(+this.list[i].id === index) {
      this.currentTrack = this.list[i];
      this.currentTrackIndex = i;
    }
  }

  document.querySelector(className.album).innerHTML = this.album;
  document.querySelector(className.track).innerHTML = this.currentTrack.name;
  document.querySelector(className.mp3).src = 'server/tracks/' + this.currentTrack.url + '.mp3';
  document.querySelector(className.ogg).src = 'server/tracks/' + this.currentTrack.url + '.ogg';

  // Play track
  this._loadTrack();

  // Activate pr diactivate Next and Previous button
  this._changeControlsState('next', this.next);
  this._changeControlsState('prev', this.prev);
};

/**
 * Reload player
 */
AudioPlayer.prototype._loadTrack = function() {
  this.container.load();
  this._playTrack();
};

/**
 * Play track
 */
AudioPlayer.prototype._playTrack = function() {
  this.container.play();
  this.state.setAttribute(dataAttr.state, 'pause');
  this.state.setAttribute('title', 'Pause');
};

/**
 * Set track on pause
 */
AudioPlayer.prototype._pauseTrack = function() {
  this.container.pause();
  this.state.setAttribute(dataAttr.state, 'play');
  this.state.setAttribute('title', 'Play');
};

/**
 * Find next or previous track
 * @param  {String}  direction  Type of control, which was clicked. Can be 'next' or 'prev'
 */
AudioPlayer.prototype._findNextTrack = function(direction) {
  let anotherTrackIndex;

  if(direction === 'prev') {
    if( (this.currentTrackIndex - 1) >= 0 ) {
      anotherTrackIndex = this.currentTrackIndex - 1;
    }
  } else {
    if( (this.currentTrackIndex + 1) < this.list.length ) {
      anotherTrackIndex = this.currentTrackIndex + 1;
    }
  }

  return anotherTrackIndex;
};

/**
 * Disabled or activate player controls
 * @param  {String}   direction  Type of control, which was clicked. Can be 'next' or 'prev'
 * @param  {Element}  control    DOM-element, which clicked
 */
AudioPlayer.prototype._changeControlsState = function(direction, control) {
  if( this._findNextTrack(direction) >= 0 ) {
    control.removeAttribute('disabled');
  } else {
    control.setAttribute('disabled', 'disabled');
  }
};

/**
 * Play new track
 * @param  {String}  direction  Type of control, which was clicked. Can be 'next' or 'prev'
 */
AudioPlayer.prototype._playNewTrack = function(direction) {
  let nextTrackIndex = this._findNextTrack(direction);

  if(nextTrackIndex >= 0) {
    let trackListElements = document.querySelectorAll(className.playlist);

    for(let i = 0; i < trackListElements.length; i++) {
      if( trackListElements[i].hasAttribute(dataAttr.state) ) {
        trackListElements[i].removeAttribute(dataAttr.state);
      }
    }

    this.setNewTrack(nextTrackIndex);
    this._onChooseTrack(nextTrackIndex);
  }

  this._changeControlsState('next', this.next);
  this._changeControlsState('prev', this.prev);
};

/**
 * Clicking button 'Previous' handler
 */
AudioPlayer.prototype._onPrevTrack = function() {
  this._playNewTrack('prev');
};

/**
 * Clicking button 'Next' handler
 */
AudioPlayer.prototype._onNextTrack = function() {
  this._playNewTrack('next');
};

/**
 * Clicking on button 'Play/Pause' button handler
 */
AudioPlayer.prototype._onPlayerState = function() {
  if (this.container.paused) {
    this._playTrack();
  } else {
    this._pauseTrack();
  }
};

/**
 * Show playing progress
 */
AudioPlayer.prototype._onProgress = function() {
  let progress = Math.floor(this.container.currentTime) / Math.floor(this.container.duration);
  document.querySelector(className.curProgress).style.width = Math.floor(progress * this.progress.offsetWidth) + 'px';
};

/**
 * Rewind track
 * @param   {Object}  event
 */
AudioPlayer.prototype._onRewindTrack = function(event) {
  this.container.currentTime = this.container.duration * (event.offsetX / this.progress.getBoundingClientRect().width);
};

/**
 * @param   {Function}  callback
 */
AudioPlayer.prototype.onChooseTrack = function(callback) {
  this._onChooseTrack = callback;
};
