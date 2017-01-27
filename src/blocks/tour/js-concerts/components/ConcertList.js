export default ConcertList;

import { bindAllFunc, addLeadingNull } from './../../../../js-common/utils';

/**
 * Names of data-attributes and its values
 * @constant
 * @type  {Object}
 */
const dataAttr = {
  'state': 'data-state',
  'stateActive': 'is-active',
  'statePast': 'is-past'
};

/**
 * Names of DOM-elements classes
 * @constant
 * @type  {Object}
 */
const className = {
  'concertItem': '.concerts__item',
  'placeAndDate': '.concerts__place-date',
  'city': '.concerts__city'
};

/**
 * Render concerts card
 * @constructor
 * @param  {Element}     template   DOM-element, that contains template for card of artist
 * @param  {ArtistData}  data       Artists information (name, photo...)
 */
function ConcertList(data, index, template, container) {
  bindAllFunc(this);
  this.data = data;
  this.index = index;
  this._createConcertListElement(template);
  this._setConcertListDataToElement();
  this._renderTo(container);
}

/**
 * Create record of artist list by template
 * @param  {Element}  template  DOM-element, that contains template
 */
ConcertList.prototype._createConcertListElement = function(template) {
  let concertToClone;

  if ('content' in template) {
    concertToClone = template.content.querySelector(className.concertItem);
  } else {
    concertToClone = template.querySelector(className.concertItem);
  }

  this.element = concertToClone.cloneNode(true);
};

/**
 * Formatted concerts date
 */
ConcertList.prototype._setFormattedDate = function() {
  let concertDate = this.data.getConcertDate(),
    currentDate = new Date();

  if(concertDate.getDate() === currentDate.getDate()
    && concertDate.getMonth() === currentDate.getMonth()
    && concertDate.getFullYear() === currentDate.getFullYear()) {
    return 'TODAY';
  } else {
    return addLeadingNull(concertDate.getDate()) + '/'
          + addLeadingNull(concertDate.getMonth() + 1) + '/'
          + concertDate.getFullYear();
  }
};

/**
 * Sort conserts on future and past
 */
ConcertList.prototype._deactivatePastConcerts = function() {
  let concertDate = this.data.getConcertDate(),
    concertDateMilliseconds = concertDate.getTime(),
    currentDateMilliseconds = Date.now();

  if(concertDateMilliseconds < currentDateMilliseconds) {
    this.element.setAttribute(dataAttr.state, dataAttr.statePast);
  } else {
    this.element.removeAttribute(dataAttr.state);
  }
};

/**
 * Set data in record of artist list
 */
ConcertList.prototype._setConcertListDataToElement = function() {
  this.element.querySelector(className.placeAndDate).textContent = this.data.getConcertPlace() + ' , ' + this._setFormattedDate();
  this.element.querySelector(className.city).textContent = this.data.getConcertCity();
};

/**
 * Insert record of artists list to the container
 * @param  {Element}  container  DOM-element of container
 */
ConcertList.prototype._renderTo = function(container) {
  container.appendChild(this.element);
  this._deactivatePastConcerts();
  this.element.addEventListener('click', this._onConcertClick);
};

/**
 * Clicking on artists list item handler
 * @param  {Element}  index  Index of clicked DOM-element
 */
ConcertList.prototype.chooseConcert = function(index) {
  let concerts = document.querySelectorAll(className.concertItem);

  for(let i = 0; i < concerts.length; i++) {
    if(concerts[i].getAttribute(dataAttr.state) === dataAttr.stateActive) {
      concerts[i].removeAttribute(dataAttr.state);
    }
  }
  concerts[index].setAttribute(dataAttr.state, dataAttr.stateActive);
};

/**
 * Clicking on artists list item handler
 * @param  {Object}  event  Event
 */
ConcertList.prototype._onConcertClick = function(event) {
  event.stopPropagation();
  this.chooseConcert(this.index);
};
