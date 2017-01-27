export default AlbumData;

import { bindAllFunc } from './../../../../js-common/utils';

/**
 * Loading information from server and givings this data to other modules
 * @constructor
 * @param  {Object}  data  Information from server
 */
function AlbumData(data) {
  bindAllFunc(this);
  this.data = data;
}

/**
 * Get albums name
 * @return  {String}  Name of the album
 */
AlbumData.prototype.getAlbumName = function() {
  return this.data.name;
};

/**
 * Get albums year
 * @return  {String}  Name of the album
 */
AlbumData.prototype.getAlbumYear = function() {
  return this.data.year;
};

/**
 * Get albums cover image
 * @return  {String}  Cover image of the album
 */
AlbumData.prototype.getAlbumCover = function() {
  return this.data.cover;
};

/**
 * Get albums tracks
 * @return  {Object}  List of tracks of album
 */
AlbumData.prototype.getAlbumTrackList = function() {
  return this.data.tracks;
};
